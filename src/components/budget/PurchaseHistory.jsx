// /src/components/budget/PurchaseHistory.jsx
// this component displays a table of all purchases.
import { useState, useMemo } from 'react';
import Card from '../ui/Card';
import DropdownMenu from '../ui/DropdownMenu';

const PurchaseHistory = ({ purchases, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPurchases = useMemo(() => {
    if (!searchTerm) {
      return purchases;
    }
    return purchases.filter(p => 
      p.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [purchases, searchTerm]);

  const searchInput = (
     <input
      type="text"
      placeholder="Search history..."
      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );

  return (
    <Card title="Purchase History" headerContent={searchInput}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPurchases.length > 0 ? filteredPurchases.map((purchase) => {
              const menuOptions = [
                { label: 'Edit', onClick: () => onEdit(purchase) },
                { label: 'Delete', onClick: () => onDelete(purchase.$id) },
              ];

              return (
                <tr key={purchase.$id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{purchase.itemName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{purchase.purchaseFrequency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <DropdownMenu options={menuOptions} />
                  </td>
                </tr>
              )}
            ) : (
               <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No purchases found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PurchaseHistory;