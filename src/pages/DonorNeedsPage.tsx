import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Gift, Bell } from "lucide-react";
import DonorSidebar from "../components/DonorSidebar";
import Navbar from "../components/NavBarAuth";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import { NeedsService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface DonorNeedItem {
  id: number;
  name: string;
  shortage: number;
  category: string;
  urgencyLevel: "High" | "Medium" | "Low";
  unit: string;
}

const DonorNeedsPage: React.FC = () => {
  const navigate = useNavigate();
  const { careHomeId } = useParams<{ careHomeId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [needsData, setNeedsData] = useState<DonorNeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(needsData.length / itemsPerPage);

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        if (!careHomeId) throw new Error("No care home ID provided");

        const data = await NeedsService.getCareHomeNeeds(parseInt(careHomeId));

        const tableData = data
          .filter((item) => item.requiredQuantity > item.currentQuantity)
          .map((item) => ({
            id: item.id,
            name: item.itemName,
            shortage: item.requiredQuantity - item.currentQuantity,
            category: item.category,
            urgencyLevel: item.urgencyLevel,
            unit: item.unit || "units",
          }));

        setNeedsData(tableData);

        const urgentNeeds = tableData.filter(
          (item) => item.urgencyLevel === "High"
        );
        if (urgentNeeds.length > 0) {
          setNotifications([
            `There are ${urgentNeeds.length} urgent needs requiring immediate attention!`,
          ]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch needs");
      } finally {
        setLoading(false);
      }
    };

    fetchNeeds();

    const intervalId = setInterval(fetchNeeds, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }, [careHomeId]);

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

  const handleDonateClick = (needId: number) => {
    navigate(`/donate/${needId}`);
  };

  const handleSubscribe = () => {
    toast.success("You'll now receive notifications when new needs are added!");
  };

  if (loading) return <div className="text-center p-8">Loading needs...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="donor-needs" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-sky-400">Care Home Needs</h1>
          </div>

          {notifications.length > 0 && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              {notifications.map((note, index) => (
                <p key={index} className="font-medium">
                  {note}
                </p>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <SearchBar onSearch={handleSearch} placeholder="Search needs..." />
            <div className="text-sm text-gray-500">
              {filteredData.length} needs found
            </div>
          </div>

          <div className="bg-white rounded-md shadow overflow-hidden">
            <Table<DonorNeedItem>
              columns={[
                { header: "Item Name", accessor: "name" },
                {
                  header: "Quantity Needed",
                  accessor: (item: DonorNeedItem) => (
                    <span className="font-semibold text-red-600">
                      {item.shortage} {item.unit}
                    </span>
                  ),
                },
                { header: "Category", accessor: "category" },
                {
                  header: "Urgency",
                  accessor: (item: DonorNeedItem) => (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.urgencyLevel === "High"
                          ? "bg-red-100 text-red-800"
                          : item.urgencyLevel === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.urgencyLevel}
                    </span>
                  ),
                },
                {
                  header: "Actions",
                  accessor: (item: DonorNeedItem) => (
                    <div className="flex space-x-4">
                      <button
                        className="bg-[#63C6F7] text-white px-4 py-1 rounded-full hover:bg-[#52b0e0] flex items-center"
                        onClick={() => handleDonateClick(item.id)}
                        title="Donate"
                      >
                        <Gift size={16} className="mr-1" />
                        Donate
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
        </div>
      </div>
    </div>
  );
};

export default DonorNeedsPage;
