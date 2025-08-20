import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MealDonationSlot, CareHome } from '../Types/types';
import Navbar from '../components/NavBarAuth';
import DonorSidebar from '../components/DonorSidebar';

const MealDonationPayment: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { slot, careHome } = location.state as { slot: MealDonationSlot; careHome: CareHome };
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'online') {
      navigate('/payment-gateway', {
        state: {
          slot,
          careHome,
          paymentMethod
        }
      });
    } else {
      navigate('/meal-donation-receipt', {
        state: {
          donation: {
            type: 'meal',
            slot,
            careHome,
            paymentMethod,
            paymentStatus: paymentMethod === 'cash' ? 'pending' : 'scheduled',
            status: 'booked', 
            date: new Date(),
            donor: user
          }
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="meal-donation" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-[#63C6F7] mb-6">Complete Your Meal Donation</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Donation Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Care Home</p>
                  <p className="font-semibold">{careHome.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-semibold">{new Date(slot.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Meal Type</p>
                  <p className="font-semibold">{slot.mealType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-semibold text-[#85C536]">{slot.status}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
              
              <div className="space-y-4 mb-6">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="h-5 w-5 text-[#63C6F7] mr-3"
                  />
                  <div>
                    <p className="font-medium">Online Payment</p>
                    <p className="text-gray-600 text-sm">Pay securely with credit/debit card</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="physical"
                    checked={paymentMethod === 'physical'}
                    onChange={() => setPaymentMethod('physical')}
                    className="h-5 w-5 text-[#63C6F7] mr-3"
                  />
                  <div>
                    <p className="font-medium">Physical Donation</p>
                    <p className="text-gray-600 text-sm">Bring the meal ingredients to the care home</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="h-5 w-5 text-[#63C6F7] mr-3"
                  />
                  <div>
                    <p className="font-medium">Cash Donation</p>
                    <p className="text-gray-600 text-sm">Donate cash at the care home</p>
                  </div>
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/meal-scheduling')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!paymentMethod}
                  className="px-6 py-2 bg-[#63C6F7] text-white rounded-lg hover:bg-[#52b0e0] disabled:opacity-50"
                >
                  {paymentMethod === 'online' ? 'Proceed to Payment' : 'Complete Donation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDonationPayment;