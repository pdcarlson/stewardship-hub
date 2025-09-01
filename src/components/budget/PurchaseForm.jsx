// /src/components/budget/PurchaseForm.jsx
// the form for creating a new purchase record.
import { useState } from 'react';
import { createPurchase } from '../../lib/appwrite';
import Button from '../ui/Button';

const PurchaseForm = ({ onSuccess, itemNames = [] }) => {
  const [itemName, setItemName] = useState('');
  const [cost, setCost] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('Meal Plan');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]); // defaults to today
  const [purchaseFrequency, setPurchaseFrequency] = useState('weekly'); // default is now weekly
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const purchaseData = {
        itemName,
        cost: parseFloat(cost),
        quantity: parseInt(quantity, 10),
        category,
        // fix: set time to noon to avoid timezone issues
        purchaseDate: new Date(`${purchaseDate}T12:00:00`).toISOString(),
        purchaseFrequency,
      };
      await createPurchase(purchaseData);
      onSuccess();
    } catch (err) {
      setError('Failed to create purchase.');
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
          list="item-names" // connect input to datalist
        />
        <datalist id="item-names">
          {itemNames.map(name => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cost ($)</label>
          <input type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} required className={inputStyles}/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input type="number" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className={inputStyles}/>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className={inputStyles}/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase Frequency</label>
          <select value={purchaseFrequency} onChange={(e) => setPurchaseFrequency(e.target.value)} className={inputStyles}>
            <option value="once">Once</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
        <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required className={inputStyles}/>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Purchase'}
        </Button>
      </div>
    </form>
  );
};

export default PurchaseForm;