// /src/components/budget/UsageReport.jsx
import { useState, useMemo } from 'react';
import Card from '../ui/Card';
import DropdownMenu from '../ui/DropdownMenu';

const UsageReport = ({ usageStats, onToggleItemStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'avgWeeklyCount', direction: 'descending' });

  const statsArray = useMemo(() => {
    let sortableItems = Object.values(usageStats);

    // filtering
    if (searchTerm) {
      sortableItems = sortableItems.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // sorting
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return sortableItems;
  }, [usageStats, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };
  
  const searchInput = (
    <input
      type="text"
      placeholder="Search items..."
      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );

  return (
    <Card title="Weekly Usage Report" headerContent={searchInput}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3"><span className="sr-only">Status</span></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('itemName')}>
                Item{getSortIndicator('itemName')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('avgWeeklyCount')}>
                Avg Weekly Purchases{getSortIndicator('avgWeeklyCount')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('avgCost')}>
                Avg Cost Per Item{getSortIndicator('avgCost')}
              </th>
              <th className="relative px-6 py-3"><span className="sr-only">Action</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {statsArray.length > 0 ? statsArray.map((item) => {
              const menuOptions = [{ label: item.isActive ? 'Deactivate' : 'Activate', onClick: () => onToggleItemStatus(item.itemName, !item.isActive) }];
              const itemRowClass = !item.isActive ? 'text-gray-400' : 'text-gray-900';
              return (
                <tr key={item.itemName} className={itemRowClass}>
                  <td className="px-2 py-4"><div className={`h-2.5 w-2.5 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.itemName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{item.avgWeeklyCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{item.avgCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm"><DropdownMenu options={menuOptions} /></td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default UsageReport;