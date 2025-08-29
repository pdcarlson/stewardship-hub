// /pages/AdminDashboard.jsx
// we've added state for the modal and a function to refresh data.
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // wrap data fetching in usecallback to prevent re-creation
  const fetchData = useCallback(async () => {
    try {
      // don't set loading to true on refetch, to avoid screen flicker
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

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  // this function will be called by the form on a successful submission
  const handlePurchaseSuccess = () => {
    setIsModalOpen(false); // close the modal
    fetchData(); // refetch all data to update the dashboard
  };

  if (isLoading) {
    return <div className="p-8">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <>
      <Modal /* ... */ >
        <PurchaseForm onSuccess={handlePurchaseSuccess} />
      </Modal>

      <div className="min-h-screen bg-light"> {/* updated background color */}
        {/* updated header styles */}
        <header className="bg-secondary shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-300">Welcome, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
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