// /src/pages/AdminDashboard.jsx
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSemesterConfig, getPurchases, updatePurchase } from '../lib/appwrite';
import { calculateBudgetMetrics, calculateAverageWeeklyUsage } from '../lib/calculations';

import BudgetDisplay from '../components/budget/BudgetDisplay';
import PurchaseHistory from '../components/budget/PurchaseHistory';
import UsageReport from '../components/budget/UsageReport';
import Modal from '../components/ui/Modal';
import PurchaseForm from '../components/budget/PurchaseForm';
import ConfigForm from '../components/budget/ConfigForm';
import Button from '../components/ui/Button';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [config, setConfig] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [usageStats, setUsageStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [configData, purchasesData] = await Promise.all([
        getSemesterConfig(),
        getPurchases(),
      ]);
      
      const purchaseDocs = purchasesData.documents;
      setConfig(configData);
      setPurchases(purchaseDocs);

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
  }, [fetchData]);

  const handleSuccess = () => {
    setIsPurchaseModalOpen(false);
    setIsConfigModalOpen(false);
    fetchData();
  };

  const handleToggleItemStatus = async (itemName, newStatus) => {
    try {
      // find all purchase documents that match this item name
      const purchasesToUpdate = purchases.filter(p => p.itemName.toLowerCase() === itemName.toLowerCase());
      
      // create an array of promises to update each document
      const updatePromises = purchasesToUpdate.map(p => 
        updatePurchase(p.$id, { isActiveForProjection: newStatus })
      );
      
      // wait for all updates to complete
      await Promise.all(updatePromises);
      
      // refetch all data to update the ui
      fetchData();
    } catch (err) {
      console.error('Failed to toggle item status:', err);
      setError('Failed to update item status.');
    }
  };
  
  const uniqueItemNames = useMemo(() => {
    return [...new Set(purchases.map(p => p.itemName).sort())];
  }, [purchases]);

  if (isLoading) {
    return <div className="p-8">Loading Dashboard...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <>
      <Modal 
        title="Log a New Purchase" 
        isOpen={isPurchaseModalOpen} 
        onClose={() => setIsPurchaseModalOpen(false)}
      >
        <PurchaseForm onSuccess={handleSuccess} itemNames={uniqueItemNames} />
      </Modal>
      
      <Modal 
        title="Semester Settings"
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      >
        <ConfigForm config={config} onSuccess={handleSuccess} />
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
            <UsageReport usageStats={usageStats} onToggleItemStatus={handleToggleItemStatus} /> 
            <PurchaseHistory purchases={purchases} />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;