// /src/components/budget/UsageReport.jsx
import Card from '../ui/Card';

const UsageReport = ({ usageStats }) => {
  const statsArray = Object.values(usageStats);

  if (statsArray.length === 0) {
    return (
      <Card title="Weekly Usage Report">
        <p className="text-gray-500">No recurring purchases logged yet. Add some to see weekly usage stats.</p>
      </Card>
    );
  }

  return (
    <Card title="Weekly Usage Report">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Weekly Purchases</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Cost Per Item</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {statsArray.map((item) => (
              <tr key={item.itemName}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.avgWeeklyCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.avgCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default UsageReport;