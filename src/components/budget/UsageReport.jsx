// /src/components/budget/UsageReport.jsx
import Card from '../ui/Card';
import DropdownMenu from '../ui/DropdownMenu';

const UsageReport = ({ usageStats, onToggleItemStatus }) => {
  const statsArray = Object.values(usageStats);

  if (statsArray.length === 0) {
    return (
      <Card title="Weekly Usage Report">
        <p className="text-gray-500">No active recurring purchases logged yet.</p>
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
              <th className="relative px-6 py-3">
                {/* the header text is now visually hidden */}
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {statsArray.map((item) => {
              const menuOptions = [
                {
                  label: item.isActive ? 'Deactivate' : 'Activate',
                  onClick: () => onToggleItemStatus(item.itemName, !item.isActive),
                }
              ];
              
              return (
                <tr key={item.itemName}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.avgWeeklyCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.avgCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </td>
                  {/* right-align the menu for better spacing */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <DropdownMenu options={menuOptions} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default UsageReport;