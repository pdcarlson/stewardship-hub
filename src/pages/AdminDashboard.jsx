// /src/pages/AdminDashboard.jsx
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSemesterConfig, getPurchases, updatePurchase, deletePurchase, getShoppingList, removeFromShoppingList } from '../lib/appwrite';
import { calculateBudgetMetrics, calculateAverageWeeklyUsage } from '../lib/calculations';

import BudgetDisplay from '../components/budget/BudgetDisplay';
import PurchaseHistory from '../components/budget/PurchaseHistory';
import UsageReport from '../components/budget/UsageReport'; 
import ShoppingList from '../components/budget/ShoppingList'; // import new component
import Modal from '../components/ui/Modal';
import PurchaseForm from '../components/budget/PurchaseForm';
import ConfigForm from '../components/budget/ConfigForm';
import Button from '../components/ui/Button';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [config, setConfig] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [shoppingList, setShoppingList] = useState([]); // new state
  const [metrics, setMetrics] = useState(null);
  const [usageStats, setUsageStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [configData, purchasesData, shoppingListData] = await Promise.all([
        getSemesterConfig(),
        getPurchases(),
        getShoppingList(),
      ]);
      
      const purchaseDocs = purchasesData.documents;
      setConfig(configData);
      setPurchases(purchaseDocs);
      setShoppingList(shoppingListData.documents); // set shopping list state

      if (configData && purchaseDocs) {
        const weeklyUsage = calculateAverageWeeklyUsage(purchaseDocs, configData);
        setUsageStats(weeklyUsage);
        const calculatedMetrics = calculateBudgetMetrics(configData, purchaseDocs, weeklyUsage);
        setMetrics(calculatedMetrics);
      }
    } catch (err) {
      setError('Failed to fetch dashboard data. Please make sure semester config is set.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handlePurchaseFormSuccess = () => {
    setIsPurchaseModalOpen(false);
    setEditingPurchase(null);
    fetchData();
  };

  const handleConfigSuccess = () => {
    setIsConfigModalOpen(false);
    fetchData();
  }

  const handleEditPurchase = (purchase) => {
    setEditingPurchase(purchase);
    setIsPurchaseModalOpen(true);
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
      fetchData(); // refetch to update the list
    } catch (err) {
      console.error('Failed to remove item from shopping list:', err);
      setError('Failed to update shopping list.');
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
  
  const uniqueItemNames = useMemo(() => {
    return [...new Set(purchases.map(p => p.itemName).sort())];
  }, [purchases]);
  
  const purchaseModalTitle = editingPurchase ? 'Edit Purchase' : 'Log a New Purchase';

  if (isLoading) {
    return <div className="p-8">Loading Dashboard...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <>
      <Modal 
        title={purchaseModalTitle}
        isOpen={isPurchaseModalOpen} 
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setEditingPurchase(null);
        }}
      >
        <PurchaseForm 
          onSuccess={handlePurchaseFormSuccess} 
          itemNames={uniqueItemNames}
          purchaseToEdit={editingPurchase}
        />
      </Modal>
      
      <Modal 
        title="Semester Settings"
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      >
        <ConfigForm config={config} onSuccess={handleConfigSuccess} />
      </Modal>

      <div className="min-h-screen bg-light">
        <header className="bg-[#1f2937] shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-300">Welcome, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setIsConfigModalOpen(true)}>Settings</Button>
              <Button onClick={() => setIsPurchaseModalOpen(true)}>New Purchase</Button>
              <Button onClick={logout} variant="secondary">Logout</Button>
            </div>
          </div>
        </header>

        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {metrics && <BudgetDisplay metrics={metrics} />}
            <ShoppingList items={shoppingList} onRemove={handleRemoveFromShoppingList} />
            <UsageReport usageStats={usageStats} onToggleItemStatus={handleToggleItemStatus} /> 
            <PurchaseHistory 
              purchases={purchases}
              onEdit={handleEditPurchase}
              onDelete={handleDeletePurchase}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;