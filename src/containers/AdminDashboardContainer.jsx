// /src/containers/AdminDashboardContainer.jsx
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSemesterConfig, getPurchases, updatePurchase, deletePurchase, getShoppingList, removeFromShoppingList, getSuggestions, addToShoppingList } from '../lib/appwrite';
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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [configData, purchasesData, shoppingListData, suggestionsData] = await Promise.all([
        getSemesterConfig(),
        getPurchases(),
        getShoppingList(),
        getSuggestions(),
      ]);
      const purchaseDocs = purchasesData.documents;
      setConfig(configData);
      setPurchases(purchaseDocs);
      setShoppingList(shoppingListData.documents);
      setSuggestions(suggestionsData.documents);
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
    />
  );
};

export default AdminDashboardContainer;