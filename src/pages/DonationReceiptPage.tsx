import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { DonationsService, CareHomeService } from "../services/api";
import { Donation, User, CareHome } from "../Types/types";
import { useAuth } from "../context/AuthContext";
import DonorSidebar from "../components/DonorSidebar";
import Navbar from "../components/NavBarAuth";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface ExtendedDonation extends Donation {
  donor?: User;
}

const DonationReceiptPage: React.FC = () => {
  const { donationId } = useParams<{ donationId: string }>();
  const { user } = useAuth() as { user: User };
  const navigate = useNavigate();
  const [donation, setDonation] = useState<ExtendedDonation | null>(null);
  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonationAndCareHome = async () => {
      try {
        if (!donationId) throw new Error("No donation ID provided");

        const donationData = await DonationsService.getDonationById(
          parseInt(donationId)
        );
        if (!donationData) throw new Error("Donation not found");
        if (!donationData.need) throw new Error("Associated need not found");

        setDonation(donationData);

        const careHomeData = await CareHomeService.getCareHomeDetails(
          donationData.need.userId
        );
        setCareHome(careHomeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationAndCareHome();
  }, [donationId]);

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
        pdf.save(`donation-receipt-${donationId}.pdf`);
        toast.success("Receipt downloaded successfully!");
        navigate("/donor_dashboard");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        toast.error("Failed to download receipt");
      });
  };

  const handleCancel = () => {
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="donor-needs" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          {/* Centered Title Section */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl font-bold text-[#63C6F7] text-center">
              Donation Receipt
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
                  Receipt #{donation.id}
                </h3>
                <p className="text-gray-600">Thank you for your donation!</p>
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
                    <span className="font-medium">Item:</span>{" "}
                    {donation.need?.itemName}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {donation.need?.category}
                  </p>
                  <p>
                    <span className="font-medium">Quantity:</span>{" "}
                    {donation.quantity}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`${
                        donation.status === "completed"
                          ? "text-green-600"
                          : donation.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      } font-medium`}
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
              {donation.status === "pending" && (
                <p className="text-gray-700 mb-6">
                  Your donation of {donation.quantity} {donation.need?.itemName}{" "}
                  is pending confirmation from {careHome?.name}. You'll receive
                  an update once the care home has processed your donation.
                </p>
              )}
              {donation.status === "completed" && (
                <p className="text-gray-700 mb-6">
                  Your generous donation of {donation.quantity}{" "}
                  {donation.need?.itemName} has been received and will help us
                  continue our mission to provide care and support. We truly
                  appreciate your contribution to our community.
                </p>
              )}
              {donation.status === "rejected" && (
                <p className="text-gray-700 mb-6">
                  We regret to inform you that your donation of{" "}
                  {donation.quantity} {donation.need?.itemName} could not be
                  accepted at this time. Please contact {careHome?.name} for
                  more information.
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
              onClick={handleCancel}
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

export default DonationReceiptPage;
