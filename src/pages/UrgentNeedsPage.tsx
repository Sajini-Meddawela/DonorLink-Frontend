import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, MapPin, Home, ArrowRight, Search, X } from "lucide-react";
import DonorSidebar from "../components/DonorSidebar";
import Navbar from "../components/NavBarAuth";
import Pagination from "../components/Pagination";
import { NeedsService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface UrgentNeedItem {
  id: number;
  itemName: string;
  requiredQuantity: number;
  category: string;
  urgencyLevel: "High" | "Medium" | "Low";
  unit: string;
  careHomeId: number;
  careHomeName: string;
  careHomeCategory: string;
  careHomeAddress: string;
}

const UrgentNeedsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [urgentNeeds, setUrgentNeeds] = useState<UrgentNeedItem[]>([]);
  const [filteredNeeds, setFilteredNeeds] = useState<UrgentNeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 12;

  useEffect(() => {
    fetchUrgentNeeds();
  }, [currentPage]);

  useEffect(() => {
    filterNeeds();
  }, [urgentNeeds, searchQuery]);

  const fetchUrgentNeeds = async () => {
    try {
      setLoading(true);
      const response = await NeedsService.getUrgentNeeds(currentPage, itemsPerPage);
      
      setUrgentNeeds(response.needs);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch urgent needs");
      toast.error("Failed to load urgent needs");
    } finally {
      setLoading(false);
    }
  };

  const filterNeeds = () => {
    if (!searchQuery.trim()) {
      setFilteredNeeds(urgentNeeds);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = urgentNeeds.filter(need =>
      need.careHomeName.toLowerCase().includes(query) ||
      need.careHomeAddress.toLowerCase().includes(query) ||
      need.careHomeCategory.toLowerCase().includes(query) ||
      need.itemName.toLowerCase().includes(query) ||
      need.category.toLowerCase().includes(query)
    );
    
    setFilteredNeeds(filtered);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleDonateClick = (need: UrgentNeedItem) => {
    navigate(`/carehome-needs/${need.careHomeId}`, { 
      state: { 
        highlightNeedId: need.id,
        fromUrgentNeeds: true 
      }
    });
  };

  const handleViewCareHome = (careHomeId: number) => {
    navigate(`/carehome-needs/${careHomeId}`);
  };

  const getCareHomeCategoryColor = (category: string) => {
    const colors = {
      CHILDREN: "bg-pink-100 text-pink-800",
      ADULTS: "bg-blue-100 text-blue-800",
      SENIORS: "bg-purple-100 text-purple-800",
      DISABLED: "bg-orange-100 text-orange-800",
      GENERAL: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || colors.GENERAL;
  };

  const displayNeeds = searchQuery ? filteredNeeds : urgentNeeds;
  const displayCount = searchQuery ? filteredNeeds.length : totalCount;

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-1 overflow-hidden pt-20">
          <DonorSidebar activePage="urgent-needs" />
          <div className="flex-1 flex items-center justify-center ml-[260px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#63C6F7] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading urgent needs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-1 overflow-hidden pt-20">
          <DonorSidebar activePage="urgent-needs" />
          <div className="flex-1 flex items-center justify-center ml-[260px]">
            <div className="text-center text-red-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <p>Error: {error}</p>
              <button
                onClick={fetchUrgentNeeds}
                className="mt-4 px-4 py-2 bg-[#63C6F7] text-white rounded-md hover:bg-[#52b0e0]"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="urgent-needs" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#63C6F7] mb-2">
                Urgent Needs
              </h1>
              <p className="text-gray-600">
                {displayCount} high-priority needs requiring immediate support
                {searchQuery && ` (filtered from ${totalCount} total)`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by care home, address, category..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-800 font-medium text-sm">
                    Immediate attention required
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Search className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-blue-800">
                    Showing {filteredNeeds.length} results for "{searchQuery}"
                  </span>
                </div>
                <button
                  onClick={clearSearch}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}

          {/* Urgent Needs Grid */}
          {displayNeeds.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchQuery ? "No matching urgent needs found" : "No Urgent Needs Right Now"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchQuery 
                  ? "Try adjusting your search terms or browse all urgent needs."
                  : "Great news! There are currently no high-urgency needs requiring immediate support. Check back later or browse regular needs from care homes."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Show All Urgent Needs
                  </button>
                )}
                <button
                  onClick={() => navigate("/select-carehome")}
                  className="px-6 py-3 bg-[#63C6F7] text-white rounded-lg hover:bg-[#52b0e0] transition-colors"
                >
                  Browse All Care Homes
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayNeeds.map((need) => (
                  <div
                    key={need.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    {/* Care Home Header */}
                    <div className="border-b border-gray-100 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <Home className="h-4 w-4 text-gray-500 mr-2" />
                          <h3 className="font-semibold text-gray-900 truncate">
                            {need.careHomeName}
                          </h3>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getCareHomeCategoryColor(
                            need.careHomeCategory
                          )}`}
                        >
                          {need.careHomeCategory.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">{need.careHomeAddress}</span>
                      </div>
                    </div>

                    {/* Need Details - Simplified */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg text-gray-900">
                          {need.itemName}
                        </h4>
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                          URGENT
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Required Quantity:</span>
                          <span className="font-semibold text-red-600">
                            {need.requiredQuantity} {need.unit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-semibold text-gray-900">{need.category}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDonateClick(need)}
                          className="flex-1 bg-[#63C6F7] text-white py-2 px-4 rounded-lg hover:bg-[#52b0e0] transition-colors font-medium text-sm flex items-center justify-center"
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Donate Now
                        </button>
                        <button
                          onClick={() => handleViewCareHome(need.careHomeId)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center"
                          title="View Care Home"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination - Only show if not searching */}
              {!searchQuery && totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UrgentNeedsPage;