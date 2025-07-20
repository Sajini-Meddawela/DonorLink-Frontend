import React, { useState, useEffect } from "react";
import axios from "axios";
import DonorSidebar from "../components/DonorSidebar";
import Navbar from "../components/NavBarAuth";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { X, Search } from "lucide-react";

interface CareHome {
  id: number;
  registrationNo: string | null;
  name: string;
  address: string | null;
  phone: string;
  email: string;
  category: string | null;
}

const CareHomeSelectionPage: React.FC = () => {
  const [careHomes, setCareHomes] = useState<CareHome[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareHomes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/carehomes", {
          params: {
            search: searchTerm,
            category: categoryFilter,
            location: locationFilter,
            page: pagination.page,
            limit: pagination.limit,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setCareHomes(response.data.data);
        setPagination({
          page: response.data.meta.page,
          limit: response.data.meta.limit,
          total: response.data.meta.total,
          totalPages: response.data.meta.totalPages,
        });
      } catch (error) {
        console.error("Error fetching care homes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareHomes();
  }, [searchTerm, categoryFilter, locationFilter, pagination.page]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="select-carehome" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <h1 className="text-4xl font-bold text-[#63C6F7] mb-6 text-center">
            Select Care Home
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search care homes..."
                  className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-md focus:border-[#63C6F7] focus:ring-1 focus:ring-[#63C6F7] text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm("")}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <select
                className="w-full px-3 py-1.5 border border-gray-200 rounded-md focus:border-[#63C6F7] focus:ring-1 focus:ring-[#63C6F7] text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="CHILDREN">Children</option>
                <option value="ADULTS">Adults</option>
                <option value="SENIORS">Seniors</option>
                <option value="DISABLED">Disabled</option>
                <option value="GENERAL">General</option>
              </select>

              <input
                type="text"
                placeholder="Filter by location..."
                className="w-full px-3 py-1.5 border border-gray-200 rounded-md focus:border-[#63C6F7] focus:ring-1 focus:ring-[#63C6F7] text-sm"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#63C6F7]"></div>
                <p className="mt-2 text-gray-600 text-sm">
                  Loading care homes...
                </p>
              </div>
            ) : careHomes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  No care homes found matching your criteria
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {careHomes.map((home) => (
                    <div
                      key={home.id}
                      className="p-4 border border-gray-100 rounded-lg hover:border-[#63C6F7] hover:bg-[#63C6F7]/5 transition-all cursor-pointer"
                      onClick={() => navigate(`/carehome-needs/${home.id}`)}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#63C6F7]">
                            {home.name}
                            {home.registrationNo && (
                              <span className="text-[#63C6F7] text-lg ml-1">
                                ({home.registrationNo})
                              </span>
                            )}
                          </h3>
                          {home.category && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-sm font-medium bg-[#85C536] text-white">
                              {home.category.toLowerCase()}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          {home.address && (
                            <p className="text-gray-700 text-xs">
                              <span className="font-medium">Address:</span>{" "}
                              {home.address}
                            </p>
                          )}
                          <p className="text-gray-700 text-xs mt-0.5">
                            <span className="font-medium">Phone:</span>{" "}
                            {home.phone}
                          </p>
                          <p className="text-gray-700 text-xs mt-0.5">
                            {home.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareHomeSelectionPage;
