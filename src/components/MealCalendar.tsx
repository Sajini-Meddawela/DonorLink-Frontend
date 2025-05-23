import React, { useState, useEffect } from "react";
import {
  format,
  addMonths,
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import Button from "./Button";
import { MealDonationService } from "../services/api";
import { CalendarDay } from "../Types/types";

interface MealCalendarProps {
  careHomeId?: number;
  isDonorView?: boolean;
  donorId?: number;
}

const MealCalendar: React.FC<MealCalendarProps> = ({
  careHomeId,
  isDonorView = false,
  donorId,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const startDate = startOfMonth(currentMonth);
        const endDate = endOfMonth(currentMonth);

        const slots = await MealDonationService.getSlots(
          careHomeId || 1,
          startDate,
          endDate
        );

        const parsedSlots = slots.map((slot) => ({
          ...slot,
          date: new Date(slot.date),
        }));

        // Group slots by date
        const slotsByDate = slots.reduce(
          (acc: { [key: string]: CalendarDay }, slot) => {
            const dateStr = format(slot.date, "yyyy-MM-dd");
            if (!acc[dateStr]) {
              acc[dateStr] = {
                date: slot.date,
                breakfast: undefined,
                lunch: undefined,
                dinner: undefined,
              };
            }
            acc[dateStr][slot.mealType.toLowerCase()] = slot;
            return acc;
          },
          {}
        );

        // Create all days for the month
        const allDays = eachDayOfInterval({
          start: startDate,
          end: endDate,
        }).map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          return slotsByDate[dateStr] || { date };
        });

        setDays(allDays);
      } catch (error) {
        console.error("Error fetching meal slots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [currentMonth, careHomeId]);

  const handlePrevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleBookSlot = async (slot: any) => {
    if (!donorId) {
      alert("Please select a donor account first");
      return;
    }

    try {
      await MealDonationService.bookSlot(slot.id, donorId);
      const updatedDays = days.map((day) => {
        if (isSameDay(day.date, slot.date)) {
          return {
            ...day,
            [slot.mealType.toLowerCase()]: { ...slot, status: "Booked" },
          };
        }
        return day;
      });
      setDays(updatedDays);
    } catch (error) {
      alert("Slot booking failed - may be already booked");
    }
  };

  const handleCreateSlots = async (date: Date, mealTypes: string[]) => {
    try {
      await MealDonationService.createSlots(careHomeId || 1, date, mealTypes);
      // Refresh the calendar data
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);
      const slots = await MealDonationService.getSlots(
        careHomeId || 1,
        startDate,
        endDate
      );
      const updatedDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
      }).map((date) => {
        const existingDay = slots.find((day) => isSameDay(day.date, date));
        return (
          existingDay || {
            date,
            breakfast: undefined,
            lunch: undefined,
            dinner: undefined,
          }
        );
      });
      setDays(updatedDays);
    } catch (error) {
      console.error("Error creating slots:", error);
    }
  };

  // Get the starting day of the week (0 = Sunday)
  const startDay = startOfMonth(currentMonth).getDay();

  // Create empty cells for days before the first day of the month
  const emptyStartDays = Array(startDay).fill(null);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex space-x-2">
          <Button
            text="Previous"
            onClick={handlePrevMonth}
            variant="secondary"
          />
          <Button text="Next" onClick={handleNextMonth} variant="secondary" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-medium py-2 border-b">
              {day}
            </div>
          ))}

          {/* Calendar cells */}
          {days.map((day, index) => {
            const isCurrentMonth = isSameMonth(day.date, currentMonth);
            const mealSlots = {
              breakfast: day.breakfast,
              lunch: day.lunch,
              dinner: day.dinner,
            };

            return (
              <div
                key={index}
                className={`min-h-24 p-1 border ${
                  !isCurrentMonth
                    ? "bg-gray-50 text-gray-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="text-right text-sm font-medium mb-1">
                  {format(day.date, "d")}
                </div>

                {isCurrentMonth && (
                  <div className="space-y-1">
                    {Object.entries(mealSlots).map(([mealType, slot]) => {
                      const isBooked = slot?.status === "Booked";
                      const isAvailable = slot?.status === "Available";

                      return (
                        <div
                          key={mealType}
                          className={`text-xs p-1 rounded text-center ${
                            isBooked
                              ? "bg-green-100 text-green-800"
                              : isAvailable
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <div className="font-medium">
                            {mealType.charAt(0).toUpperCase() +
                              mealType.slice(1)}
                          </div>
                          <div className="mt-1">
                            {isDonorView ? (
                              slot ? (
                                isAvailable ? (
                                  <button
                                    onClick={() => handleBookSlot(slot)}
                                    className="text-xs underline hover:text-blue-600"
                                  >
                                    Book Now
                                  </button>
                                ) : (
                                  <span className="text-xs">Booked</span>
                                )
                              ) : null
                            ) : (
                              <button
                                onClick={() =>
                                  handleCreateSlots(day.date, [mealType])
                                }
                                className="text-xs underline hover:text-blue-600"
                              >
                                {slot ? "Update" : "Add"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MealCalendar;
