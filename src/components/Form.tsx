import React from 'react';

interface InventoryFormProps {
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold text-[#63C6F7] mb-6 text-center">Add New Inventory</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Item Name</label>
        <input type="text" placeholder="Enter Item Name" className="w-full p-2 border rounded" required />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <select className="w-full p-2 border rounded" required>
          <option value="Food">Food</option>
          <option value="Hygiene">Hygiene</option>
          <option value="Education">Education</option>
          <option value="Medical">Medical</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Stock Level</label>
        <input type="number" placeholder="Current Stock Level" className="w-full p-2 border rounded" required />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Reorder Level</label>
        <input type="number" placeholder="Reorder Level" className="w-full p-2 border rounded" required />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700">Item Description</label>
        <textarea placeholder="Description" className="w-full p-2 border rounded"></textarea>
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded text-[#63C6F7] border-[#63C6F7]">CANCEL</button>
        <button type="submit" className="px-4 py-2 bg-[#63C6F7] text-white rounded">SAVE</button>
      </div>
    </form>
  );
};

export default InventoryForm;