// /src/pages/MemberDashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPurchases, getShoppingList, addToShoppingList } from '../lib/appwrite';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const MemberDashboard = () => {
  const { user, logout } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      // fetch both purchases and the current shopping list
      const [purchasesData, shoppingListData] = await Promise.all([
        getPurchases(),
        getShoppingList(),
      ]);
      setPurchases(purchasesData.documents);
      setShoppingList(shoppingListData.documents);
    } catch (err) {
      setError('Failed to load items.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const handleReportOutOfStock = async (itemName) => {
    try {
      await addToShoppingList(itemName);
      // refetch data to update button states
      fetchData();
    } catch(err) {
      console.error("Failed to report item:", err);
      // optionally set an error state to show the user
    }
  };

  const activeItems = useMemo(() => {
    const recurringActive = purchases.filter(p => 
      p.purchaseFrequency === 'recurring' && p.isActiveForProjection
    );
    const uniqueNames = [...new Set(recurringActive.map(p => p.itemName))];
    return uniqueNames
      .filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort();
  }, [purchases, searchTerm]);

  const shoppingListNames = useMemo(() => new Set(shoppingList.map(item => item.itemName)), [shoppingList]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Member Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {user?.name || 'Member'}!</p>
          </div>
          <button onClick={logout} className="p-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300">
            Logout
          </button>
        </div>
      </header>
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Currently Stocked Items</h2>
            <p className="text-gray-600 mb-6">Search for an item to see if we have it. If something is out of stock, let the steward know.</p>
            
            <div>
              <input
                type="text"
                placeholder="Search for an item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="mt-6">
              {isLoading ? (
                <p>Loading items...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="space-y-3">
                  {activeItems.length > 0 ? (
                    activeItems.map(itemName => {
                      const isReported = shoppingListNames.has(itemName);
                      return (
                        <Card key={itemName} className="p-4">
                          {/* fix: wrap content in a flex container */}
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-800">{itemName}</p>
                            <Button
                              variant="secondary"
                              onClick={() => handleReportOutOfStock(itemName)}
                              disabled={isReported}
                              className="text-xs px-3 py-1 flex-shrink-0"
                            >
                              {/* fix: change button text to be an action */}
                              {isReported ? 'Reported' : 'Report'}
                            </Button>
                          </div>
                        </Card>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-center mt-8">No items found matching your search.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;