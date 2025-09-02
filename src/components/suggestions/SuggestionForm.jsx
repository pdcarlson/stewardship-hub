// /src/components/suggestions/SuggestionForm.jsx
import { useState, useEffect } from 'react';
import { createSuggestion, updateSuggestion } from '../../lib/appwrite';
import Button from '../ui/Button';

const SuggestionForm = ({ onSuccess, suggestionToEdit }) => {
  const [itemName, setItemName] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // if we are editing, populate the form
  useEffect(() => {
    if (suggestionToEdit) {
      setItemName(suggestionToEdit.itemName);
      setReason(suggestionToEdit.reason || '');
    }
  }, [suggestionToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (suggestionToEdit) {
        await updateSuggestion(suggestionToEdit.$id, { itemName, reason });
      } else {
        await createSuggestion(itemName, reason);
      }
      onSuccess();
    } catch (err) {
      setError('Failed to save suggestion.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Item Name</label>
        <input 
          type="text" 
          value={itemName} 
          onChange={(e) => setItemName(e.target.value)} 
          required 
          className={inputStyles}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Reason (Optional)</label>
        <textarea 
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={inputStyles}
          rows="3"
          placeholder="e.g., for a house event, we ran out, etc."
        ></textarea>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Submit Suggestion'}
        </Button>
      </div>
    </form>
  );
};

export default SuggestionForm;