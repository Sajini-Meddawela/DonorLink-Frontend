import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MealDonationService, CareHomeService } from "../services/api";
import { MealDonationSlot, CareHome, User } from "../Types/types";
import { useAuth } from "../context/AuthContext";
import DonorSidebar from "../components/DonorSidebar";
import Navbar from "../components/NavBarAuth";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface MealDonation {
  id?: number;
  type: "meal";
  slot: MealDonationSlot;
  careHome: CareHome;
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed";
  date: Date;
  donor?: User;
  status: "booked" | "completed" | "cancelled";
}

const MealDonationReceiptPage: React.FC = () => {
  const { donationId } = useParams<{ donationId: string }>();
  const location = useLocation();
  const { user } = useAuth() as { user: User };
  const navigate = useNavigate();
  const [donation, setDonation] = useState<MealDonation | null>(null);
  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        if (location.state?.donation) {
          const donationData = location.state.donation as MealDonation;
          setDonation(donationData);
          setCareHome(donationData.careHome);
        } else if (donationId) {
          throw new Error("Fetching by ID not implemented yet");
        } else {
          throw new Error("No donation data provided");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch donation data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonationData();
  }, [donationId, location.state]);

  const handleDownloadPDF = () => {
    const receiptElement = document.getElementById("receipt");
    if (!receiptElement) {
      toast.error("Receipt element not found");
      return;
    }

    html2canvas(receiptElement)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`meal-donation-receipt-${donationId || "new"}.pdf`);
        toast.success("Receipt downloaded successfully!");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        toast.error("Failed to download receipt");
      });
  };

  const handleBackToDashboard = () => {
    navigate("/donor_dashboard");
  };

  if (loading) return <div className="text-center p-8">Loading receipt...</div>;
  if (error)
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={() => navigate("/donor_dashboard")}
          className="px-4 py-2 border border-[#63C6F7] rounded-full text-[#63C6F7] font-medium hover:bg-[#63C6F7] hover:bg-opacity-10 transition duration-200 text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  if (!donation)
    return <div className="text-center p-8">No donation data available</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      case "booked":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="meal-donations" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          {/* Centered Title Section */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl font-bold text-[#63C6F7] text-center">
              Meal Donation Receipt
            </h1>
            <div className="text-gray-500 mt-2">
              {new Date(donation.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div
            id="receipt"
            className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {careHome?.name || "Care Home"}
                </h2>
                {careHome?.address && (
                  <p className="text-gray-600">{careHome.address}</p>
                )}
              </div>
              <div className="text-right">
                <h3 className="text-xl font-semibold">
                  Receipt #{donation.id || "NEW"}
                </h3>
                <p className="text-gray-600">
                  Thank you for your meal donation!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Donor Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{user?.name}</p>
                  <p>{user?.email}</p>
                  {user?.phone && <p>{user.phone}</p>}
                  {user?.address && <p>{user.address}</p>}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Donation Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>
                    <span className="font-medium">Meal Type:</span>{" "}
                    {donation.slot.mealType}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(donation.slot.date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span>{" "}
                    {donation.slot.mealType === "Breakfast"
                      ? "7:00 AM - 9:00 AM"
                      : donation.slot.mealType === "Lunch"
                      ? "12:00 PM - 2:00 PM"
                      : "6:00 PM - 8:00 PM"}
                  </p>
                  <p>
                    <span className="font-medium">Payment Method:</span>{" "}
                    {donation.paymentMethod}
                  </p>
                  <p>
                    <span className="font-medium">Payment Status:</span>{" "}
                    <span
                      className={`${getPaymentStatusColor(
                        donation.paymentStatus
                      )} font-medium`}
                    >
                      {donation.paymentStatus.charAt(0).toUpperCase() +
                        donation.paymentStatus.slice(1)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Donation Status:</span>{" "}
                    <span
                      className={`${getStatusColor(
                        donation.status
                      )} font-medium`}
                    >
                      {donation.status.charAt(0).toUpperCase() +
                        donation.status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Thank You Note</h3>
              {donation.status === "booked" && (
                <p className="text-gray-700 mb-6">
                  Your meal donation for {donation.slot.mealType} on{" "}
                  {new Date(donation.slot.date).toLocaleDateString()}
                  has been successfully booked. The care home will confirm
                  receipt once your donation is received. Please ensure to
                  deliver the meal ingredients or make the payment as per your
                  selected method.
                </p>
              )}
              {donation.status === "completed" && (
                <p className="text-gray-700 mb-6">
                  Your generous meal donation for {donation.slot.mealType} has
                  been received and will help provide nutritious meals to those
                  in need. We truly appreciate your contribution to our
                  community and your support for {careHome?.name}.
                </p>
              )}
              {donation.status === "cancelled" && (
                <p className="text-gray-700 mb-6">
                  We regret to inform you that your meal donation for{" "}
                  {donation.slot.mealType} could not be accepted at this time.
                  Please contact {careHome?.name} for more information or to
                  reschedule your donation.
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="text-gray-500 text-sm">
                  {careHome?.name || "Care Home"}
                </div>
                <div className="text-gray-500 text-sm">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-6 mt-8">
            <button
              onClick={handleBackToDashboard}
              className="px-8 py-2 border-2 border-[#63C6F7] rounded-full text-[#63C6F7] font-medium hover:bg-[#63C6F7] hover:bg-opacity-10 transition duration-200 text-sm"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-8 py-2 bg-[#63C6F7] hover:bg-[#52b0e0] text-white rounded-full font-medium transition duration-200 text-sm"
            >
              Download Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDonationReceiptPage;
