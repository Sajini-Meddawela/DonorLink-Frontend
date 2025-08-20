import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MealDonationService } from '../services/api';
import MealCalendar from '../components/MealCalendar';
import Navbar from '../components/NavBarAuth';
import CareHomeSidebar from '../components/SideBar';
import { CalendarDay } from '../Types/types';

const CareHomeMealSchedule: React.FC = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, [currentMonth, user]);

  const fetchSlots = async () => {
    if (!user) return;

    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    try {
      const slots = await MealDonationService.getSlots(user.id, startDate, endDate);
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

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleMealToggle = (mealType: string) => {
    setSelectedMeals(prev => 
      prev.includes(mealType) 
        ? prev.filter(m => m !== mealType)
        : [...prev, mealType]
    );
  };

  const handleCreateSlots = async () => {
    if (!selectedDate || !user || selectedMeals.length === 0) return;

    setLoading(true);
    try {
      await MealDonationService.createSlots(user.id, selectedDate, selectedMeals);
      setSelectedDate(null);
      setSelectedMeals([]);
      fetchSlots();
    } catch (error) {
      console.error('Error creating slots:', error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <CareHomeSidebar activePage="meal-scheduling" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#63C6F7]">Meal Scheduling</h1>
            <p className="text-gray-600">Manage available meal donation slots for donors</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
              isCareHome={true}
              onDayClick={handleDayClick}
            />
          </div>

          {selectedDate && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                Create Slots for {selectedDate.toLocaleDateString()}
              </h3>
              <div className="flex space-x-4 mb-4">
                {['Breakfast', 'Lunch', 'Dinner'].map(mealType => (
                  <label key={mealType} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedMeals.includes(mealType)}
                      onChange={() => handleMealToggle(mealType)}
                      className="mr-2 h-5 w-5 text-[#63C6F7]"
                    />
                    {mealType}
                  </label>
                ))}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleCreateSlots}
                  disabled={loading || selectedMeals.length === 0}
                  className="px-6 py-2 bg-[#63C6F7] text-white rounded-lg hover:bg-[#52b0e0] disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Slots'}
                </button>
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedMeals([]);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareHomeMealSchedule;