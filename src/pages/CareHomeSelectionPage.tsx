import React, { useState, useEffect } from "react";
import axios from "axios";
import DonorSidebar from "../components/DonorSidebar";
import Navbar from "../components/NavBarAuth";
import { useNavigate } from "react-router-dom";

interface CareHome {
  id: number;
  registrationNo: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  category: string;
}

const CareHomeSelectionPage: React.FC = () => {
  const [careHomes, setCareHomes] = useState<CareHome[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareHomes = async () => {
      try {
        const response = await axios.get("/api/carehomes", {
          params: {
            search: searchTerm,
            category: categoryFilter,
            location: locationFilter,
          },
        });
        setCareHomes(response.data.data);
      } catch (error) {
        console.error("Error fetching care homes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareHomes();
  }, [searchTerm, categoryFilter, locationFilter]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="select-carehome" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <h1 className="text-4xl font-bold text-sky-400 mb-6 text-center">
            Select Care Home
          </h1>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by name or registration number..."
                className="p-2 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="p-2 border rounded"
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
                className="p-2 border rounded"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="text-center py-8">Loading care homes...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {careHomes.map((home) => (
                  <div
                    key={home.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/carehome-needs/${home.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {home.name} ({home.registrationNo})
                        </h3>
                        <p className="text-sm text-gray-600">{home.address}</p>
                        <p className="text-sm text-gray-600">{home.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{home.phone}</p>
                        <p className="text-sm text-blue-600">{home.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareHomeSelectionPage;
