import React, { useState, useEffect } from "react";

interface InventoryFormProps {
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  initialData: any;
  isEditMode?: boolean;
}

const InventoryForm: React.FC<InventoryFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "Food",
    stockLevel: 0,
    reorderLevel: 1,
    unit: "units",
    itemDescription: "",
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Available units for selection
  const unitOptions = [
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
    "cans",
  ];

  // Categories for better organization
  const categoryOptions = [
    "Food",
    "Hygiene",
    "Medical",
    "Stationary",
    "Clothing",
    "Educational",
    "Utilities",
    "Other",
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        itemName: initialData.itemName || "",
        category: initialData.category || "Food",
        stockLevel: initialData.stockLevel || 0,
        reorderLevel: initialData.reorderLevel || 1, // Ensure at least 1
        unit: initialData.unit || "units",
        itemDescription: initialData.itemDescription || "",
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (formData.reorderLevel === 0) {
      newErrors.reorderLevel = "Reorder level cannot be 0. Please set a proper reorder level.";
    }

    if (formData.reorderLevel < 1) {
      newErrors.reorderLevel = "Reorder level must be at least 1.";
    }

    if (formData.reorderLevel > 100000) {
      newErrors.reorderLevel = "Reorder level seems too high. Please enter a reasonable value.";
    }

    if (formData.stockLevel < 0) {
      newErrors.stockLevel = "Stock level cannot be negative.";
    }

    if (!formData.itemName.trim()) {
      newErrors.itemName = "Item name is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const newValue = name === "stockLevel" || name === "reorderLevel"
      ? Math.max(0, parseInt(value) || 0) 
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold text-[#63C6F7] mb-6 text-center">
        {isEditMode ? "Edit Inventory Item" : "Add New Inventory Item"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Item Name *</label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent ${
              errors.itemName ? 'border-red-500' : ''
            }`}
            required
            placeholder="e.g., Rice, Soap, Notebooks"
          />
          {errors.itemName && (
            <p className="text-red-500 text-xs mt-1">{errors.itemName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent"
            required
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Current Stock *</label>
          <input
            type="number"
            name="stockLevel"
            value={formData.stockLevel}
            onChange={handleChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent ${
              errors.stockLevel ? 'border-red-500' : ''
            }`}
            min="0"
            required
          />
          {errors.stockLevel && (
            <p className="text-red-500 text-xs mt-1">{errors.stockLevel}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Reorder Level *</label>
          <input
            type="number"
            name="reorderLevel"
            value={formData.reorderLevel}
            onChange={handleChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent ${
              errors.reorderLevel ? 'border-red-500' : ''
            }`}
            min="1"
            required
          />
          {errors.reorderLevel ? (
            <p className="text-red-500 text-xs mt-1">{errors.reorderLevel}</p>
          ) : (
            formData.reorderLevel > 0 &&
            formData.stockLevel <= formData.reorderLevel && (
              <p className="text-xs text-orange-500 mt-1">
                ⚠️ Stock is at or below reorder level - this will generate a need request
              </p>
            )
          )}
          {!errors.reorderLevel && formData.reorderLevel > 0 && formData.stockLevel > formData.reorderLevel && (
            <p className="text-xs text-green-500 mt-1">
              ✓ Stock level is healthy
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Unit *</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent"
            required
          >
            {unitOptions.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Item Description</label>
        <textarea
          name="itemDescription"
          value={formData.itemDescription}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent"
          rows={3}
          placeholder="Additional details about this item (optional)"
        />
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border rounded text-[#63C6F7] border-[#63C6F7] hover:bg-[#63C6F7] hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-[#63C6F7] text-white rounded hover:bg-[#52b0e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={Object.keys(errors).some(key => errors[key])}
        >
          {isEditMode ? "Update Item" : "Add Item"}
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;