// /src/components/budget/BulkImportForm.jsx
import { useState } from 'react';
import { createPurchase } from '../../lib/appwrite';
import { parsePurchaseText } from '../../lib/parser';
import Button from '../ui/Button';

const BulkImportForm = ({ onSuccess }) => {
  const [rawText, setRawText] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [parsedCount, setParsedCount] = useState(0);

  const handleParseAndSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    setParsedCount(0);

    try {
      const parsedItems = parsePurchaseText(rawText);
      if (parsedItems.length === 0) {
        setError('Could not parse any items. Please check the format.');
        setIsSubmitting(false);
        return;
      }
      
      setParsedCount(parsedItems.length);

      const purchasePromises = parsedItems.map(item => {
        const purchaseData = {
          ...item,
          category: 'Meal Plan', // default category
          purchaseDate: new Date(`${purchaseDate}T12:00:00`).toISOString(),
          purchaseFrequency: 'recurring', // default frequency
          isActiveForProjection: true,
        };
        return createPurchase(purchaseData);
      });

      await Promise.all(purchasePromises);
      onSuccess();

    } catch (err) {
      setError('Failed to import purchases. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <form onSubmit={handleParseAndSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Paste Receipt Text</label>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          required
          className={`${inputStyles} font-mono text-xs`}
          rows="10"
          placeholder="Paste your items here..."
        ></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Purchase Date for All Items</label>
        <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required className={inputStyles}/>
      </div>
      
      <div className="pt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {parsedCount > 0 && `Importing ${parsedCount} items...`}
        </span>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Importing...' : 'Import Purchases'}
        </Button>
      </div>
    </form>
  );
};

export default BulkImportForm;