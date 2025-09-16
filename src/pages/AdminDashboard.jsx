// /src/pages/AdminDashboard.jsx
import { useState, useMemo } from 'react';
import BudgetDisplay from '../components/budget/BudgetDisplay';
import PurchaseHistory from '../components/budget/PurchaseHistory';
import UsageReport from '../components/budget/UsageReport';
import ShoppingList from '../components/budget/ShoppingList';
import SuggestionList from '../components/suggestions/SuggestionList';
import InventoryManager from '../components/budget/InventoryManager';
import Modal from '../components/ui/Modal';
import PurchaseForm from '../components/budget/PurchaseForm';
import ConfigForm from '../components/budget/ConfigForm';
import BulkImportForm from '../components/budget/BulkImportForm';
import Button from '../components/ui/Button';

export const AdminDashboardUI = ({
  user,
  config,
  purchases,
  shoppingList,
  suggestions,
  metrics,
  usageStats,
  isLoading,
  error,
  prefs,
  onUpdatePrefs,
  onLogout,
  onFetchData,
  onSuccess,
  onDeletePurchase,
  onRemoveFromShoppingList,
  onReportOutOfStock,
  onToggleItemStatus,
}) => {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);

  const handleEditPurchase = (purchase) => {
    setEditingPurchase(purchase);
    setIsPurchaseModalOpen(true);
  };

  const handleSuccess = () => {
    setIsPurchaseModalOpen(false);
    setEditingPurchase(null);
    setIsConfigModalOpen(false);
    setIsImportModalOpen(false);
    onSuccess();
  };

  const uniqueItemNames = useMemo(() => {
    return [...new Set(purchases.map(p => p.itemName).sort())];
  }, [purchases]);
  
  const isBudgetVisible = prefs.isBudgetVisible ?? true;
  const purchaseModalTitle = editingPurchase ? 'Edit Purchase' : 'Log a New Purchase';

  if (isLoading) return <div className="p-8">Loading Dashboard...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <>
      <Modal
        title={purchaseModalTitle}
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setEditingPurchase(null);
        }}
      >
        <PurchaseForm
          onSuccess={handleSuccess}
          itemNames={uniqueItemNames}
          purchaseToEdit={editingPurchase}
        />
      </Modal>

      <Modal title="Semester Settings" isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)}>
        <ConfigForm config={config} onSuccess={handleSuccess} />
      </Modal>

      <Modal title="Bulk Import Purchases" isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
        <BulkImportForm onSuccess={handleSuccess} />
      </Modal>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-[#1f2937] shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-300">Welcome, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => setIsImportModalOpen(true)} variant="secondary">Bulk Import</Button>
              <Button onClick={() => setIsConfigModalOpen(true)}>Settings</Button>
              <Button onClick={() => setIsPurchaseModalOpen(true)}>New Purchase</Button>
              <Button onClick={onLogout} variant="secondary">Logout</Button>
            </div>
          </div>
        </header>

        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {metrics && (
              <BudgetDisplay
                metrics={metrics}
                isBudgetVisible={isBudgetVisible}
                onToggleVisibility={() => onUpdatePrefs({ isBudgetVisible: !isBudgetVisible })}
              />
            )}
            <ShoppingList items={shoppingList} onRemove={onRemoveFromShoppingList} />
            <InventoryManager 
              purchases={purchases} 
              shoppingList={shoppingList} 
              onReportItem={onReportOutOfStock} 
            />
            <SuggestionList suggestions={suggestions} onUpdate={onFetchData} />
            <UsageReport usageStats={usageStats} onToggleItemStatus={onToggleItemStatus} />
            <PurchaseHistory
              purchases={purchases}
              onEdit={handleEditPurchase}
              onDelete={onDeletePurchase}
            />
          </div>
        </main>
      </div>
    </>
  );
};