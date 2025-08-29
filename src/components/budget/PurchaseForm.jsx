// /src/components/budget/PurchaseForm.jsx
// the form for creating a new purchase record.
import { useState } from 'react';
import { createPurchase } from '../../lib/appwrite';
import Button from '../ui/Button';

const PurchaseForm = ({ onSuccess }) => {
  const [itemName, setItemName] = useState('');
  const [cost, setCost] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('Meal Plan');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]); // defaults to today
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
        purchaseDate: new Date(purchaseDate).toISOString(),
      };
      await createPurchase(purchaseData);
      onSuccess(); // call the success callback from the parent
    } catch (err) {
      setError('Failed to create purchase.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // basic form layout using tailwind
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Item Name</label>
        <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cost ($)</label>
          <input type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input type="number" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
        <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
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