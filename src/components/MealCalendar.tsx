import React from "react";
import { CalendarDay, MealDonationSlot } from "../Types/types";

interface MealCalendarProps {
  month: Date;
  days: CalendarDay[];
  onSlotClick?: (slot: MealDonationSlot) => void;
  isCareHome?: boolean;
  onDayClick?: (date: Date) => void;
}

const MealCalendar: React.FC<MealCalendarProps> = ({
  month,
  days,
  onSlotClick,
  isCareHome = false,
  onDayClick,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 border border-[#85C536] text-[#85C536]";
      case "Reserved":
        return "bg-yellow-100 border border-yellow-400 text-yellow-700";
      case "Booked":
        return "bg-gray-100 border border-gray-300 text-gray-400";
      case "Completed":
        return "bg-blue-100 border border-[#63C6F7] text-[#63C6F7]";
      case "Cancelled":
        return "bg-red-100 border border-red-300 text-red-600";
      default:
        return "bg-gray-100 border border-gray-300";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { day: "numeric" });
  };

  // Check if a date is in the past
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}

        {days.map((day) => {
          const isPast = isPastDate(day.date);
          return (
            <div
              key={day.date.toISOString()}
              className={`border rounded-lg p-2 min-h-24 ${
                isPast
                  ? "bg-gray-50 cursor-not-allowed"
                  : onDayClick
                  ? "cursor-pointer hover:bg-gray-50"
                  : ""
              }`}
              onClick={() => !isPast && onDayClick && onDayClick(day.date)}
            >
              <div className="text-sm font-medium mb-2">
                {formatDate(day.date)}
                {isPast && (
                  <span className="text-xs text-gray-400 ml-1">(Past)</span>
                )}
              </div>

              <div className="space-y-1">
                {["Breakfast", "Lunch", "Dinner"].map((mealType) => {
                  const slot = day[
                    mealType.toLowerCase() as keyof CalendarDay
                  ] as MealDonationSlot | undefined;
                  const isPast = isPastDate(day.date);

                  return (
                    <div
                      key={mealType}
                      className={`text-xs p-1 rounded text-center ${getStatusColor(
                        slot?.status || "Not Available"
                      )} ${
                        slot &&
                        slot.status === "Available" &&
                        onSlotClick &&
                        !isPast
                          ? "cursor-pointer hover:opacity-80"
                          : "cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (
                          slot &&
                          slot.status === "Available" &&
                          onSlotClick &&
                          !isPast
                        ) {
                          onSlotClick(slot);
                        }
                      }}
                    >
                      {mealType}: {slot ? slot.status : "Not Available"}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealCalendar;
