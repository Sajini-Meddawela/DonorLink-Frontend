import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, X, Settings } from "lucide-react";
import CareHomeSidebar from "../components/SideBar";
import Navbar from "../components/NavBarAuth";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import { DonationsService } from "../services/api";
import { Donation, NeedItem, User } from "../Types/types";
import { useAuth } from "../context/AuthContext";

interface ExtendedDonation extends Donation {
  need?: NeedItem & {
    user?: User;
  };
  donor?: User;
}

const CareHomeDonationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [donations, setDonations] = useState<ExtendedDonation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDonation, setSelectedDonation] =
    useState<ExtendedDonation | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<"completed" | "rejected">(
    "completed"
  );

  const itemsPerPage = 5;

  const filteredData = donations.filter((donation) => {
    if (!searchQuery) return true;
    const donorName = donation.donor?.name?.toLowerCase() || "";
    return donorName.includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        if (!user) return;

        const data = await DonationsService.getCareHomeDonations(user.id);

        const typedDonations: ExtendedDonation[] = data.map((d) => ({
          ...d,
          status:
            d.status === "completed" || d.status === "rejected"
              ? d.status
              : "pending",
        }));

        setDonations(typedDonations);
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); 
  };

  const handleStatusChange = (
    donation: ExtendedDonation,
    status: "completed" | "rejected"
  ) => {
    setSelectedDonation(donation);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedDonation?.id) return;

    try {
      await DonationsService.updateDonationStatus(
        selectedDonation.id,
        newStatus
      );

      setDonations(
        donations.map((d) =>
          d.id === selectedDonation.id ? { ...d, status: newStatus } : d
        )
      );

      setShowStatusModal(false);
      setSelectedDonation(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  if (loading)
    return <div className="text-center p-8">Loading donations...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <CareHomeSidebar activePage="donation" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <h1 className="text-4xl font-bold text-sky-400 mb-6 text-center">
            Donations Received
          </h1>

          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search by donor name..."
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
          </div>

          <div className="bg-white rounded-md shadow overflow-hidden">
            <Table
              columns={[
                {
                  header: "Donor",
                  accessor: (item: ExtendedDonation) => (
                    <div>
                      <div className="font-medium">
                        {item.donor?.name || "Unknown"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.donor?.email}
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Item",
                  accessor: (item: ExtendedDonation) => (
                    <div>
                      <div>{item.need?.itemName}</div>
                      <div className="text-sm text-gray-500">
                        {item.need?.category}
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Quantity",
                  accessor: (item: ExtendedDonation) => item.quantity,
                },
                {
                  header: "Date",
                  accessor: (item: ExtendedDonation) =>
                    new Date(item.date).toLocaleDateString(),
                },
                {
                  header: "Status",
                  accessor: (item: ExtendedDonation) => (
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
                  accessor: (item: ExtendedDonation) => (
                    <div className="flex space-x-4">
                      {item.status === "pending" && (
                        <>
                          <button
                            className="text-green-500 hover:text-green-700"
                            onClick={() =>
                              handleStatusChange(item, "completed")
                            }
                          >
                            <Check size={18} />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleStatusChange(item, "rejected")}
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
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

      {showStatusModal && selectedDonation && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Status Change</h2>
            <p>
              Are you sure you want to mark donation of{" "}
              <strong>
                {selectedDonation.quantity} {selectedDonation.need?.itemName}
              </strong>{" "}
              as <strong>{newStatus}</strong>?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-full"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 text-white rounded-full ${
                  newStatus === "completed"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                onClick={confirmStatusChange}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareHomeDonationsPage;
