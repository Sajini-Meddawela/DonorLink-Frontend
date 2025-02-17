import React, { useState } from 'react';
import Navbar from '../components/NavBarAuth';
import Sidebar from '../components/SideBar';
import Pagination from '../components/Pagination';
import { Search, PenLine, Trash } from 'lucide-react';
import { Link } from "react-router-dom";

interface InventoryItem {
  itemName: string;
  stockLevel: number;
  category: string;
  reorderLevel: number;
}

const InventoryManagement: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const inventoryData: InventoryItem[] = [
    { itemName: 'Milk Powder', stockLevel: 100, category: 'Food', reorderLevel: 50 },
    { itemName: 'Sanitary Pads', stockLevel: 120, category: 'Hygiene', reorderLevel: 12 },
    { itemName: 'Note Books', stockLevel: 70, category: 'Education', reorderLevel: 20 },
    { itemName: 'Bandages', stockLevel: 50, category: 'Medical', reorderLevel: 10 },
    { itemName: 'Soap', stockLevel: 120, category: 'Hygiene', reorderLevel: 60 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <Navbar />
      
      <div className="flex pt-20">
        <div className="w-64 h-[calc(100vh-64px)] bg-white shadow-sm pt-6"> 
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-4xl text-[#03A9F4] font-bold mb-6 text-center">
            Inventory Management
          </h1>

          {/* Search and Add Button */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-[#03A9F4]"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            <Link to = '/inventory/add'>
            <button className="bg-[#03A9F4] text-white px-4 py-2 rounded-lg flex items-center gap-2">
              Add New Item
            </button>
            </Link>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#03A9F4] text-white">
                  <th className="px-6 py-3 text-left font-medium">Item Name</th>
                  <th className="px-6 py-3 text-left font-medium">Stock Level</th>
                  <th className="px-6 py-3 text-left font-medium">Category</th>
                  <th className="px-6 py-3 text-left font-medium">Reorder Level</th>
                  <th className="px-6 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{item.itemName}</td>
                    <td className="px-6 py-4">{item.stockLevel}</td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td className="px-6 py-4">{item.reorderLevel}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-4">
                        <button className="text-gray-600 hover:text-[#03A9F4]">
                          <PenLine size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-red-500">
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="p-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
