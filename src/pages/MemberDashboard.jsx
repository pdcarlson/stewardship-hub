// /src/pages/MemberDashboard.jsx
import { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import SuggestionForm from '../components/suggestions/SuggestionForm';
import DropdownMenu from '../components/ui/DropdownMenu';

export const MemberDashboardUI = ({
  user,
  purchases,
  shoppingList,
  suggestions,
  isLoading,
  error,
  onLogout,
  onReportOutOfStock,
  onSuggestionSuccess,
  onDeleteSuggestion,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [editingSuggestion, setEditingSuggestion] = useState(null);

  const handleEditSuggestion = (suggestion) => {
    setEditingSuggestion(suggestion);
    setIsSuggestionModalOpen(true);
  };

  const handleSuggestionSuccess = () => {
    setIsSuggestionModalOpen(false);
    setEditingSuggestion(null);
    onSuggestionSuccess();
  };

  const activeItems = useMemo(() => {
    const visibleItems = purchases.filter(p =>
      p.purchaseFrequency === 'recurring' &&
      p.isActiveForProjection &&
      p.isStockItem
    );
    const uniqueNames = [...new Set(visibleItems.map(p => p.itemName))];
    return uniqueNames
      .filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort();
  }, [purchases, searchTerm]);

  const shoppingListNames = useMemo(() => new Set(shoppingList.map(item => item.itemName)), [shoppingList]);
  const suggestionModalTitle = editingSuggestion ? 'Edit Suggestion' : 'Suggest a New Item';

  return (
    <>
      <Modal
        title={suggestionModalTitle}
        isOpen={isSuggestionModalOpen}
        onClose={() => {
          setIsSuggestionModalOpen(false);
          setEditingSuggestion(null);
        }}
      >
        <SuggestionForm
          onSuccess={handleSuggestionSuccess}
          suggestionToEdit={editingSuggestion}
        />
      </Modal>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Member Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome, {user?.name || 'Member'}!</p>
            </div>
            <button onClick={onLogout} className="p-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300">
              Logout
            </button>
          </div>
        </header>
        
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
              <Card>
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
                <div className="mt-6 max-h-96 overflow-y-auto pr-2">
                  {isLoading ? <p>Loading items...</p> : error ? <p className="text-red-500">{error}</p> : (
                    <div className="space-y-3">
                      {activeItems.length > 0 ? (
                        activeItems.map(itemName => {
                          const isReported = shoppingListNames.has(itemName);
                          return (
                            <div key={itemName} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <p className="font-medium text-gray-800">{itemName}</p>
                                <Button
                                  variant="secondary"
                                  onClick={() => onReportOutOfStock(itemName)}
                                  disabled={isReported}
                                  className="text-xs px-3 py-1 flex-shrink-0"
                                >
                                  {isReported ? 'Reported' : 'Report'}
                                </Button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-500 text-center mt-8">No items found matching your search.</p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Suggestions</h2>
                    <p className="text-gray-600">Suggest new items for the house or manage your existing suggestions.</p>
                  </div>
                  <Button onClick={() => setIsSuggestionModalOpen(true)}>Suggest an Item</Button>
                </div>
                <div className="space-y-3">
                  {suggestions.length > 0 ? (
                    suggestions.map(suggestion => {
                      const menuOptions = [
                        { label: 'Edit', onClick: () => handleEditSuggestion(suggestion) },
                        { label: 'Delete', onClick: () => onDeleteSuggestion(suggestion.$id) },
                      ];
                       const statusColors = {
                        Pending: 'bg-gray-200 text-gray-800',
                        Approved: 'bg-blue-200 text-blue-800',
                        Declined: 'bg-red-200 text-red-800',
                      };
                      return (
                         <div key={suggestion.$id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{suggestion.itemName}</p>
                                {suggestion.reason && <p className="text-sm text-gray-500 mt-1">{suggestion.reason}</p>}
                                {suggestion.adminResponse && <p className="text-sm italic text-indigo-600 mt-2">Steward's Response: {suggestion.adminResponse}</p>}
                              </div>
                              <div className="flex items-center space-x-3 ml-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[suggestion.status]}`}>
                                  {suggestion.status}
                                </span>
                                {suggestion.status === 'Pending' && <DropdownMenu options={menuOptions} />}
                              </div>
                            </div>
                         </div>
                      );
                    })
                  ) : (
                     <p className="text-gray-500 text-center pt-4">You haven't made any suggestions yet.</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};