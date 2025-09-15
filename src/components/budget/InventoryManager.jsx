// /src/components/budget/InventoryManager.jsx
// a component for admins to quickly report out-of-stock items.
import { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const InventoryManager = ({ purchases, shoppingList, onReportItem }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const activeItems = useMemo(() => {
    // filter for items that are recurring, active, and marked as a stock item
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

  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-800 mb-2">House Inventory Check</h2>
      <p className="text-gray-600 mb-6">Quickly report items that are out of stock to add them to your shopping list.</p>
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
        {activeItems.length > 0 ? (
          <div className="space-y-3">
            {activeItems.map(itemName => {
              const isReported = shoppingListNames.has(itemName);
              return (
                <div key={itemName} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800">{itemName}</p>
                    <Button
                      variant="secondary"
                      onClick={() => onReportItem(itemName)}
                      disabled={isReported}
                      className="text-xs px-3 py-1 flex-shrink-0"
                    >
                      {isReported ? 'On List' : 'Report Out'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-8">No stocked items found.</p>
        )}
      </div>
    </Card>
  );
};

export default InventoryManager;