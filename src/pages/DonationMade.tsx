import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Utensils, Package } from "lucide-react";
import DonorSidebar from "../components/DonorSidebar";
import Navbar from "../components/NavBarAuth";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { DonationsService, CareHomeService, MealDonationService } from "../services/api";
import { Donation, CareHome, MealDonationSlot, NeedItem, User } from "../Types/types";
import { useAuth } from "../context/AuthContext";

interface EnhancedDonation {
  id: number;
  quantity: number;
  date: Date;
  status: string;
  notes?: string;
  donorId: number;
  needId: number;
  need?: NeedItem & { user?: User };
  careHome?: CareHome;
}

interface ExtendedMealDonation {
  id: number;
  slot: MealDonationSlot;
  careHome?: CareHome;
  date: Date;
  status: 'booked' | 'completed' | 'cancelled';
  type: 'meal';
}

const DonationMadePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [donationsData, setDonationsData] = useState<EnhancedDonation[]>([]);
  const [mealDonationsData, setMealDonationsData] = useState<ExtendedMealDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'drygoods' | 'meals'>('drygoods');

  const itemsPerPage = 7;

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        if (!user) {
          throw new Error("User not authenticated");
        }

        const dryGoodsData = await DonationsService.getDonationsByDonor(user.id);
        
        const uniqueCareHomeIds = Array.from(
          new Set(
            dryGoodsData
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

        const enhancedDonations: EnhancedDonation[] = dryGoodsData.map(donation => ({
          ...donation,
          date: new Date(donation.date), 
          careHome: donation.need?.userId ? careHomesMap[donation.need.userId] : undefined
        }));

        setDonationsData(enhancedDonations);

        const mealData = await MealDonationService.getDonorBookings(user.id);
        const mealDonationsWithCareHomes = await Promise.all(
          mealData.map(async (meal: any) => {
            const careHome = await CareHomeService.getCareHomeDetails(meal.careHomeId);
            return {
              id: meal.id,
              slot: meal,
              careHome,
              date: new Date(meal.date), 
              status: meal.status as 'booked' | 'completed' | 'cancelled',
              type: 'meal' as const
            };
          })
        );
        setMealDonationsData(mealDonationsWithCareHomes);

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

  const filteredDryGoods = donationsData.filter(
    (item) =>
      item.need?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.need?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.careHome?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.careHome?.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMeals = mealDonationsData.filter(
    (item) =>
      item.careHome?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slot.mealType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.careHome?.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = activeTab === 'drygoods' ? filteredDryGoods : filteredMeals;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginatedData = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleViewReceipt = (donation: EnhancedDonation | ExtendedMealDonation) => {
    if ('type' in donation && donation.type === 'meal') {
      navigate('/meal-donation-receipt', { 
        state: { 
          donation: {
            type: 'meal',
            slot: donation.slot,
            careHome: donation.careHome,
            paymentMethod: 'unknown',
            paymentStatus: 'completed',
            date: donation.date,
            status: donation.status,
            donor: user
          }
        } 
      });
    } else {
      navigate(`/donation-receipt/${donation.id}`);
    }
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

          {/* Tab Navigation */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'drygoods'
                  ? 'text-[#63C6F7] border-b-2 border-[#63C6F7]'
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
                  ? 'text-[#63C6F7] border-b-2 border-[#63C6F7]'
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

          {activeTab === 'drygoods' && (
            <div className="bg-white rounded-md shadow overflow-hidden">
              <Table<EnhancedDonation>
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
                    accessor: (item) => (
                      <div>
                        <div className="font-medium">{item.careHome?.name}</div>
                        <div className="text-sm text-gray-500">
                          {item.careHome?.address}
                        </div>
                      </div>
                    ),
                  },
                  {
                    header: "Quantity",
                    accessor: "quantity",
                  },
                  {
                    header: "Date",
                    accessor: (item) => item.date.toLocaleDateString(),
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
                          className="text-[#63C6F7] font-semibold hover:text-[#52b0e0] flex items-center"
                          onClick={() => handleViewReceipt(item)}
                        >
                          <span className="mr-1">View Receipt</span>
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={paginatedData as EnhancedDonation[]}
              />
            </div>
          )}

          {activeTab === 'meals' && (
            <div className="bg-white rounded-md shadow overflow-hidden">
              <Table<ExtendedMealDonation>
                columns={[
                  {
                    header: "Meal Details",
                    accessor: (item) => (
                      <div>
                        <div className="font-medium">{item.slot.mealType}</div>
                        <div className="text-sm text-gray-500">
                          {item.date.toLocaleDateString()}
                        </div>
                      </div>
                    ),
                  },
                  {
                    header: "Care Home",
                    accessor: (item) => (
                      <div>
                        <div className="font-medium">{item.careHome?.name}</div>
                        <div className="text-sm text-gray-500">
                          {item.careHome?.address}
                        </div>
                      </div>
                    ),
                  },
                  {
                    header: "Time Slot",
                    accessor: (item) => (
                      <div>
                        {item.slot.mealType === 'Breakfast' ? '7:00 AM - 9:00 AM' :
                         item.slot.mealType === 'Lunch' ? '12:00 PM - 2:00 PM' :
                         '6:00 PM - 8:00 PM'}
                      </div>
                    ),
                  },
                  {
                    header: "Date",
                    accessor: (item) => item.date.toLocaleDateString(),
                  },
                  {
                    header: "Status",
                    accessor: (item) => (
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
                    accessor: (item) => (
                      <div className="flex space-x-4">
                        <button
                          className="text-[#63C6F7] font-semibold hover:text-[#52b0e0] flex items-center"
                          onClick={() => handleViewReceipt(item)}
                        >
                          <span className="mr-1">View Receipt</span>
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={paginatedData as ExtendedMealDonation[]}
              />
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
    </div>
  );
};

export default DonationMadePage;