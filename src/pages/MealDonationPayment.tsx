import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MealDonationSlot, CareHome } from "../Types/types";
import Navbar from "../components/NavBarAuth";
import DonorSidebar from "../components/DonorSidebar";
import { MealDonationService } from "../services/api";

const MealDonationPayment: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { slot, careHome } = location.state as {
    slot: MealDonationSlot;
    careHome: CareHome;
  };
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [reservationExpired, setReservationExpired] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(15 * 60); 

  useEffect(() => {
    const checkReservation = async () => {
      try {
        const currentSlot = await MealDonationService.getSlotById(slot.id!);

        if (
          currentSlot.status !== "Reserved" ||
          currentSlot.donorId !== user?.id
        ) {
          setReservationExpired(true);
          toast.error(
            "Your reservation has expired. Please select another slot."
          );
        }
      } catch (error) {
        console.error("Error checking reservation:", error);
      }
    };

    checkReservation();
    const interval = setInterval(checkReservation, 60000);

    return () => clearInterval(interval);
  }, [slot.id, user?.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setReservationExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      await MealDonationService.confirmSlot(slot.id!);

      if (paymentMethod === "online") {
        navigate("/payment-gateway", {
          state: {
            slot,
            careHome,
            paymentMethod,
          },
        });
      } else {
        navigate("/meal-donation-receipt", {
          state: {
            donation: {
              type: "meal",
              slot,
              careHome,
              paymentMethod,
              paymentStatus: paymentMethod === "cash" ? "pending" : "scheduled",
              status: "booked",
              date: new Date(),
              donor: user,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error confirming slot:", error);
      toast.error("Failed to confirm your donation. Please try again.");
    }
  };

  if (reservationExpired) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-1 overflow-hidden pt-20">
          <DonorSidebar activePage="meal-donation" />
          <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-[#63C6F7] mb-6">
                Reservation Expired
              </h1>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-lg mb-4">
                  Your reservation has expired. Please return to the meal
                  donation page and select another slot.
                </p>
                <button
                  onClick={() => navigate("/meal-donation")}
                  className="px-6 py-2 bg-[#63C6F7] text-white rounded-lg hover:bg-[#52b0e0]"
                >
                  Return to Meal Donation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <DonorSidebar activePage="meal-donation" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-[#63C6F7] mb-6">
              Complete Your Meal Donation
            </h1>

            {/* Reservation Timer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-yellow-800">
                    Reservation Timer
                  </h3>
                  <p className="text-sm text-yellow-600">
                    Complete your donation before the timer expires to secure
                    this slot
                  </p>
                </div>
                <div className="text-2xl font-bold text-yellow-700">
                  {formatTime(remainingTime)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Donation Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Care Home</p>
                  <p className="font-semibold">{careHome.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-semibold">
                    {new Date(slot.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Meal Type</p>
                  <p className="font-semibold">{slot.mealType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-semibold text-yellow-600">Reserved</p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold mb-4">
                Select Payment Method
              </h2>

              <div className="space-y-4 mb-6">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="h-5 w-5 text-[#63C6F7] mr-3"
                  />
                  <div>
                    <p className="font-medium">Online Payment</p>
                    <p className="text-gray-600 text-sm">
                      Pay securely with credit/debit card
                    </p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="physical"
                    checked={paymentMethod === "physical"}
                    onChange={() => setPaymentMethod("physical")}
                    className="h-5 w-5 text-[#63C6F7] mr-3"
                  />
                  <div>
                    <p className="font-medium">Physical Donation</p>
                    <p className="text-gray-600 text-sm">
                      Bring the meal ingredients to the care home
                    </p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    className="h-5 w-5 text-[#63C6F7] mr-3"
                  />
                  <div>
                    <p className="font-medium">Cash Donation</p>
                    <p className="text-gray-600 text-sm">
                      Donate cash at the care home
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/meal-donation")}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!paymentMethod}
                  className="px-6 py-2 bg-[#63C6F7] text-white rounded-lg hover:bg-[#52b0e0] disabled:opacity-50"
                >
                  {paymentMethod === "online"
                    ? "Proceed to Payment"
                    : "Complete Donation"}
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
