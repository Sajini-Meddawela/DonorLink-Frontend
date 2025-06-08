import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DonorSidebar from '../components/DonorSidebar';
import Navbar from '../components/NavBarAuth';
import { NeedsService } from '../services/api';
import { NeedItem } from '../Types/types';

const DonationPage: React.FC = () => {
  const navigate = useNavigate();
  const { needId } = useParams<{ needId: string }>();
  const [need, setNeed] = useState<NeedItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDonating, setIsDonating] = useState(false);

  useEffect(() => {
    const fetchNeed = async () => {
      try {
        if (!needId) throw new Error('No need ID provided');
        
        // First get with temporary careHomeId to get the actual careHomeId
        const tempNeed = await NeedsService.getNeedById(parseInt(needId), 1);
        if (!tempNeed) throw new Error('Need not found');
        
        // Then get with proper careHomeId
        const data = await NeedsService.getNeedById(parseInt(needId), tempNeed.careHomeId);
        setNeed(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch need details');
      } finally {
        setLoading(false);
      }
    };

    fetchNeed();
  }, [needId]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setQuantity(Math.max(1, Math.min(value, need ? need.requiredQuantity - need.currentQuantity : 1)));
    }
  };

  const handleDonate = () => {
    setIsDonating(true);
    setTimeout(() => {
      alert(`Donation submitted successfully!\nItem: ${need?.itemName}\nQuantity: ${quantity}`);
      navigate('/donor_dashboard');
      setIsDonating(false);
    }, 1000);
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  if (!need) return <div className="text-center p-8">Need not found</div>;

  const maxQuantity = need.requiredQuantity - need.currentQuantity;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="donor-needs" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <h1 className="text-4xl font-bold text-sky-400 mb-6 text-center">
            Make a Donation
          </h1>
          
          <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Summary of Donation</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Item Name:</span> {need.itemName}</p>
                <p><span className="font-medium">Required Quantity:</span> {need.requiredQuantity}</p>
                <p><span className="font-medium">Current Quantity:</span> {need.currentQuantity}</p>
                <p>
                  <span className="font-medium">Urgency Level:</span> 
                  <span className={`inline-block ml-2 px-2 py-1 rounded-full text-xs ${
                    need.urgencyLevel === 'High' ? 'bg-red-100 text-red-800' :
                    need.urgencyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {need.urgencyLevel}
                  </span>
                </p>
                <p><span className="font-medium">Care Home:</span> Haven of Hope Senior Care</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Quantity to Donate</h2>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border border-gray-300 rounded-md px-4 py-2 w-24 mr-4"
                />
                <span className="text-gray-600">
                  Max {maxQuantity} units - Cannot exceed the limit
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDonate}
                disabled={isDonating}
                className="px-6 py-2 bg-[#63C6F7] text-white rounded-md hover:bg-[#42b5e8] disabled:opacity-50"
              >
                {isDonating ? 'Processing...' : 'Donate Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;