import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBarAuth";
import Sidebar from "../components/SideBar";

const AddInventory: React.FC = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "Food",
    stockLevel: "",
    reorderLevel: "",
    description: "",
  });

  useEffect(() => {
    document.title = "Add New Inventory";
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="flex pt-20">
        {/* Sidebar - Placed after Navbar */}
        <div className="w-64 h-[calc(100vh-64px)] bg-white shadow-sm pt-6">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          {/* Page Title */}
          <h1 className="text-4xl text-[#03A9F4] font-bold mb-10 text-center">
            Add New Item
          </h1>

          {/* Form Container Centered */}
          <form className="bg-white shadow-md rounded-lg p-8 w-[450px]" onSubmit={handleSubmit}>
            {/* Item Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Item Name</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03A9F4]"
                placeholder="Enter Item Name"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03A9F4]"
              >
                <option value="Food">Food</option>
                <option value="Hygiene">Hygiene</option>
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
              </select>
            </div>

            {/* Stock Level */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Stock Level</label>
              <input
                type="number"
                name="stockLevel"
                value={formData.stockLevel}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03A9F4]"
                placeholder="Current Stock Level"
              />
            </div>

            {/* Reorder Level */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Reorder Level</label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03A9F4]"
                placeholder="Reorder Level"
              />
            </div>

            {/* Item Description */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">Item Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03A9F4] resize-none"
                placeholder="Description"
                rows={3}
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <Link to="/inventory" className="px-6 py-2 border rounded-lg text-[#03A9F4] border-[#03A9F4] hover:bg-[#03A9F4]/10">
                Cancel
              </Link>
              <button type="submit" className="px-6 py-2 bg-[#03A9F4] text-white rounded-lg hover:bg-[#0288D1]">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInventory;