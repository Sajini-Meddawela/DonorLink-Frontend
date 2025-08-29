import React, { useState, useEffect } from "react";
import { NeedItem } from "../Types/types";
import { InventoryService } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface NeedFormProps {
  onSubmit: (formData: Omit<NeedItem, "id">) => void;
  onCancel: () => void;
  initialData: NeedItem | null;
  isEditMode?: boolean;
}

const NeedForm: React.FC<NeedFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditMode = false,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    itemName: initialData?.itemName || "",
    requiredQuantity: initialData?.requiredQuantity || 0,
    currentQuantity: initialData?.currentQuantity || 0,
    category: initialData?.category || "",
    urgencyLevel: initialData?.urgencyLevel || "Medium",
    unit: initialData?.unit || "units",
    userId: user?.id || 0, // Added userId field
  });

  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        userId: user?.id || 0, // Ensure userId is set
      });
    }
  }, [initialData, user]);

  useEffect(() => {
    const fetchInventory = async () => {
      if (user) {
        try {
          const data = await InventoryService.getAllItems(user.id);
          setInventoryItems(data);
        } catch (error) {
          console.error("Failed to fetch inventory:", error);
        }
      }
    };

    fetchInventory();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Quantity") ? parseInt(value) || 0 : value,
    }));

    // Show suggestions when typing item name
    if (name === "itemName") {
      const filtered = inventoryItems.filter((item) =>
        item.itemName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
      setShowSuggestions(value.length > 0);
    }
  };

  const handleItemSelect = (item: any) => {
    setFormData((prev) => ({
      ...prev,
      itemName: item.itemName,
      category: item.category,
      unit: item.unit,
      currentQuantity: item.stockLevel || 0,
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure userId is included in the submitted data
    const submitData = {
      ...formData,
      userId: user?.id || 0,
    };

    onSubmit(submitData);
  };

  const units = [
    "units",
    "kilograms",
    "grams",
    "liters",
    "milliliters",
    "packets",
    "boxes",
    "bottles",
    "pieces",
    "pairs",
    "cartons",
    "bags",
    "cans",
    "rolls",
    "sets",
  ];

  const categories = [
    "Food",
    "Hygiene",
    "Education",
    "Medical",
    "Clothing",
    "Bedding",
    "Utilities",
    "Cleaning",
    "Other",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
    >
      <h2 className="text-2xl font-bold text-[#63C6F7] mb-6 text-center">
        {isEditMode ? "Edit Need Item" : "Add New Need Item"}
      </h2>

      <div className="mb-4 relative">
        <label className="block text-gray-700 mb-2">Item Name</label>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          placeholder="Start typing to see inventory suggestions"
        />
        {showSuggestions && filteredItems.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleItemSelect(item)}
              >
                <div className="font-medium">{item.itemName}</div>
                <div className="text-sm text-gray-600">
                  {item.category} • Stock: {item.stockLevel} {item.unit}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Required Quantity</label>
          <input
            type="number"
            name="requiredQuantity"
            value={formData.requiredQuantity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
        </div>

        <div>
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
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Unit</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Urgency Level</label>
        <select
          name="urgencyLevel"
          value={formData.urgencyLevel}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Auto-calculated remaining quantity */}
      {formData.requiredQuantity > 0 && formData.currentQuantity > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-blue-700 text-sm">
            Remaining needed:{" "}
            <strong>
              {formData.requiredQuantity - formData.currentQuantity}
            </strong>{" "}
            {formData.unit}
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded text-[#63C6F7] border-[#63C6F7] hover:bg-[#63C6F7] hover:text-white transition-colors"
        >
          CANCEL
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#63C6F7] text-white rounded hover:bg-[#52b0e0] transition-colors"
        >
          {isEditMode ? "UPDATE" : "SAVE"}
        </button>
      </div>
    </form>
  );
};

export default NeedForm;
