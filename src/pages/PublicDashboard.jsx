// /src/pages/PublicDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboardUI } from './AdminDashboard';
import { MemberDashboardUI } from './MemberDashboard';
import {
  dummyConfig as initialConfig,
  dummyPurchases as initialPurchases,
  dummyShoppingList as initialShoppingList,
  dummySuggestions as initialSuggestions,
  dummyRequests as initialRequests,
} from '../lib/dummyData';
import { calculateBudgetMetrics, calculateAverageWeeklyUsage } from '../lib/calculations';

// an icon for the github button
const GithubIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const PublicDashboard = () => {
  const [view, setView] = useState('admin');
  const navigate = useNavigate();

  // manage all dummy data in state for interactivity
  const [config, setConfig] = useState(initialConfig);
  const [purchases, setPurchases] = useState(initialPurchases);
  const [shoppingList, setShoppingList] = useState(initialShoppingList);
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [requests, setRequests] = useState(initialRequests);
  const [metrics, setMetrics] = useState(null);
  const [usageStats, setUsageStats] = useState({});
  const [prefs, setPrefs] = useState({ isBudgetVisible: true });

  // recalculate metrics whenever purchases or config changes
  useEffect(() => {
    const newUsageStats = calculateAverageWeeklyUsage(purchases, config);
    const newMetrics = calculateBudgetMetrics(config, purchases, newUsageStats);
    setUsageStats(newUsageStats);
    setMetrics(newMetrics);
  }, [purchases, config]);

  // --- handlers for admin ui ---
  const handleRemoveFromShoppingList = (itemId) => {
    setShoppingList(prev => prev.filter(item => item.$id !== itemId));
  };

  const handleReportOutOfStock = (itemName) => {
    const newItem = { $id: `shop${Date.now()}`, itemName, reportedBy: 'dummyUser' };
    setShoppingList(prev => [...prev, newItem]);
  };
  
  const handleToggleItemStatus = (itemName, newStatus) => {
    setPurchases(prev => prev.map(p => 
      p.itemName.toLowerCase() === itemName.toLowerCase()
        ? { ...p, isActiveForProjection: newStatus }
        : p
    ));
  };
  
  const handleApproveRequest = (request) => {
    setRequests(prev => prev.filter(req => req.$id !== request.$id));
  };

  const handleDenyRequest = (requestId) => {
    setRequests(prev => prev.filter(req => req.$id !== requestId));
  };

  // --- handlers for member ui ---
  const handleDeleteSuggestion = (suggestionId) => {
    setSuggestions(prev => prev.filter(s => s.$id !== suggestionId));
  };
  
  // --- dummy user objects for prop consistency ---
  const dummyAdmin = { name: 'Demo Admin' };
  const dummyMember = { name: 'Demo Member' };

  // classes for the new view toggle buttons
  const activeToggleClass = "px-3 py-1 text-sm font-semibold text-indigo-700 bg-white rounded-md shadow-sm";
  const inactiveToggleClass = "px-3 py-1 text-sm font-medium text-white hover:bg-indigo-600 rounded-md";


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10 shadow-md bg-indigo-700">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            {/* left side: title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-white truncate">Stewardship Hub Demo</h1>
              <p className="text-sm text-gray-200">This is a public demo with interactive, temporary data.</p>
            </div>

            {/* middle: view toggles */}
            <div className="flex items-center p-1 bg-indigo-800 rounded-lg">
              <button onClick={() => setView('admin')} className={view === 'admin' ? activeToggleClass : inactiveToggleClass}>
                Admin View
              </button>
              <button onClick={() => setView('member')} className={view === 'member' ? activeToggleClass : inactiveToggleClass}>
                Member View
              </button>
            </div>

            {/* right side: action buttons */}
            <div className="flex items-center space-x-2">
              <a href="https://github.com/pdcarlson/stewardship-hub" target="_blank" rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-sm font-medium text-white rounded-md ring-1 ring-inset ring-white/50 hover:bg-white/10 transition-colors"
              >
                <GithubIcon />
                GitHub
              </a>
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-medium text-indigo-700 bg-white rounded-md hover:bg-indigo-50 transition-colors"
              >
                Member Login
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gray-50">
        {view === 'admin' ? (
          <AdminDashboardUI
            user={dummyAdmin}
            config={config}
            purchases={purchases}
            shoppingList={shoppingList}
            suggestions={suggestions}
            metrics={metrics}
            usageStats={usageStats}
            isLoading={false}
            error={null}
            prefs={prefs}
            onUpdatePrefs={(newPrefs) => setPrefs(prev => ({...prev, ...newPrefs}))}
            onLogout={() => navigate('/login')}
            onFetchData={() => { /* no-op in demo */ }}
            onSuccess={() => { /* no-op in demo */ }}
            onDeletePurchase={(id) => setPurchases(prev => prev.filter(p => p.$id !== id))}
            onRemoveFromShoppingList={handleRemoveFromShoppingList}
            onReportOutOfStock={handleReportOutOfStock}
            onToggleItemStatus={handleToggleItemStatus}
            requests={requests}
            isVerificationModalOpen={false}
            onVerificationModalOpen={() => { /* handled by notification instead */ }}
            onVerificationModalClose={() => { /* no-op in demo */ }}
            onApproveRequest={handleApproveRequest}
            onDenyRequest={handleDenyRequest}
          />
        ) : (
          <MemberDashboardUI
            user={dummyMember}
            purchases={purchases}
            shoppingList={shoppingList}
            suggestions={suggestions}
            isLoading={false}
            error={null}
            onLogout={() => navigate('/login')}
            onReportOutOfStock={handleReportOutOfStock}
            onSuggestionSuccess={() => { /* no-op in demo */ }}
            onDeleteSuggestion={handleDeleteSuggestion}
          />
        )}
      </div>
    </div>
  );
};

export default PublicDashboard;