import React, { useState, useEffect } from "react";
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
      status: "pending" as const, // Mark as const to ensure type is "pending" not string
      notes: `Donation of ${donationQuantity} ${need.itemName}`,
    };

    const donation = await DonationsService.createDonation(donationData);
    navigate(`/donation-receipt/${donation.id}`);
  } catch (err) {
    console.error("Donation error:", err);
    setError(
      err instanceof Error ? err.message : "Failed to process donation"
    );
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
          <h1 className="text-4xl font-bold text-[#63C6F7] mb-8 text-center">
            Select Quantity to Donate
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
            {/* Donation Summary Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 w-full lg:w-1/2 max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Donation Summary
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

              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">
                      Item to Donate
                    </h3>
                    <p className="text-lg font-semibold">{need.itemName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Required Quantity
                    </h3>
                    <p className="text-2xl font-bold">
                      {need.requiredQuantity}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Current Quantity
                    </h3>
                    <p className="text-2xl font-bold">{need.currentQuantity}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Remaining Need
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {remainingQuantity}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Care Home
                    </h3>
                    <p className="text-lg font-medium">
                      {careHome?.name || "Loading care home..."}
                    </p>
                    {careHome?.address && (
                      <p className="text-sm text-gray-600">
                        {careHome.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Donation Form Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 w-full lg:w-1/2 max-w-2xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Select Donation Amount
              </h2>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Donate
                </label>
                <div className="relative">
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
                    units
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Maximum donation: {remainingQuantity} units
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-8">
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
                    Your donation will help fulfill{" "}
                    {Math.round(
                      (donationQuantity / need.requiredQuantity) * 100
                    )}
                    % of this need
                  </span>
                </div>
              </div>

              <div className="flex justify-between space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="w-52 px-4 py-2 border border-[#63C6F7] rounded-full text-[#63C6F7] font-medium hover:bg-[#63C6F7] hover:bg-opacity-10 transition duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDonate}
                  disabled={isSubmitting}
                  className={`w-52 px-4 py-2 bg-[#63C6F7] hover:bg-[#52b0e0] text-white rounded-full font-medium transition duration-200 text-sm ${
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
  );
};

export default DonationPage;