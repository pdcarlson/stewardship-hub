// /src/components/suggestions/SuggestionList.jsx
import { useState } from 'react';
import Card from '../ui/Card';
import DropdownMenu from '../ui/DropdownMenu';
import { updateSuggestion } from '../../lib/appwrite';
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

  const handleStatusChange = async (suggestion, newStatus) => {
    await updateSuggestion(suggestion.$id, { status: newStatus });
    onUpdate(); // refetch data
  };

  if (suggestions.length === 0) {
    return (
      <Card title="Member Suggestions">
        <p className="text-gray-500">No suggestions have been submitted yet.</p>
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
          {suggestions.map(suggestion => {
            const statusColors = {
              Pending: 'bg-gray-200 text-gray-800',
              Approved: 'bg-blue-200 text-blue-800',
              Purchased: 'bg-green-200 text-green-800',
              Declined: 'bg-red-200 text-red-800',
            };
            const menuOptions = [
              { label: 'Approve', onClick: () => handleStatusChange(suggestion, 'Approved') },
              { label: 'Mark as Purchased', onClick: () => handleStatusChange(suggestion, 'Purchased') },
              { label: 'Decline', onClick: () => handleStatusChange(suggestion, 'Declined') },
              { label: 'Add/Edit Response', onClick: () => setSelectedSuggestion(suggestion) },
            ];

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