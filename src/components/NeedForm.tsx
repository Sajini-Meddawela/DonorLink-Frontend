import { NeedItem } from '../Types/types';
import React, { useState, useEffect } from 'react';

interface NeedFormProps {
  onSubmit: (formData: NeedItem) => void;
  onCancel: () => void;
  initialData: NeedItem | null;
  isEditMode?: boolean;
}

const NeedForm: React.FC<NeedFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditMode = false 
}) => {
  const [formData, setFormData] = useState<NeedItem>({
    id: 0,
    itemName: '',
    requiredQuantity: 0,
    currentQuantity: 0,
    category: 'Food',
    urgencyLevel: 'Medium'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || 0,
        itemName: initialData.itemName,
        requiredQuantity: initialData.requiredQuantity,
        currentQuantity: initialData.currentQuantity,
        category: initialData.category,
        urgencyLevel: initialData.urgencyLevel
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Quantity') ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold text-[#63C6F7] mb-6 text-center">
        {isEditMode ? 'Edit Need Item' : 'Add New Need Item'}
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Item Name</label>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Required Quantity</label>
        <input
          type="number"
          name="requiredQuantity"
          value={formData.requiredQuantity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Current Quantity</label>
        <input
          type="number"
          name="currentQuantity"
          value={formData.currentQuantity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Food">Food</option>
          <option value="Hygiene">Hygiene</option>
          <option value="Education">Education</option>
          <option value="Medical">Medical</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Urgency Level</label>
        <select
          name="urgencyLevel"
          value={formData.urgencyLevel}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="flex justify-between">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 border rounded text-[#63C6F7] border-[#63C6F7]"
        >
          CANCEL
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 bg-[#63C6F7] text-white rounded"
        >
          {isEditMode ? 'UPDATE' : 'SAVE'}
        </button>
      </div>
    </form>
  );
};

export default NeedForm;