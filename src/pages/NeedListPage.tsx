import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash, Settings } from 'lucide-react';
import Sidebar from '../components/SideBar';
import Navbar from '../components/NavBarAuth';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import Button from '../components/AddItemButton';
import SearchBar from '../components/SearchBar';
import { NeedsService } from '../services/api';
import { NeedTableItem } from '../Types/types';

const NeedListPage: React.FC = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("need-list");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [needsData, setNeedsData] = useState<NeedTableItem[]>([]);
  const [selectedNeed, setSelectedNeed] = useState<NeedTableItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const careHomeId = 1; 

  const itemsPerPage = 5;
  const totalPages = Math.ceil(needsData.length / itemsPerPage);

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const data = await NeedsService.getAllNeeds(careHomeId);
        const tableData = data.map(item => ({
          id: item.id,
          name: item.itemName,
          requiredQuantity: item.requiredQuantity,
          currentQuantity: item.currentQuantity,
          category: item.category,
          urgencyLevel: item.urgencyLevel,
          careHomeId: item.careHomeId
        }));
        setNeedsData(tableData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch needs');
      } finally {
        setLoading(false);
      }
    };

    fetchNeeds();
  }, []);

  const filteredData = needsData.filter(
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

  const handleDeleteNeed = (need: NeedTableItem) => {
    setSelectedNeed(need);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedNeed?.id) return;
    
    try {
      await NeedsService.deleteNeed(selectedNeed.id, careHomeId);
      setNeedsData(prevData => prevData.filter(item => item.id !== selectedNeed.id));
      setShowDeleteModal(false);
      setSelectedNeed(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete need');
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar activePage={activePage} />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <h1 className="text-4xl font-bold text-sky-400 mb-6 text-center">Need List</h1>
          <div className="flex justify-between items-center mb-6">
            <SearchBar onSearch={handleSearch} placeholder="Search needs..." />
            <Link to={`/needs/add/${careHomeId}`}>
              <Button text="Add Need" icon={Plus} variant="primary" />
            </Link>
          </div>
          <div className="bg-white rounded-md shadow overflow-hidden">
            <Table<NeedTableItem>
              columns={[
                { header: "Item Name", accessor: "name" },
                { header: "Required Qty", accessor: "requiredQuantity" },
                { header: "Current Qty", accessor: "currentQuantity" },
                { header: "Category", accessor: "category" },
                { 
                  header: "Urgency", 
                  accessor: (item: NeedTableItem) => (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.urgencyLevel === 'High' ? 'bg-red-100 text-red-800' :
                      item.urgencyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.urgencyLevel}
                    </span>
                  )
                },
                {
                  header: "Actions",
                  accessor: (item: NeedTableItem) => (
                    <div className="flex space-x-4">
                      <Link to={`/needs/edit/${item.id}`} className="text-blue-500 hover:text-blue-700">
                        <Settings size={18} />
                      </Link>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteNeed(item)}>
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

      {showDeleteModal && selectedNeed && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete <strong>{selectedNeed.name}</strong>?</p>
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

export default NeedListPage;