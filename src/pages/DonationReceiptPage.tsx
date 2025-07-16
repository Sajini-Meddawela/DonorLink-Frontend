import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DonationsService } from '../services/api';
import { Donation, User } from '../Types/types';
import { useAuth } from '../context/AuthContext';
import DonorSidebar from '../components/DonorSidebar';
import Navbar from '../components/NavBarAuth';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ExtendedDonation extends Donation {
  donor?: User;
}

const DonationReceiptPage: React.FC = () => {
  const { donationId } = useParams<{ donationId: string }>();
  const { user } = useAuth() as { user: User };
  const navigate = useNavigate();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        if (!donationId) throw new Error('No donation ID provided');
        
        const data = await DonationsService.getDonationById(parseInt(donationId));
        setDonation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch donation');
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [donationId]);

  const handleDownloadPDF = () => {
    const receiptElement = document.getElementById('receipt');
    if (!receiptElement) return;

    html2canvas(receiptElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`donation-receipt-${donationId}.pdf`);
      navigate('/donor_dashboard');
    });
  };

  const handleCancel = () => {
    navigate('/donor_dashboard');
  };

 if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  if (!donation || !donation.need) return <div className="text-center p-8">Donation details not found</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="donor-needs" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#63C6F7]">
              Donation Receipt
            </h1>
            <div className="text-gray-500">
              {new Date(donation.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div id="receipt" className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Haven of Hope</h2>
                <p className="text-gray-600">123 Care Street, Compassion City</p>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-semibold">Receipt #{donation.id}</h3>
                <p className="text-gray-600">Thank you for your donation!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Donor Information</h3>
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
                  <p><span className="font-medium">Item:</span> {donation.need.itemName}</p>
                  <p><span className="font-medium">Category:</span> {donation.need.category}</p>
                  <p><span className="font-medium">Quantity:</span> {donation.quantity}</p>
                  <p><span className="font-medium">Status:</span> <span className="text-green-600">Completed</span></p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Thank You Note</h3>
              <p className="text-gray-700 mb-6">
                Your generous donation of {donation.quantity} {donation.need.itemName} will help 
                us continue our mission to provide care and support. We truly appreciate your 
                contribution to our community.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-gray-500 text-sm">
                  Haven of Hope Senior Care
                </div>
                <div className="text-gray-500 text-sm">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-6 mt-8">
            <button
              onClick={handleCancel}
              className="px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition duration-200"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-8 py-3 bg-[#63C6F7] hover:bg-[#52b0e0] text-white rounded-lg font-medium shadow-md transition duration-200 hover:scale-105"
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