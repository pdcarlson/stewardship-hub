// /src/pages/PublicDashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboardUI } from './AdminDashboard';
import { MemberDashboardUI } from './MemberDashboard';
import {
  dummyConfig,
  dummyPurchases,
  dummyShoppingList,
  dummySuggestions,
  dummyUsageStats,
  dummyMetrics,
  dummyHandler,
} from '../lib/dummyData';
import Button from '../components/ui/Button';

const PublicDashboard = () => {
  const [view, setView] = useState('admin'); // 'admin' or 'member'
  const navigate = useNavigate();

  // create dummy user objects for prop consistency
  const dummyAdmin = { name: 'Demo Admin' };
  const dummyMember = { name: 'Demo Member' };

  // create a dummy prefs object for the admin view
  const dummyPrefs = { isBudgetVisible: true };
  const dummyUpdatePrefs = () => dummyHandler('toggle budget visibility');

  const activeTabClass = 'border-indigo-500 text-indigo-600';
  const inactiveTabClass = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-gray-900 truncate">Stewardship Hub Demo</h1>
              <p className="text-sm text-gray-500">This is a public demo with non-interactive, dummy data.</p>
            </div>
            <div className="ml-4">
              <Button onClick={() => navigate('/login')}>Member Login</Button>
            </div>
          </div>
          <div className="mt-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setView('admin')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${view === 'admin' ? activeTabClass : inactiveTabClass}`}
                >
                  Admin View
                </button>
                <button
                  onClick={() => setView('member')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${view === 'member' ? activeTabClass : inactiveTabClass}`}
                >
                  Member View
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gray-50">
        {view === 'admin' ? (
          <AdminDashboardUI
            user={dummyAdmin}
            config={dummyConfig}
            purchases={dummyPurchases}
            shoppingList={dummyShoppingList}
            suggestions={dummySuggestions}
            metrics={dummyMetrics}
            usageStats={dummyUsageStats}
            isLoading={false}
            error={null}
            prefs={dummyPrefs}
            onUpdatePrefs={dummyUpdatePrefs}
            onLogout={() => dummyHandler('logout')}
            onFetchData={() => dummyHandler('fetch data')}
            onSuccess={() => dummyHandler('generic success')}
            onDeletePurchase={(id) => dummyHandler('delete purchase', id)}
            onRemoveFromShoppingList={(id) => dummyHandler('remove from shopping list', id)}
            onReportOutOfStock={(item) => dummyHandler('report out of stock', item)}
            onToggleItemStatus={(item, status) => dummyHandler('toggle item status', { item, status })}
          />
        ) : (
          <MemberDashboardUI
            user={dummyMember}
            purchases={dummyPurchases}
            shoppingList={dummyShoppingList}
            suggestions={dummySuggestions}
            isLoading={false}
            error={null}
            onLogout={() => dummyHandler('logout')}
            onReportOutOfStock={(item) => dummyHandler('report out of stock', item)}
            onSuggestionSuccess={() => dummyHandler('suggestion success')}
            onDeleteSuggestion={(id) => dummyHandler('delete suggestion', id)}
          />
        )}
      </div>
    </div>
  );
};

export default PublicDashboard;