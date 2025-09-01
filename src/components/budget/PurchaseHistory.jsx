// /src/components/budget/PurchaseHistory.jsx
// this component displays a table of all purchases.
import Card from '../ui/Card';

const PurchaseHistory = ({ purchases }) => {
  return (
    <Card title="Purchase History">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchases.map((purchase) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PurchaseHistory;