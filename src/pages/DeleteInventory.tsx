import React, { useState } from "react";

interface InventoryItem {
  id: number;
  name: string;
  stockLevel: number;
  category: string;
  reorderLevel: number;
}

const inventoryData: InventoryItem[] = [
  { id: 1, name: "Milk Powder", stockLevel: 30, category: "Food", reorderLevel: 10 },
  { id: 2, name: "Sanitary Pads", stockLevel: 50, category: "Hygiene", reorderLevel: 20 },
  { id: 3, name: "Notebooks", stockLevel: 70, category: "Education", reorderLevel: 30 },
  { id: 4, name: "Bandages", stockLevel: 50, category: "Medical", reorderLevel: 15 },
  { id: 5, name: "Soap", stockLevel: 120, category: "Hygiene", reorderLevel: 60 },
];

const DeleteInventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(inventoryData);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Function to handle delete icon click
  const handleDeleteClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // Function to confirm delete
  const confirmDelete = () => {
    if (!selectedItem) return; // Prevent null errors

    // Remove the item from the inventory
    setItems(items.filter((item) => item.id !== selectedItem.id));

    // Close modal and reset selection
    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Item Name</th>
            <th className="border border-gray-300 px-4 py-2">Stock Level</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Reorder Level</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">{item.stockLevel}</td>
              <td className="border border-gray-300 px-4 py-2">{item.category}</td>
              <td className="border border-gray-300 px-4 py-2">{item.reorderLevel}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-lg font-semibold mb-4">
              Do you want to delete the inventory item: <strong>{selectedItem.name}</strong>?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteInventory;
