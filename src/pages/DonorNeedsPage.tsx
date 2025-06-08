import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DonorSidebar from '../components/DonorSidebar';
import Navbar from '../components/NavBarAuth';
import { NeedsService } from '../services/api';
import { NeedItem } from '../Types/types';

const DonorNeedsPage: React.FC = () => {
  const { careHomeId } = useParams<{ careHomeId: string }>();
  const [needs, setNeeds] = useState<NeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        if (!careHomeId) throw new Error('No care home ID provided');
        
        const data = await NeedsService.getAllNeeds(parseInt(careHomeId));
        setNeeds(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch needs');
      } finally {
        setLoading(false);
      }
    };

    fetchNeeds();
  }, [careHomeId]);

  if (loading) return <div className="text-center p-8">Loading needs...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="donor-needs" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <h1 className="text-4xl font-bold text-sky-400 mb-6 text-center">
            Care Home Needs
          </h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            {needs.length === 0 ? (
              <div className="text-center py-8">No needs found for this care home</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {needs.map((need) => (
                  <div key={need.id} className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold">{need.itemName}</h3>
                    <p className="text-gray-600">Category: {need.category}</p>
                    <p>
                      Quantity: {need.currentQuantity} / {need.requiredQuantity}
                    </p>
                    <p className={`inline-block px-2 py-1 rounded-full text-xs ${
                      need.urgencyLevel === 'High' ? 'bg-red-100 text-red-800' :
                      need.urgencyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {need.urgencyLevel}
                    </p>
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

export default DonorNeedsPage;