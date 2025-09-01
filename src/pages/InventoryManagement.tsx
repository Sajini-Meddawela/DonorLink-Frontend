import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash, Settings, X, Upload, Download } from "lucide-react";
import Sidebar from "../components/SideBar";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import Button from "../components/AddItemButton";
import Navbar from "../components/NavBarAuth";
import CSVImportModal from "../components/CSVImportModal";
import { InventoryTableItem } from "../Types/types";
import { InventoryService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const InventoryManagementPage: React.FC = () => {
  const [activePage, setActivePage] = useState("inventory");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryData, setInventoryData] = useState<InventoryTableItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryTableItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const itemsPerPage = 11;
  const totalPages = Math.ceil(inventoryData.length / itemsPerPage);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        if (!user) {
          throw new Error("User not authenticated");
        }
        const data = await InventoryService.getAllItems(user.id);
        const tableData = data.map((item) => ({
          id: item.id,
          name: item.itemName,
          category: item.category,
          stockLevel: item.stockLevel,
          reorderLevel: item.reorderLevel,
          unit: item.unit || "units",
        }));
        setInventoryData(tableData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch inventory"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [user]);

  const filteredData = inventoryData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleDeleteItem = (item: InventoryTableItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem?.id || !user) return;

    try {
      await InventoryService.deleteItem(selectedItem.id, user.id);
      setInventoryData((prevData) =>
        prevData.filter((item) => item.id !== selectedItem.id)
      );
      setShowDeleteModal(false);
      setSelectedItem(null);
      toast.success("Item deleted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
      toast.error("Failed to delete item. Please try again.");
    }
  };

  const handleBulkImport = async (items: any[]) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      await InventoryService.bulkImportItems(items);
      toast.success("Items imported successfully!");
      
      // Refresh the inventory data
      const data = await InventoryService.getAllItems(user.id);
      const tableData = data.map((item) => ({
        id: item.id,
        name: item.itemName,
        category: item.category,
        stockLevel: item.stockLevel,
        reorderLevel: item.reorderLevel,
        unit: item.unit || "units",
      }));
      setInventoryData(tableData);
      setShowImportModal(false);
    } catch (err) {
      toast.error("Failed to import items. Please try again.");
    }
  };

  const handleBulkDelete = async () => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      await InventoryService.bulkDeleteItems(user.id);
      toast.success("All inventory items deleted successfully!");
      setInventoryData([]);
      setShowBulkDeleteModal(false);
    } catch (err) {
      toast.error("Failed to delete items. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="text-center p-8">Please login to access this page</div>
    );
  }

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar activePage={activePage} />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <h1 className="text-4xl font-bold text-sky-400 mb-6 text-center">
            Inventory Management
          </h1>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search inventory..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => handleSearchChange("")}
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-[#85C536] text-white rounded-md hover:bg-[#7bb530] flex items-center"
              >
                <Upload size={18} className="mr-2" />
                Import CSV
              </button>
              <button
                onClick={() => setShowBulkDeleteModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
              >
                <Trash size={18} className="mr-2" />
                Delete All
              </button>
              <Link to="/inventory/add">
                <Button text="Add Item" icon={Plus} variant="primary" />
              </Link>
            </div>
          </div>
          
          {inventoryData.length === 0 ? (
            <div className="bg-white rounded-md shadow p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-4">
                No inventory items found
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by adding your first inventory item or importing from a CSV file.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-6 py-2 bg-[#85C536] text-white rounded-md hover:bg-[#7bb530] flex items-center"
                >
                  <Upload size={18} className="mr-2" />
                  Import CSV
                </button>
                <Link to="/inventory/add">
                  <button className="px-6 py-2 bg-sky-400 text-white rounded-md hover:bg-sky-500 flex items-center">
                    <Plus size={18} className="mr-2" />
                    Add First Item
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-md shadow overflow-hidden">
                <Table<InventoryTableItem>
                  columns={[
                    { header: "Item Name", accessor: "name" },
                    {
                      header: "Current Level",
                      accessor: (item: InventoryTableItem) => (
                        <span>
                          {item.stockLevel} {item.unit}
                        </span>
                      ),
                    },
                    { header: "Category", accessor: "category" },
                    {
                      header: "Reorder Level",
                      accessor: (item: InventoryTableItem) => (
                        <span>
                          {item.reorderLevel} {item.unit}
                        </span>
                      ),
                    },
                    {
                      header: "Actions",
                      accessor: (item: InventoryTableItem) => (
                        <div className="flex space-x-4">
                          <Link
                            to={`/inventory/edit/${item.id}`}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Settings size={18} />
                          </Link>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteItem(item)}
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      ),
                    },
                  ]}
                  data={paginatedData}
                />
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Single Item Delete Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>{selectedItem.name}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-bold mb-4">Confirm Delete All</h2>
            <p className="mb-4">
              Are you sure you want to delete all {inventoryData.length} inventory items? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
                onClick={() => setShowBulkDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                onClick={handleBulkDelete}
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <CSVImportModal
          onImport={handleBulkImport}
          onCancel={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

export default InventoryManagementPage;