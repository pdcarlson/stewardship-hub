// /src/containers/MemberDashboardContainer.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPurchases, getShoppingList, addToShoppingList, getSuggestions, deleteSuggestion, updateSuggestion } from '../lib/appwrite';
import { MemberDashboardUI } from '../pages/MemberDashboard';

const MemberDashboardContainer = () => {
  const { user, logout } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [purchasesData, shoppingListData, suggestionsData] = await Promise.all([
        getPurchases(),
        getShoppingList(),
        getSuggestions(user.$id),
      ]);
      setPurchases(purchasesData.documents);
      setShoppingList(shoppingListData.documents);
      setSuggestions(suggestionsData.documents);
    } catch (err) {
      setError('Failed to load dashboard data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReportOutOfStock = async (itemName) => {
    try {
      await addToShoppingList(itemName);
      const updatedShoppingList = await getShoppingList();
      setShoppingList(updatedShoppingList.documents);
    } catch (err) {
      console.error("Failed to report item:", err);
    }
  };

  const handleSuggestionSuccess = () => {
    fetchData(); // refetch all data after a suggestion is added/edited
  };

  const handleDeleteSuggestion = async (suggestionId) => {
    if (window.confirm('Are you sure you want to delete this suggestion?')) {
      try {
        await deleteSuggestion(suggestionId);
        fetchData();
      } catch (err) {
        setError('Failed to delete suggestion.');
        console.error(err);
      }
    }
  };

  return (
    <MemberDashboardUI
      user={user}
      purchases={purchases}
      shoppingList={shoppingList}
      suggestions={suggestions}
      isLoading={isLoading}
      error={error}
      onLogout={logout}
      onReportOutOfStock={handleReportOutOfStock}
      onSuggestionSuccess={handleSuggestionSuccess}
      onDeleteSuggestion={handleDeleteSuggestion}
    />
  );
};

export default MemberDashboardContainer;