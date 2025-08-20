import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MealDonationSlot, CareHome } from '../Types/types';
import Navbar from '../components/NavBarAuth';
import DonorSidebar from '../components/DonorSidebar';

interface PaymentData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const PaymentGateway: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { slot, careHome, paymentMethod } = location.state as { 
    slot: MealDonationSlot; 
    careHome: CareHome;
    paymentMethod: string;
  };

  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
      setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    if (name === 'cvv') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 4);
      setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      
      navigate('/donation-receipt', {
        state: {
          donation: {
            type: 'meal',
            slot,
            careHome,
            paymentMethod: 'online',
            paymentStatus: 'completed',
            date: new Date(),
            donor: user,
            paymentData 
          }
        }
      });
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      paymentData.cardNumber.replace(/\s/g, '').length === 16 &&
      paymentData.cardHolder.trim().length > 0 &&
      paymentData.expiryDate.length === 5 &&
      paymentData.cvv.length >= 3
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="meal-donation" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-[#63C6F7] mb-6">Payment Gateway</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Donation Summary</h2>
              <div className="grid grid-cols-2 gap-4">
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
                  <p className="text-gray-600">Amount</p>
                  <p className="font-semibold text-[#85C536]">LKR 2,500.00</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Card Details</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent"
                    maxLength={19}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={paymentData.cardHolder}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent"
                      maxLength={5}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-[#63C6F7] mb-2">Security Notice</h3>
                <p className="text-sm text-gray-600">
                  Your payment information is encrypted and secure. We use industry-standard 
                  SSL encryption to protect your data.
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/meal-donation-payment')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid() || loading}
                  className="px-6 py-2 bg-[#63C6F7] text-white rounded-lg hover:bg-[#52b0e0] disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Pay Now - LKR 2,500.00'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;