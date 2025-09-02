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
  
  // new state to manage the view ('paste' or 'review')
  const [view, setView] = useState('paste'); 
  // new state to hold parsed items for review
  const [itemsToReview, setItemsToReview] = useState([]);

  const handleParse = (e) => {
    e.preventDefault();
    setError('');
    const parsed = parsePurchaseText(rawText);

    if (parsed.length === 0) {
      setError('Could not parse any items. Please check the format and try again.');
      return;
    }

    setItemsToReview(parsed);
    setView('review'); // switch to the review view
  };

  const handleConfirmAndSave = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const purchasePromises = itemsToReview.map(item => {
        const purchaseData = {
          ...item,
          category: 'Meal Plan',
          purchaseDate: new Date(`${purchaseDate}T12:00:00`).toISOString(),
          purchaseFrequency: 'recurring',
          isActiveForProjection: true,
        };
        return createPurchase(purchaseData);
      });

      await Promise.all(purchasePromises);
      onSuccess();

    } catch (err) {
      setError('Failed to import purchases. Please try again.');
      console.error(err);
      setView('paste'); // go back to paste view on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      {view === 'paste' && (
        <form onSubmit={handleParse} className="space-y-4">
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
          
          <div className="pt-4 flex justify-end">
            <Button type="submit">
              Parse & Review
            </Button>
          </div>
        </form>
      )}

      {view === 'review' && (
        <div>
          <p className="mb-4 text-sm text-gray-600">Review the parsed items below. If everything looks correct, confirm the import.</p>
          
          <div className="max-h-64 overflow-y-auto border rounded-md">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Item Name</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Qty</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {itemsToReview.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 font-medium text-gray-800">{item.itemName}</td>
                    <td className="px-4 py-2 text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-2 text-gray-600">{item.cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-6 flex justify-between items-center">
            <Button variant="secondary" onClick={() => setView('paste')}>
              Back
            </Button>
            <Button onClick={handleConfirmAndSave} disabled={isSubmitting}>
              {isSubmitting ? 'Importing...' : `Confirm & Save ${itemsToReview.length} Items`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkImportForm;