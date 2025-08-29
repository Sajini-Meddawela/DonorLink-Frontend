import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  NeedsService,
  DonationsService,
  CareHomeService,
} from "../services/api";
import { NeedItem, CareHome } from "../Types/types";
import { useAuth } from "../context/AuthContext";
import DonorSidebar from "../components/DonorSidebar";
import Navbar from "../components/NavBarAuth";

const DonationPage: React.FC = () => {
  const { needId } = useParams<{ needId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [need, setNeed] = useState<NeedItem | null>(null);
  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationQuantity, setDonationQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchNeedAndCareHome = async () => {
      try {
        if (!needId) throw new Error("No need ID provided");

        const data = await NeedsService.getNeedById(parseInt(needId));
        setNeed(data);

        if (data) {
          const remaining = data.requiredQuantity - data.currentQuantity;
          setDonationQuantity(Math.max(1, remaining));

          const careHomeData = await CareHomeService.getCareHomeDetails(
            data.userId
          );
          setCareHome(careHomeData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchNeedAndCareHome();
  }, [needId]);

  const handleDonate = async () => {
    if (!user || !need) return;

    setIsSubmitting(true);
    try {
      const donationData = {
        donorId: user.id,
        needId: need.id,
        quantity: donationQuantity,
        date: new Date().toISOString(),
        status: "pending" as const,
        notes: `Donation of ${donationQuantity} ${need.itemName}`,
      };

      const donation = await DonationsService.createDonation(donationData);
      toast.success("Donation submitted successfully!");
      navigate(`/donation-receipt/${donation.id}`);
    } catch (err) {
      console.error("Donation error:", err);
      toast.error("Failed to process donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  if (!need) return <div className="text-center p-8">Need not found</div>;

  const remainingQuantity = need.requiredQuantity - need.currentQuantity;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="donor-needs" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <div className="max-w-6xl mx-auto w-full"> 
            <h1 className="text-4xl font-bold text-[#63C6F7] mb-8 text-center">
              Make a Donation
            </h1>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Donation Details
                </h2>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    need.urgencyLevel === "High"
                      ? "bg-red-100 text-red-800"
                      : need.urgencyLevel === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {need.urgencyLevel} Priority
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Item to Donate
                    </h3>
                    <p className="text-xl font-semibold">{need.itemName}</p>
                    <p className="text-sm text-gray-600">{need.category}</p>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Quantity Needed
                    </h3>
                    <p className="text-2xl font-semibold text-blue-600">
                      {remainingQuantity} {need.unit}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Care Home
                    </h3>
                    <p className="text-lg font-medium">
                      {careHome?.name || "Loading care home..."}
                    </p>
                    {careHome?.address && (
                      <p className="text-sm text-gray-600">{careHome.address}</p>
                    )}
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Your Impact
                    </h3>
                    <p className="text-sm">
                      Your donation will help {careHome?.name} continue their
                      important work and support those in need
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Select Donation Amount
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        How many would you like to donate?
                      </label>
                      <div className="relative max-w-xs">
                        <input
                          type="number"
                          min="1"
                          max={remainingQuantity}
                          value={donationQuantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value > remainingQuantity) {
                              setDonationQuantity(remainingQuantity);
                            } else if (value < 1) {
                              setDonationQuantity(1);
                            } else {
                              setDonationQuantity(value || 1);
                            }
                          }}
                          className="w-full p-4 border-2 border-gray-200 rounded-lg text-2xl font-bold text-center focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          {need.unit}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Maximum donation: {remainingQuantity} {need.unit}
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-blue-700">
                          Your donation will fulfill {donationQuantity} of the{" "}
                          {remainingQuantity} {need.unit} needed
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center space-y-6">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        Ready to make a difference?
                      </p>
                      <p className="text-sm text-gray-600">
                        Your contribution will directly help {careHome?.name} provide essential support
                      </p>
                    </div>
                    
                    <div className="flex justify-center space-x-6 w-full">
                      <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-2 border border-[#63C6F7] rounded-full text-[#63C6F7] font-medium hover:bg-[#63C6F7] hover:bg-opacity-10 transition duration-200 flex-1 max-w-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDonate}
                        disabled={isSubmitting}
                        className={`px-5 py-2 bg-[#63C6F7] hover:bg-[#52b0e0] text-white rounded-full font-medium transition duration-200 flex-1 max-w-xs ${
                          isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? "Processing..." : "Confirm Donation"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;