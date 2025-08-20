import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MealDonationService, CareHomeService } from '../services/api';
import MealCalendar from '../components/MealCalendar';
import Navbar from '../components/NavBarAuth';
import DonorSidebar from '../components/DonorSidebar';
import { CareHome, CalendarDay } from '../Types/types';

const DonorMealDonation: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [careHomes, setCareHomes] = useState<CareHome[]>([]);
  const [selectedCareHome, setSelectedCareHome] = useState<CareHome | null>(
    location.state?.careHome || null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCareHomes();
  }, []);

  useEffect(() => {
    if (selectedCareHome) {
      fetchSlots();
    }
  }, [selectedCareHome, currentMonth]);

  const fetchCareHomes = async () => {
    try {
      const response = await CareHomeService.getCareHomes({});
      if (Array.isArray(response)) {
        setCareHomes(response);
      } else if (response && Array.isArray(response.data)) {
        setCareHomes(response.data);
      } else if (response && response.data && Array.isArray(response.data.data)) {
        setCareHomes(response.data.data);
      } else {
        console.error('Unexpected response format:', response);
        setCareHomes([]);
      }
    } catch (error) {
      console.error('Error fetching care homes:', error);
      setCareHomes([]);
    }
  };

  const fetchSlots = async () => {
    if (!selectedCareHome) return;

    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    try {
      const slots = await MealDonationService.getSlots(selectedCareHome.id, startDate, endDate);
      processSlots(slots);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const processSlots = (slots: any[]) => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const processedDays: CalendarDay[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const daySlots = slots.filter((slot: any) => 
        new Date(slot.date).getDate() === i
      );

      processedDays.push({
        date,
        breakfast: daySlots.find((slot: any) => slot.mealType === 'Breakfast'),
        lunch: daySlots.find((slot: any) => slot.mealType === 'Lunch'),
        dinner: daySlots.find((slot: any) => slot.mealType === 'Dinner')
      });
    }

    setDays(processedDays);
  };

  const handleSlotClick = async (slot: any) => {
    if (!user) return;

    try {
      const bookedSlot = await MealDonationService.bookSlot(slot.id, user.id);
      navigate('/meal-donation-payment', { 
        state: { 
          slot: bookedSlot,
          careHome: selectedCareHome 
        } 
      });
    } catch (error) {
      console.error('Error booking slot:', error);
      alert('This slot is no longer available. Please try another one.');
      fetchSlots();
    }
  };

  const careHomeOptions = Array.isArray(careHomes) ? careHomes : [];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="meal-donation" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#63C6F7]">Meal Donation</h1>
            <p className="text-gray-600">Book available meal slots to support care homes</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Care Home</h2>
            <select
              value={selectedCareHome?.id || ''}
              onChange={(e) => {
                const selectedId = parseInt(e.target.value);
                const home = careHomeOptions.find(home => home.id === selectedId);
                setSelectedCareHome(home || null);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent"
            >
              <option value="">Select a care home</option>
              {careHomeOptions.map(home => (
                <option key={home.id} value={home.id}>
                  {home.name} - {home.address}
                </option>
              ))}
            </select>
          </div>

          {selectedCareHome && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Available Slots for {selectedCareHome.name}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="px-4 py-2 border border-[#63C6F7] rounded-lg text-[#63C6F7] hover:bg-[#63C6F7] hover:text-white"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date())}
                    className="px-4 py-2 border border-[#63C6F7] rounded-lg text-[#63C6F7] hover:bg-[#63C6F7] hover:text-white"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="px-4 py-2 border border-[#63C6F7] rounded-lg text-[#63C6F7] hover:bg-[#63C6F7] hover:text-white"
                  >
                    Next
                  </button>
                </div>
              </div>

              <MealCalendar
                month={currentMonth}
                days={days}
                onSlotClick={handleSlotClick}
              />

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Legend:</h3>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 border border-[#85C536] mr-2"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 mr-2"></div>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-100 border border-[#63C6F7] mr-2"></div>
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorMealDonation;