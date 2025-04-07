import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash, Settings } from "lucide-react";
import Sidebar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import Button from "../components/AddItemButton";
import Navbar from "../components/NavBarAuth";
import { InventoryItem, InventoryTableItem } from "../Types/types";
import { InventoryService } from "../services/api";

const InventoryManagementPage: React.FC = () => {
  const [activePage, setActivePage] = useState("inventory");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryData, setInventoryData] = useState<InventoryTableItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryTableItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(inventoryData.length / itemsPerPage);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await InventoryService.getAllItems();
        const tableData = data.map(item => ({
          id: item.id,
          name: item.itemName,
          category: item.category,
          stockLevel: item.stockLevel,
          reorderLevel: item.reorderLevel
        }));
        setInventoryData(tableData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

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

  const handleDeleteItem = (item: InventoryTableItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem?.id) return;
    
    try {
      await InventoryService.deleteItem(selectedItem.id);
      setInventoryData(prevData => prevData.filter(item => item.id !== selectedItem.id));
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar activePage={activePage} onPageChange={setActivePage} />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <h1 className="text-4xl font-bold text-sky-400 mb-6 text-center">Inventory Management</h1>
          <div className="flex justify-between items-center mb-6">
            <SearchBar onSearch={handleSearch} />
            <Link to="/inventory/add">
              <Button text="Add Item" icon={Plus} variant="primary" />
            </Link>
          </div>
          <div className="bg-white rounded-md shadow overflow-hidden">
            <Table<InventoryTableItem>
              columns={[
                { header: "Item Name", accessor: "name" },
                { header: "Stock Level", accessor: "stockLevel" },
                { header: "Category", accessor: "category" },
                { header: "Reorder Level", accessor: "reorderLevel" },
                {
                  header: "Actions",
                  accessor: (item: InventoryTableItem) => (
                    <div className="flex space-x-4">
                      <Link to={`/inventory/edit/${item.id}`} className="text-blue-500 hover:text-blue-700">
                        <Settings size={18} />
                      </Link>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteItem(item)}>
                        <Trash size={18} />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={paginatedData}
            />
          </div>
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </div>
      </div>

      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete <strong>{selectedItem.name}</strong>?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button className="px-4 py-2 bg-gray-300 rounded-full" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#63C6F7] text-white rounded-full" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagementPage;