import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { MealDonationService } from "../services/api";
import MealCalendar from "../components/MealCalendar";
import Navbar from "../components/NavBarAuth";
import CareHomeSidebar from "../components/SideBar";
import { CalendarDay, MealDonationSlot } from "../Types/types";
import { toast } from "react-toastify";

const CareHomeMealSchedule: React.FC = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [existingSlots, setExistingSlots] = useState<MealDonationSlot[]>([]);

  useEffect(() => {
    fetchSlots();
  }, [currentMonth, user]);

  const fetchSlots = async () => {
    if (!user) return;

    const startDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const endDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    try {
      const slots = await MealDonationService.getSlots(
        user.id,
        startDate,
        endDate
      );
      processSlots(slots);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const processSlots = (slots: any[]) => {
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const processedDays: CalendarDay[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i
      );
      const daySlots = slots.filter(
        (slot: any) => new Date(slot.date).getDate() === i
      );

      processedDays.push({
        date,
        breakfast: daySlots.find((slot: any) => slot.mealType === "Breakfast"),
        lunch: daySlots.find((slot: any) => slot.mealType === "Lunch"),
        dinner: daySlots.find((slot: any) => slot.mealType === "Dinner"),
      });
    }

    setDays(processedDays);
  };

  const handleDayClick = async (date: Date) => {
    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      toast.error("Cannot create slots for past dates");
      return;
    }
    
    setSelectedDate(date);
    
    // Fetch existing slots for this date
    if (user) {
      try {
        const slots = await MealDonationService.getSlots(
          user.id,
          date,
          date
        );
        setExistingSlots(slots);
      } catch (error) {
        console.error("Error fetching existing slots:", error);
      }
    }
  };

  const handleMealToggle = (mealType: string) => {
    // Check if slot already exists for this meal type
    const alreadyExists = existingSlots.some(slot => slot.mealType === mealType);
    
    if (alreadyExists) {
      toast.error(`A ${mealType} slot already exists for this date`);
      return;
    }
    
    setSelectedMeals((prev) =>
      prev.includes(mealType)
        ? prev.filter((m) => m !== mealType)
        : [...prev, mealType]
    );
  };

  const handleCreateSlots = async () => {
    if (!selectedDate || !user || selectedMeals.length === 0) return;

    setLoading(true);
    try {
      await MealDonationService.createSlots(
        user.id,
        selectedDate,
        selectedMeals
      );
      toast.success("Made Available slots successfully!");
      setSelectedDate(null);
      setSelectedMeals([]);
      setExistingSlots([]);
      fetchSlots();
    } catch (error: any) {
      console.error("Error creating slots:", error);
      
      if (error.response?.data?.error === "Cannot create slots for past dates") {
        toast.error("Cannot create slots for past dates");
      } else if (error.response?.data?.error === "Slots already exist for some meal types") {
        toast.error(`Some slots already exist: ${error.response.data.existingMealTypes.join(', ')}`);
      } else {
        toast.error("Failed to create the slot");
      }
    }
    setLoading(false);
  };

  const handleDeleteSlot = async (slotId: number) => {
    try {
      await MealDonationService.deleteSlot(slotId);
      toast.success("Slot deleted successfully!");
      
      // Update existing slots list
      setExistingSlots(existingSlots.filter(slot => slot.id !== slotId));
      
      // Refresh calendar
      fetchSlots();
    } catch (error: any) {
      console.error("Error deleting slot:", error);
      
      if (error.response?.data?.error === "Cannot delete a slot that is not available") {
        toast.error("Cannot delete a slot that is already booked or completed");
      } else {
        toast.error("Failed to delete the slot");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <CareHomeSidebar activePage="meal-scheduling" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#63C6F7]">
              Meal Scheduling
            </h1>
            <p className="text-gray-600">
              Manage available meal donation slots for donors
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1
                      )
                    )
                  }
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
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1
                      )
                    )
                  }
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
              
              {/* Existing slots section */}
              {existingSlots.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Existing Slots:</h4>
                  <div className="space-y-2">
                    {existingSlots.map(slot => (
                      <div key={slot.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="capitalize">{slot.mealType}: {slot.status}</span>
                        {slot.status === 'Available' && (
                          <button
                            onClick={() => handleDeleteSlot(slot.id!)}
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-4 mb-4">
                {["Breakfast", "Lunch", "Dinner"].map((mealType) => {
                  const alreadyExists = existingSlots.some(slot => slot.mealType === mealType);
                  return (
                    <label key={mealType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedMeals.includes(mealType)}
                        onChange={() => handleMealToggle(mealType)}
                        disabled={alreadyExists}
                        className="mr-2 h-5 w-5 text-[#63C6F7] disabled:opacity-50"
                      />
                      <span className={alreadyExists ? "text-gray-400" : ""}>
                        {mealType}
                        {alreadyExists && " (Already exists)"}
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleCreateSlots}
                  disabled={loading || selectedMeals.length === 0}
                  className="px-6 py-2 bg-[#63C6F7] text-white rounded-lg hover:bg-[#52b0e0] disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Slots"}
                </button>
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedMeals([]);
                    setExistingSlots([]);
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