import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../Types/types';

interface InventoryFormProps {
  onSubmit: (formData: InventoryItem) => void;
  onCancel: () => void;
  initialData: InventoryItem | null;
  isEditMode?: boolean;
  careHomeId: number; 
}

const InventoryForm: React.FC<InventoryFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditMode = false,
  careHomeId
}) => {
  const [formData, setFormData] = useState<InventoryItem>({
    id: 0,
    itemName: '',
    category: 'Food',
    stockLevel: 0,
    reorderLevel: 0,
    itemDescription: '',
    careHomeId: careHomeId 
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || 0,
        itemName: initialData.itemName,
        category: initialData.category,
        stockLevel: initialData.stockLevel,
        reorderLevel: initialData.reorderLevel,
        itemDescription: initialData.itemDescription || '',
        careHomeId: initialData.careHomeId
      });
    } else {
      setFormData(prev => ({
        ...prev,
        careHomeId
      }));
    }
  }, [initialData, careHomeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stockLevel' || name === 'reorderLevel' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold text-[#63C6F7] mb-6 text-center">
        {isEditMode ? 'Edit Inventory Item' : 'Add New Inventory Item'}
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
        <label className="block text-gray-700 mb-2">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Food">Food</option>
          <option value="Hygiene">Hygiene</option>
          <option value="Stationary">Stationary</option>
          <option value="Medical">Medical</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Stock Level</label>
        <input
          type="number"
          name="stockLevel"
          value={formData.stockLevel}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Reorder Level</label>
        <input
          type="number"
          name="reorderLevel"
          value={formData.reorderLevel}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Item Description</label>
        <textarea
          name="itemDescription"
          value={formData.itemDescription || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={3}
        />
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

export default InventoryForm;