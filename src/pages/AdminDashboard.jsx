// /src/pages/AdminDashboard.jsx
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSemesterConfig, getPurchases } from '../lib/appwrite';
import { calculateBudgetMetrics } from '../lib/calculations';

import BudgetDisplay from '../components/budget/BudgetDisplay';
import PurchaseHistory from '../components/budget/PurchaseHistory';
import Modal from '../components/ui/Modal';
import PurchaseForm from '../components/budget/PurchaseForm';
import ConfigForm from '../components/budget/ConfigForm';
import Button from '../components/ui/Button';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [config, setConfig] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // state for the two modals
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // wrap data fetching in usecallback to prevent it from being recreated on every render
  const fetchData = useCallback(async () => {
    try {
      const [configData, purchasesData] = await Promise.all([
        getSemesterConfig(),
        getPurchases(),
      ]);
      
      setConfig(configData);
      setPurchases(purchasesData.documents);

      if (configData && purchasesData.documents) {
        // updated to pass the whole config object
        const calculatedMetrics = calculateBudgetMetrics(configData, purchasesData.documents);
        setMetrics(calculatedMetrics);
      }
    } catch (err) {
      setError('failed to fetch dashboard data. please make sure semester config is set.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // fetch data when the component first loads
  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  // success handler for both forms
  const handleSuccess = () => {
    setIsPurchaseModalOpen(false);
    setIsConfigModalOpen(false);
    fetchData(); // refetch all data
  };

  if (isLoading) {
    return <div className="p-8">loading dashboard...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <>
      {/* purchase modal */}
      <Modal 
        title="log a new purchase" 
        isOpen={isPurchaseModalOpen} 
        onClose={() => setIsPurchaseModalOpen(false)}
      >
        <PurchaseForm onSuccess={handleSuccess} />
      </Modal>
      
      {/* config modal */}
      <Modal 
        title="semester settings"
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      >
        <ConfigForm config={config} onSuccess={handleSuccess} />
      </Modal>

      <div className="min-h-screen bg-light">
        <header className="bg-[#1f2937] shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              {/* updated text colors for better readability */}
              <h1 className="text-xl font-semibold text-white">admin dashboard</h1>
              <p className="text-sm text-gray-300">welcome, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setIsConfigModalOpen(true)}>settings</Button>
              <Button onClick={() => setIsPurchaseModalOpen(true)}>new purchase</Button>
              <Button onClick={logout} variant="secondary">logout</Button>
            </div>
          </div>
        </header>

        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {metrics && <BudgetDisplay metrics={metrics} />}
            <PurchaseHistory purchases={purchases} />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;