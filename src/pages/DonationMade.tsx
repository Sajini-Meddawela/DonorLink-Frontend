import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import DonorSidebar from "../components/DonorSidebar";
import Navbar from "../components/NavBarAuth";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { DonationsService, CareHomeService } from "../services/api";
import { Donation, CareHome } from "../Types/types";
import { useAuth } from "../context/AuthContext";

const DonationMadePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [donationsData, setDonationsData] = useState<Donation[]>([]);
  const [careHomes, setCareHomes] = useState<Record<number, CareHome>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(donationsData.length / itemsPerPage);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        if (!user) {
          throw new Error("User not authenticated");
        }

        const data = await DonationsService.getDonationsByDonor(user.id);
        setDonationsData(data);

        const uniqueCareHomeIds = Array.from(
          new Set(
            data
              .map((d) => d.need?.userId)
              .filter((id): id is number => id !== undefined)
          )
        );

        const careHomePromises = uniqueCareHomeIds.map((id) =>
          CareHomeService.getCareHomeDetails(id)
        );
        const careHomesData = await Promise.all(careHomePromises);

        const careHomesMap = careHomesData.reduce((acc, careHome) => {
          if (careHome) {
            acc[careHome.id] = careHome;
          }
          return acc;
        }, {} as Record<number, CareHome>);

        setCareHomes(careHomesMap);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch donations"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user]);

  const filteredData = donationsData.filter(
    (item) =>
      item.need?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.need?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      careHomes[item.need?.userId || 0]?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleViewReceipt = (donationId: number) => {
    navigate(`/donation-receipt/${donationId}`);
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="donation-made" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <h1 className="text-4xl font-bold text-[#63C6F7] mb-6 text-center">
            Your Donations
          </h1>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search donations..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
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
          </div>
          <div className="bg-white rounded-md shadow overflow-hidden">
            <Table<Donation>
              columns={[
                {
                  header: "Item",
                  accessor: (item) => (
                    <div>
                      <div className="font-medium">{item.need?.itemName}</div>
                      <div className="text-sm text-gray-500">
                        {item.need?.category}
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Care Home",
                  accessor: (item) => {
                    const careHome = careHomes[item.need?.userId || 0];
                    return (
                      <div>
                        <div className="font-medium">{careHome?.name}</div>
                        <div className="text-sm text-gray-500">
                          {careHome?.address}
                        </div>
                      </div>
                    );
                  },
                },
                {
                  header: "Quantity",
                  accessor: "quantity",
                },
                {
                  header: "Date",
                  accessor: (item) => new Date(item.date).toLocaleDateString(),
                },
                {
                  header: "Status",
                  accessor: (item) => (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : item.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  ),
                },
                {
                  header: "Actions",
                  accessor: (item) => (
                    <div className="flex space-x-4">
                      <button
                        className="text-[#63C6F7] hover:text-[#52b0e0] flex items-center"
                        onClick={() => handleViewReceipt(item.id)}
                      >
                        <span className="mr-1">View Receipt</span>
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

export default DonationMadePage;
