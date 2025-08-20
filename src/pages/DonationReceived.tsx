import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, X, Settings, Utensils, Package } from "lucide-react";
import CareHomeSidebar from "../components/SideBar";
import Navbar from "../components/NavBarAuth";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { DonationsService, MealDonationService } from "../services/api";
import { Donation, NeedItem, User, MealDonationSlot } from "../Types/types";
import { useAuth } from "../context/AuthContext";

interface ExtendedDonation extends Donation {
  need?: NeedItem & {
    user?: User;
  };
  donor?: User;
}

interface ExtendedMealDonation {
  id: number;
  slot: MealDonationSlot;
  donor?: User;
  careHomeId: number;
  date: Date;
  status: 'booked' | 'completed' | 'cancelled';
  type: 'meal';
}

const CareHomeDonationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [donations, setDonations] = useState<ExtendedDonation[]>([]);
  const [mealDonations, setMealDonations] = useState<ExtendedMealDonation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<"completed" | "rejected" | "cancelled">("completed");
  const [activeTab, setActiveTab] = useState<'drygoods' | 'meals'>('drygoods');

  const itemsPerPage = 8;

  const filteredDryGoods = donations.filter((donation) => {
    if (!searchQuery) return true;
    const donorName = donation.donor?.name?.toLowerCase() || "";
    return donorName.includes(searchQuery.toLowerCase());
  });

  const filteredMeals = mealDonations.filter((donation) => {
    if (!searchQuery) return true;
    const donorName = donation.donor?.name?.toLowerCase() || "";
    return donorName.includes(searchQuery.toLowerCase());
  });

  const currentData = activeTab === 'drygoods' ? filteredDryGoods : filteredMeals;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginatedData = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        if (!user) return;

        // Fetch dry goods donations
        const dryGoodsData = await DonationsService.getCareHomeDonations(user.id);
        const typedDonations: ExtendedDonation[] = dryGoodsData.map((d) => ({
          ...d,
          status: d.status === "completed" || d.status === "rejected" ? d.status : "pending",
        }));

        setDonations(typedDonations);

        const startDate = new Date(0); 
        const endDate = new Date(); 
        const mealSlots = await MealDonationService.getSlots(user.id, startDate, endDate);
        
        const bookedMealSlots = mealSlots.filter((slot: any) => 
          slot.status === 'Booked' || slot.status === 'Completed' || slot.donorId
        );

        const typedMealDonations: ExtendedMealDonation[] = await Promise.all(
          bookedMealSlots.map(async (slot: any) => {
            let donor;
            if (slot.donorId) {
              try {
                donor = { id: slot.donorId, name: "Unknown Donor" }; 
              } catch (error) {
                console.error("Error fetching donor:", error);
                donor = { id: slot.donorId, name: "Unknown Donor" };
              }
            }

            return {
              id: slot.id,
              slot: slot,
              donor: donor,
              careHomeId: slot.careHomeId,
              date: slot.date,
              status: (slot.status.toLowerCase() as 'booked' | 'completed' | 'cancelled'),
              type: 'meal'
            };
          })
        );

        setMealDonations(typedMealDonations);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch donations");
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

  const handleStatusChange = (donation: any, status: "completed" | "rejected" | "cancelled") => {
    setSelectedDonation(donation);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedDonation) return;

    try {
      setLoading(true);

      if (selectedDonation.type === 'meal') {
        // Update meal donation status
        await MealDonationService.updateMealDonationStatus(selectedDonation.id, newStatus === 'completed' ? 'completed' : 'cancelled');
        
        // Refresh meal donations
        const startDate = new Date(0);
        const endDate = new Date();
        const mealSlots = await MealDonationService.getSlots(user?.id || 0, startDate, endDate);
        
        const bookedMealSlots = mealSlots.filter((slot: any) => 
          slot.status === 'Booked' || slot.status === 'Completed' || slot.donorId
        );

        const typedMealDonations: ExtendedMealDonation[] = await Promise.all(
          bookedMealSlots.map(async (slot: any) => {
            let donor;
            if (slot.donorId) {
              donor = { id: slot.donorId, name: "Unknown Donor" }; 
            }

            return {
              id: slot.id,
              slot: slot,
              donor: donor,
              careHomeId: slot.careHomeId,
              date: slot.date,
              status: (slot.status.toLowerCase() as 'booked' | 'completed' | 'cancelled'),
              type: 'meal'
            };
          })
        );
        setMealDonations(typedMealDonations);
      } else {
        await DonationsService.updateDonationStatus(selectedDonation.id, newStatus);
        
        const dryGoodsData = await DonationsService.getCareHomeDonations(user?.id || 0);
        const typedDonations: ExtendedDonation[] = dryGoodsData.map((d) => ({
          ...d,
          status: d.status === "completed" || d.status === "rejected" ? d.status : "pending",
        }));
        setDonations(typedDonations);
      }

      setShowStatusModal(false);
      setSelectedDonation(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading donations...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <CareHomeSidebar activePage="donation" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <h1 className="text-4xl font-bold text-sky-400 mb-6 text-center">
            Donations Received
          </h1>

          {/* Tab Navigation */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'drygoods'
                  ? 'text-sky-400 border-b-2 border-sky-400'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('drygoods')}
            >
              <Package className="inline-block mr-2 h-4 w-4" />
              Dry Goods Donations
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'meals'
                  ? 'text-sky-400 border-b-2 border-sky-400'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('meals')}
            >
              <Utensils className="inline-block mr-2 h-4 w-4" />
              Meal Donations
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder={`Search by donor name...`}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Render separate tables for each tab */}
          {activeTab === 'drygoods' && (
            <div className="bg-white rounded-md shadow overflow-hidden">
              <Table<ExtendedDonation>
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
                              onClick={() => handleStatusChange(item, "completed")}
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
                data={paginatedData as ExtendedDonation[]}
              />
            </div>
          )}

          {activeTab === 'meals' && (
            <div className="bg-white rounded-md shadow overflow-hidden">
              <Table<ExtendedMealDonation>
                columns={[
                  {
                    header: "Donor",
                    accessor: (item: ExtendedMealDonation) => (
                      <div>
                        <div className="font-medium">
                          {item.donor?.name || "Unknown Donor"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.donor?.email || "No email available"}
                        </div>
                      </div>
                    ),
                  },
                  {
                    header: "Meal Details",
                    accessor: (item: ExtendedMealDonation) => (
                      <div>
                        <div className="font-medium">{item.slot.mealType}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(item.slot.date).toLocaleDateString()}
                        </div>
                      </div>
                    ),
                  },
                  {
                    header: "Time Slot",
                    accessor: (item: ExtendedMealDonation) => (
                      <div>
                        {item.slot.mealType === 'Breakfast' ? '7:00 AM - 9:00 AM' :
                         item.slot.mealType === 'Lunch' ? '12:00 PM - 2:00 PM' :
                         '6:00 PM - 8:00 PM'}
                      </div>
                    ),
                  },
                  {
                    header: "Status",
                    accessor: (item: ExtendedMealDonation) => (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : item.status === "cancelled"
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
                    accessor: (item: ExtendedMealDonation) => (
                      <div className="flex space-x-4">
                        {item.status === "booked" && (
                          <>
                            <button
                              className="text-green-500 hover:text-green-700"
                              onClick={() => handleStatusChange(item, "completed")}
                            >
                              <Check size={18} />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleStatusChange(item, "cancelled")}
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    ),
                  },
                ]}
                data={paginatedData as ExtendedMealDonation[]}
              />
            </div>
          )}

          {mealDonations.length === 0 && activeTab === 'meals' && !loading && (
            <div className="text-center py-8 bg-white rounded-md shadow">
              <p className="text-gray-500">No meal donations received yet.</p>
            </div>
          )}

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
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md">
            <h2 className="text-lg font-bold mb-4">Confirm Status Change</h2>
            
            {selectedDonation.type === 'meal' ? (
              <>
                <p>
                  Are you sure you want to mark the {selectedDonation.slot.mealType} meal donation on{" "}
                  {new Date(selectedDonation.slot.date).toLocaleDateString()} as{" "}
                  <strong>{newStatus}</strong>?
                </p>
                {newStatus === "completed" && (
                  <div className="mt-3 p-3 bg-green-50 rounded-md">
                    <p className="text-green-600 font-medium">Note:</p>
                    <p className="text-green-600">
                      This will mark the meal slot as completed and notify the donor.
                    </p>
                  </div>
                )}
                {newStatus === "cancelled" && (
                  <div className="mt-3 p-3 bg-red-50 rounded-md">
                    <p className="text-red-600 font-medium">Important:</p>
                    <p className="text-red-600">
                      This will cancel the meal donation and free up the time slot for other donors.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <p>
                  Are you sure you want to mark donation of{" "}
                  <strong>
                    {selectedDonation.quantity} {selectedDonation.need?.itemName}
                  </strong>{" "}
                  as <strong>{newStatus}</strong>?
                </p>
                {newStatus === "rejected" && (
                  <div className="mt-3 p-3 bg-red-50 rounded-md">
                    <p className="text-red-600 font-medium">Important:</p>
                    <ul className="list-disc pl-5 mt-1 text-red-600">
                      <li>
                        This will remove {selectedDonation.quantity} from fulfilled
                        items
                      </li>
                      <li>
                        The need will show as requiring {selectedDonation.quantity}{" "}
                        more items
                      </li>
                    </ul>
                  </div>
                )}
                {newStatus === "completed" &&
                  selectedDonation.status === "rejected" && (
                    <div className="mt-3 p-3 bg-green-50 rounded-md">
                      <p className="text-green-600 font-medium">Note:</p>
                      <ul className="list-disc pl-5 mt-1 text-green-600">
                        <li>
                          This will add {selectedDonation.quantity} to fulfilled
                          items
                        </li>
                        <li>
                          The need will show as requiring{" "}
                          {selectedDonation.quantity} fewer items
                        </li>
                      </ul>
                    </div>
                  )}
              </>
            )}

            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 text-white rounded-full hover:opacity-90 transition ${
                  newStatus === "completed" ? "bg-green-500" : "bg-red-500"
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