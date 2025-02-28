import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Trash, Plus } from "lucide-react";
import Sidebar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import Button from "../components/AddItemButton";
import { InventoryItem } from "../Types/types";
import Navbar from "../components/NavBarAuth";

const mockInventoryData: InventoryItem[] = [
  { id: 1, name: "Milk Powder", stockLevel: 100, category: "Food", reorderLevel: 50 },
  { id: 2, name: "Sanitary Pads", stockLevel: 120, category: "Hygiene", reorderLevel: 12 },
  { id: 3, name: "Note Books", stockLevel: 70, category: "Stationary", reorderLevel: 20 },
  { id: 4, name: "Bandages", stockLevel: 50, category: "Medical", reorderLevel: 10 },
  { id: 5, name: "Soap", stockLevel: 120, category: "Hygiene", reorderLevel: 60 },
];

const InventoryManagementPage: React.FC = () => {
  const [activePage, setActivePage] = useState("inventory");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(mockInventoryData);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(inventoryData.length / itemsPerPage);

  const filteredData = inventoryData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleEditItem = (item: InventoryItem) => {
    console.log("Edit item:", item);
  };

  const handleDeleteItem = (item: InventoryItem) => {
    console.log("Delete item:", item);
  };

  const categoryOptions = ["Food", "Hygiene", "Stationary", "Medical"];

  const handleCategoryChange = (item: InventoryItem, newCategory: string) => {
    setInventoryData((prevData) =>
      prevData.map((i) => (i.id === item.id ? { ...i, category: newCategory } : i))
    );
  };

  const columns = [
    { header: "Item Name", accessor: "name" as keyof InventoryItem },
    { header: "Stock Level", accessor: "stockLevel" as keyof InventoryItem },
    {
      header: "Category",
      accessor: (item: InventoryItem) => (
        <select
          value={item.category}
          onChange={(e) => handleCategoryChange(item, e.target.value)}
          className="border rounded p-1 bg-white"
        >
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      ),
    },
    { header: "Reorder Level", accessor: "reorderLevel" as keyof InventoryItem },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar activePage={activePage} onPageChange={setActivePage} />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <h1 className="text-4xl font-bold text-sky-400 mb-6 text-center">
            Inventory Management
          </h1>
          <div className="flex justify-between items-center mb-6">
            <SearchBar onSearch={handleSearch} />
            <Link to="/inventory/add">
              <Button text="Add Item" icon={Plus} variant="primary" />
            </Link>
          </div>
          <div className="bg-white rounded-md shadow overflow-hidden">
            <Table<InventoryItem>
              columns={columns}
              data={paginatedData}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagementPage;
