// /src/components/suggestions/SuggestionList.jsx
import { useState, useMemo } from 'react';
import Card from '../ui/Card';
import DropdownMenu from '../ui/DropdownMenu';
import { updateSuggestion, addToShoppingList } from '../../lib/appwrite';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

// a modal for writing a response
const ResponseModal = ({ suggestion, onSave, onClose }) => {
  const [response, setResponse] = useState(suggestion.adminResponse || '');
  
  const handleSave = async () => {
    await updateSuggestion(suggestion.$id, { adminResponse: response });
    onSave();
    onClose();
  };

  return (
    <Modal title={`Response to: ${suggestion.itemName}`} isOpen={true} onClose={onClose}>
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md"
        rows="4"
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Provide a reason for the status change..."
      ></textarea>
      <div className="flex justify-end mt-4">
        <Button onClick={handleSave}>Save Response</Button>
      </div>
    </Modal>
  );
};

const SuggestionList = ({ suggestions, onUpdate }) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  
  // filter suggestions to only show actionable items for the admin
  const actionableSuggestions = useMemo(() => {
    return suggestions.filter(s => s.status === 'Pending' || s.status === 'Declined');
  }, [suggestions]);

  // approve: add to shopping list and update status
  const handleApprove = async (suggestion) => {
    if (window.confirm(`Are you sure you want to approve "${suggestion.itemName}" and add it to the shopping list?`)) {
      await addToShoppingList(suggestion.itemName);
      await updateSuggestion(suggestion.$id, { status: 'Approved' });
      onUpdate();
    }
  };

  // decline: update status to keep it for member feedback
  const handleDecline = async (suggestion) => {
    await updateSuggestion(suggestion.$id, { status: 'Declined' });
    onUpdate();
  };
  
  // re-evaluate: set a declined item back to pending
  const handleSetPending = async (suggestion) => {
    await updateSuggestion(suggestion.$id, { status: 'Pending' });
    onUpdate();
  };

  if (actionableSuggestions.length === 0) {
    return (
      <Card title="Member Suggestions">
        <p className="text-gray-500">No pending suggestions.</p>
      </Card>
    );
  }

  return (
    <>
      {selectedSuggestion && (
        <ResponseModal
          suggestion={selectedSuggestion}
          onSave={onUpdate}
          onClose={() => setSelectedSuggestion(null)}
        />
      )}
      <Card title="Member Suggestions">
        <div className="space-y-4">
          {actionableSuggestions.map(suggestion => {
            const statusColors = {
              Pending: 'bg-gray-200 text-gray-800',
              Declined: 'bg-red-200 text-red-800',
            };
            
            // build menu options dynamically based on status
            const menuOptions = [];
            if (suggestion.status === 'Pending') {
              menuOptions.push({ label: 'Approve & Add to List', onClick: () => handleApprove(suggestion) });
              menuOptions.push({ label: 'Decline', onClick: () => handleDecline(suggestion) });
            } else if (suggestion.status === 'Declined') {
              menuOptions.push({ label: 'Approve & Add to List', onClick: () => handleApprove(suggestion) });
              menuOptions.push({ label: 'Re-evaluate (Set to Pending)', onClick: () => handleSetPending(suggestion) });
            }
            menuOptions.push({ label: 'Add/Edit Response', onClick: () => setSelectedSuggestion(suggestion) });


            return (
              <div key={suggestion.$id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900">{suggestion.itemName}</p>
                    {suggestion.reason && <p className="text-sm text-gray-600 mt-1">{suggestion.reason}</p>}
                    {suggestion.adminResponse && <p className="text-sm italic text-indigo-600 mt-2">Steward's Response: {suggestion.adminResponse}</p>}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[suggestion.status]}`}>
                      {suggestion.status}
                    </span>
                    <DropdownMenu options={menuOptions} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};

export default SuggestionList;