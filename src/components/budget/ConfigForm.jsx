// /src/components/budget/ConfigForm.jsx
// a form for updating the semester's budget configuration.
import { useState, useEffect } from 'react';
import { updateSemesterConfig, createSemesterConfig } from '../../lib/appwrite';
import Button from '../ui/Button';

const ConfigForm = ({ config, onSuccess }) => {
  const [formData, setFormData] = useState({
    semesterName: '',
    startDate: '',
    endDate: '',
    brothersOnMealPlan: 0,
    mealPlanCost: 0,
    carryoverBalance: 0,
    additionalRevenue: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // when the config prop updates, populate the form
  useEffect(() => {
    if (config) {
      setFormData({
        semesterName: config.semesterName || '',
        // format dates for the input[type="date"] fields
        startDate: config.startDate ? new Date(config.startDate).toISOString().split('T')[0] : '',
        endDate: config.endDate ? new Date(config.endDate).toISOString().split('T')[0] : '',
        brothersOnMealPlan: config.brothersOnMealPlan || 0,
        mealPlanCost: config.mealPlanCost || 0,
        carryoverBalance: config.carryoverBalance || 0,
        additionalRevenue: config.additionalRevenue || 0,
      });
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // handle number inputs correctly
    const val = type === 'number' ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      // we need to convert date strings back to iso strings for appwrite
      const dataToSubmit = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      // if config exists, update it. otherwise, create it.
      if (config && config.$id) {
        await updateSemesterConfig(config.$id, dataToSubmit);
      } else {
        await createSemesterConfig(dataToSubmit);
      }
      onSuccess();

    } catch (err) {
      setError('failed to update settings.');
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
        <label className="block text-sm font-medium text-gray-700">Semester Name</label>
        <input type="text" name="semesterName" value={formData.semesterName} onChange={handleChange} required className={inputStyles}/>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className={inputStyles}/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className={inputStyles}/>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Brothers on Meal Plan</label>
          <input type="number" name="brothersOnMealPlan" value={formData.brothersOnMealPlan} onChange={handleChange} required className={inputStyles}/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meal Plan Cost ($)</label>
          <input type="number" step="0.01" name="mealPlanCost" value={formData.mealPlanCost} onChange={handleChange} required className={inputStyles}/>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Carryover Balance ($)</label>
          <input type="number" step="0.01" name="carryoverBalance" value={formData.carryoverBalance} onChange={handleChange} required className={inputStyles}/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Revenue ($)</label>
          <input type="number" step="0.01" name="additionalRevenue" value={formData.additionalRevenue} onChange={handleChange} required className={inputStyles}/>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'saving...' : 'save settings'}
        </Button>
      </div>
    </form>
  );
};

export default ConfigForm;