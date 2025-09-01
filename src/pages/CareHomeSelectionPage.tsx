import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DonorSidebar from "../components/DonorSidebar";
import Navbar from "../components/NavBarAuth";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { X, Search, MapPin, Navigation } from "lucide-react";
import DonationTypeModal from "../components/DonationTypeModal";
import { CareHome } from "../Types/types";

const GOOGLE_MAPS_API_KEY = "AIzaSyBgql8u3lwKDsifAvzHgGdoeIl38-jqYTo";

interface ExtendedCareHome extends CareHome {
  lat?: number;
  lng?: number;
  distance?: number;
}

declare global {
  interface Window {
    google?: any;
    selectCareHomeFromMap?: (careHomeId: number) => void;
    initMap?: () => void;
  }
}

const CareHomeSelectionPage: React.FC = () => {
  const [careHomes, setCareHomes] = useState<ExtendedCareHome[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  });
  const [selectedCareHome, setSelectedCareHome] =
    useState<ExtendedCareHome | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.google) {
      setIsGoogleMapsLoaded(true);
      initMap();
    }
  }, []);

  useEffect(() => {
    if (showMap && !isGoogleMapsLoaded) {
      loadGoogleMaps();
    } else if (showMap && isGoogleMapsLoaded && !map) {
      initMap();
    }
  }, [showMap, isGoogleMapsLoaded]);

  const loadGoogleMaps = () => {
    if (document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      setIsGoogleMapsLoaded(true);
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error("Failed to load Google Maps");
      setMapLoading(false);
    };

    window.initMap = initMap;

    document.head.appendChild(script);
  };

  const initMap = () => {
    if (!window.google || !mapRef.current || map) return;

    try {
      const initialMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 6.9271, lng: 79.8612 },
        zoom: 10,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
        ],
      });

      setMap(initialMap);
      setMapLoading(false);
      setIsGoogleMapsLoaded(true);

      initialMap.addListener("click", (e: any) => {
        if (e.latLng) {
          setUserLocation({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          });

          reverseGeocode(e.latLng.lat(), e.latLng.lng());
        }
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapLoading(false);
    }
  };

  const reverseGeocode = (lat: number, lng: number) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      { location: { lat, lng } },
      (results: any[], status: string) => {
        if (status === "OK" && results && results[0]) {
          setLocationFilter(results[0].formatted_address);
        }
      }
    );
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setUserLocation(location);
          reverseGeocode(location.lat, location.lng);

          if (map) {
            map.setCenter(location);
            map.setZoom(14);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get your location. Please allow location access or search manually."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    const fetchCareHomes = async () => {
      try {
        setLoading(true);
        const params: any = {
          search: searchTerm,
          category: categoryFilter,
          location: locationFilter,
          page: pagination.page,
          limit: pagination.limit,
        };

        if (userLocation) {
          params.lat = userLocation.lat;
          params.lng = userLocation.lng;
        }

        const response = await axios.get("/api/carehomes", {
          params,
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

        updateMapWithCareHomes(response.data.data);
      } catch (error) {
        console.error("Error fetching care homes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareHomes();
  }, [
    searchTerm,
    categoryFilter,
    locationFilter,
    pagination.page,
    userLocation,
  ]);

  const updateMapWithCareHomes = (homes: ExtendedCareHome[]) => {
    if (!window.google || !map) return;

    markers.forEach((marker: any) => marker.setMap(null));
    const newMarkers: any[] = [];

    if (homes.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();

      homes.forEach((home) => {
        if (home.lat && home.lng) {
          const position = new window.google.maps.LatLng(home.lat, home.lng);

          const marker = new window.google.maps.Marker({
            position,
            map,
            title: home.name,
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            },
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-semibold text-blue-600">${home.name}</h3>
                <p class="text-sm">${home.address || ""}</p>
                <p class="text-sm mt-1">${home.phone || ""}</p>
                <button onclick="window.selectCareHomeFromMap(${home.id})" 
                  class="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                  Select
                </button>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });

          newMarkers.push(marker);
          bounds.extend(position);
        }
      });

      if (userLocation) {
        const userMarker = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(
            userLocation.lat,
            userLocation.lng
          ),
          map,
          title: "Your Location",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          },
        });

        newMarkers.push(userMarker);
        bounds.extend(
          new window.google.maps.LatLng(userLocation.lat, userLocation.lng)
        );
      }

      // Fit map to show all markers
      if (
        homes.filter((home) => home.lat && home.lng).length > 0 ||
        userLocation
      ) {
        map.fitBounds(bounds);
      }

      setMarkers(newMarkers);
    }
  };

  useEffect(() => {
    window.selectCareHomeFromMap = (careHomeId: number) => {
      const home = careHomes.find((h) => h.id === careHomeId);
      if (home) {
        handleCareHomeClick(home);
      }
    };

    return () => {
      if (window.selectCareHomeFromMap) {
        window.selectCareHomeFromMap = undefined;
      }
    };
  }, [careHomes]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleCareHomeClick = (home: ExtendedCareHome) => {
    setSelectedCareHome(home);
    setShowDonationModal(true);
  };

  const handleDonationTypeSelect = (type: "meal" | "drygood") => {
    if (!selectedCareHome) return;

    if (type === "meal") {
      navigate("/meal-scheduling", { state: { careHome: selectedCareHome } });
    } else {
      navigate(`/carehome-needs/${selectedCareHome.id}`);
    }

    setShowDonationModal(false);
    setSelectedCareHome(null);
  };

  const handleModalClose = () => {
    setShowDonationModal(false);
    setSelectedCareHome(null);
  };

  useEffect(() => {
    if (
      window.google &&
      window.google.maps &&
      document.getElementById("location-input")
    ) {
      try {
        const locationInput = document.getElementById(
          "location-input"
        ) as HTMLInputElement;
        const autocomplete = new window.google.maps.places.Autocomplete(
          locationInput,
          {
            types: ["geocode"],
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            setUserLocation({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
            setLocationFilter(place.formatted_address || "");

            if (map) {
              map.setCenter(place.geometry.location);
              map.setZoom(14);
            }
          }
        });
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
      }
    }
  }, [map, locationFilter, isGoogleMapsLoaded]);

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

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="location-input"
                  type="text"
                  placeholder="Enter your location or click on map"
                  className="w-full pl-9 pr-20 py-1.5 border border-gray-200 rounded-md focus:border-[#63C6F7] focus:ring-1 focus:ring-[#63C6F7] text-sm"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
                <button
                  className="absolute right-2 top-1.5 text-gray-400 hover:text-[#63C6F7]"
                  onClick={getCurrentLocation}
                  title="Use current location"
                >
                  <Navigation size={16} />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  showMap
                    ? "bg-[#63C6F7] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? "Hide Map" : "Show Map View"}
              </button>
            </div>

            {showMap && (
              <div className="mb-6 h-96 rounded-md overflow-hidden relative">
                {mapLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-10">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#63C6F7]"></div>
                      <p className="mt-2 text-gray-600 text-sm">
                        Loading map...
                      </p>
                    </div>
                  </div>
                )}
                <div ref={mapRef} className="w-full h-full"></div>
                <div className="absolute top-4 left-4 bg-white p-2 rounded shadow text-xs">
                  <p>Click on the map to set your location</p>
                  <p className="flex items-center mt-1">
                    <span className="w-3 h-3 bg-red-600 rounded-full mr-1"></span>{" "}
                    Your location
                  </p>
                  <p className="flex items-center">
                    <span className="w-3 h-3 bg-blue-600 rounded-full mr-1"></span>{" "}
                    Care homes
                  </p>
                </div>
              </div>
            )}

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
                      onClick={() => handleCareHomeClick(home)}
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
                          {home.distance !== undefined && (
                            <p className="text-gray-600 text-sm mt-1">
                              {home.distance.toFixed(1)} km away
                            </p>
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

          <DonationTypeModal
            isOpen={showDonationModal}
            onClose={handleModalClose}
            careHome={selectedCareHome}
            onSelectDonationType={handleDonationTypeSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default CareHomeSelectionPage;