// /src/pages/AdminDashboard.jsx
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSemesterConfig, getPurchases } from '../lib/appwrite';
import { calculateBudgetMetrics } from '../lib/calculations';

import BudgetDisplay from '../components/budget/BudgetDisplay';
import PurchaseHistory from '../components/budget/PurchaseHistory';
import Modal from '../components/ui/Modal';
import PurchaseForm from '../components/budget/PurchaseForm';
import Button from '../components/ui/Button';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [config, setConfig] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // state to manage the visibility of the new purchase modal
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        const calculatedMetrics = calculateBudgetMetrics(
          configData.totalBudget, configData.startDate, configData.endDate, purchasesData.documents
        );
        setMetrics(calculatedMetrics);
      }
    } catch (err) {
      setError('Failed to fetch dashboard data. Please make sure semester config is set.');
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

  // this function is passed to the form; it closes the modal and refreshes the data
  const handlePurchaseSuccess = () => {
    setIsModalOpen(false);
    fetchData();
  };

  if (isLoading) {
    return <div className="p-8">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <>
      {/* the modal is now part of the component tree, controlled by ismodalopen state */}
      <Modal 
        title="Log a New Purchase" 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <PurchaseForm onSuccess={handlePurchaseSuccess} />
      </Modal>

      <div className="min-h-screen bg-light">
        <header className="bg-[#1f2937] shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              {/* updated text colors for better readability */}
              <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-300">Welcome, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* the button now opens the modal when clicked */}
              <Button onClick={() => setIsModalOpen(true)}>New Purchase</Button>
              <Button onClick={logout} variant="secondary">Logout</Button>
            </div>
          </div>
        </header>

        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {config && <BudgetDisplay metrics={metrics} totalBudget={config.totalBudget} />}
            <PurchaseHistory purchases={purchases} />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;