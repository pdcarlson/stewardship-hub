// /src/containers/AdminDashboardContainer.jsx
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getSemesterConfig, getPurchases, updatePurchase, deletePurchase, 
  getShoppingList, removeFromShoppingList, getSuggestions, addToShoppingList,
  getVerificationRequests, updateVerificationRequestStatus, executeApproveRequest
} from '../lib/appwrite';
import { calculateBudgetMetrics, calculateAverageWeeklyUsage } from '../lib/calculations';
import { AdminDashboardUI } from '../pages/AdminDashboard';

const AdminDashboardContainer = () => {
  const { user, logout, prefs, updatePrefs } = useAuth();
  const [config, setConfig] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [usageStats, setUsageStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [configData, purchasesData, shoppingListData, suggestionsData, requestsData] = await Promise.all([
        getSemesterConfig(),
        getPurchases(),
        getShoppingList(),
        getSuggestions(),
        getVerificationRequests(),
      ]);
      
      const purchaseDocs = purchasesData.documents;
      setPurchases(purchaseDocs);
      setShoppingList(shoppingListData.documents);
      setSuggestions(suggestionsData.documents);
      setRequests(requestsData.documents);
      setConfig(configData);

      if (requestsData.total > 0 && !isVerificationModalOpen) {
        setIsVerificationModalOpen(true);
      }
      
      if (configData && purchaseDocs) {
        const weeklyUsage = calculateAverageWeeklyUsage(purchaseDocs, configData);
        setUsageStats(weeklyUsage);
        const calculatedMetrics = calculateBudgetMetrics(configData, purchaseDocs, weeklyUsage);
        setMetrics(calculatedMetrics);
      }
    } catch (err) {
      setError('Failed to fetch dashboard data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSuccess = () => {
    fetchData();
  };

  const handleDeletePurchase = async (purchaseId) => {
    if (window.confirm('Are you sure you want to delete this purchase?')) {
      try {
        await deletePurchase(purchaseId);
        fetchData();
      } catch (err) {
        setError('Failed to delete purchase.');
        console.error(err);
      }
    }
  };

  const handleRemoveFromShoppingList = async (itemId) => {
    try {
      await removeFromShoppingList(itemId);
      setShoppingList(prevList => prevList.filter(item => item.$id !== itemId));
    } catch (err) {
      console.error('Failed to remove item from shopping list:', err);
      setError('Failed to update shopping list.');
    }
  };

  const handleReportOutOfStock = async (itemName) => {
    try {
      await addToShoppingList(itemName);
      const updatedShoppingList = await getShoppingList();
      setShoppingList(updatedShoppingList.documents);
    } catch (err) {
      console.error("failed to report item:", err);
      setError("failed to add item to shopping list.");
    }
  };
  
  const handleApproveRequest = async (request) => {
    if (!window.confirm(`Are you sure you want to approve ${request.userName}?`)) {
      return;
    }
    
    try {
      const payload = {
        userId: request.userId,
        requestId: request.$id,
        userEmail: request.email,
      };
      
      await executeApproveRequest(payload);
      
      setRequests(prev => prev.filter(req => req.$id !== request.$id));
      alert(`${request.userName} has been approved and granted member access.`);

    } catch (error) {
      console.error('failed to approve request:', error);
      alert('there was an error approving the request. please check the function logs in appwrite.');
    }
  };

  const handleDenyRequest = async (requestId) => {
    try {
      await updateVerificationRequestStatus(requestId, 'denied');
      setRequests(prev => prev.filter(req => req.$id !== requestId));
    } catch (error) {
      console.error('failed to deny request', error);
      alert('could not deny request. please try again.');
    }
  };

  const handleToggleItemStatus = async (itemName, newStatus) => {
    try {
      const purchasesToUpdate = purchases.filter(p => p.itemName.toLowerCase() === itemName.toLowerCase());
      const updatePromises = purchasesToUpdate.map(p =>
        updatePurchase(p.$id, { isActiveForProjection: newStatus })
      );
      await Promise.all(updatePromises);
      fetchData();
    } catch (err) {
      console.error('Failed to toggle item status:', err);
      setError('Failed to update item status.');
    }
  };

  return (
    <AdminDashboardUI
      user={user}
      config={config}
      purchases={purchases}
      shoppingList={shoppingList}
      suggestions={suggestions}
      metrics={metrics}
      usageStats={usageStats}
      isLoading={isLoading}
      error={error}
      prefs={prefs}
      onUpdatePrefs={updatePrefs}
      onLogout={logout}
      onFetchData={fetchData}
      onSuccess={handleSuccess}
      onDeletePurchase={handleDeletePurchase}
      onRemoveFromShoppingList={handleRemoveFromShoppingList}
      onReportOutOfStock={handleReportOutOfStock}
      onToggleItemStatus={handleToggleItemStatus}
      requests={requests}
      isVerificationModalOpen={isVerificationModalOpen}
      onVerificationModalOpen={() => setIsVerificationModalOpen(true)}
      onVerificationModalClose={() => setIsVerificationModalOpen(false)}
      onApproveRequest={handleApproveRequest}
      onDenyRequest={handleDenyRequest}
    />
  );
};

export default AdminDashboardContainer;