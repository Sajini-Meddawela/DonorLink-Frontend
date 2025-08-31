import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MealDonationSlot, CareHome } from "../Types/types";
import Navbar from "../components/NavBarAuth";
import DonorSidebar from "../components/DonorSidebar";
import { MealDonationService } from "../services/api";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51S1tA53FWL3CZaPRPDeHvI3IMyqgQQyXMa3vqFtKXdLY94Z4yhZgGBGKca08IuBbNfWpE1mNgDWDPnSADsDjByWb00E2CR17OC"
);

const PaymentForm: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { slot, careHome, paymentMethod } = location.state as {
    slot: MealDonationSlot;
    careHome: CareHome;
    paymentMethod: string;
  };

  const [processing, setProcessing] = useState(false);
  const [reservationExpired, setReservationExpired] = useState(false);
  const [remainingTime, setRemainingTime] = useState(15 * 60);
  const [clientSecret, setClientSecret] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");

  const stripe = useStripe();
  const elements = useElements();

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

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 500000, 
            currency: "lkr",
            metadata: {
              slotId: slot.id,
              careHomeId: careHome.id,
              userId: user?.id,
            },
          }),
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        toast.error("Failed to initialize payment. Please try again.");
      }
    };

    createPaymentIntent();
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: nameOnCard,
            },
          },
        }
      );

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          toast.error(`Payment failed: ${error.message}`);
        } else {
          toast.error("An unexpected error occurred.");
        }
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await MealDonationService.confirmSlot(slot.id!);

        toast.success("Payment successful! Your donation has been confirmed.");

        navigate("/meal-donation-receipt", {
          state: {
            donation: {
              type: "meal",
              slot,
              careHome,
              paymentMethod: "online",
              paymentStatus: "completed",
              status: "booked",
              date: new Date(),
              donor: user,
              transactionId: paymentIntent.id,
            },
          },
        });
      } else if (paymentIntent.status === "requires_action") {
        const { error: confirmError } = await stripe.confirmCardPayment(
          clientSecret
        );

        if (confirmError) {
          toast.error(`Authentication failed: ${confirmError.message}`);
          setProcessing(false);
        } else {
          await MealDonationService.confirmSlot(slot.id!);
          toast.success(
            "Payment successful! Your donation has been confirmed."
          );

          navigate("/meal-donation-receipt", {
            state: {
              donation: {
                type: "meal",
                slot,
                careHome,
                paymentMethod: "online",
                paymentStatus: "completed",
                status: "booked",
                date: new Date(),
                donor: user,
                transactionId: paymentIntent.id,
              },
            },
          });
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!paymentIntentId || !stripe) return;

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payment-intent/${paymentIntentId}`);
        const { paymentIntent } = await response.json();

        if (paymentIntent.status === "succeeded") {
          await MealDonationService.confirmSlot(slot.id!);
          toast.success(
            "Payment successful! Your donation has been confirmed."
          );

          navigate("/meal-donation-receipt", {
            state: {
              donation: {
                type: "meal",
                slot,
                careHome,
                paymentMethod: "online",
                paymentStatus: "completed",
                status: "booked",
                date: new Date(),
                donor: user,
                transactionId: paymentIntent.id,
              },
            },
          });
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    const interval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(interval);
  }, [paymentIntentId, stripe]);

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
              Complete Payment
            </h1>

            {/* Reservation Timer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-yellow-800">
                    Reservation Timer
                  </h3>
                  <p className="text-sm text-yellow-600">
                    Complete your payment before the timer expires to secure
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
                  <p className="text-gray-600">Amount</p>
                  <p className="font-semibold">Rs.5000</p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold mb-4">
                Payment Information
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Details
                  </label>
                  <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#63C6F7] focus-within:border-transparent">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#424770",
                            "::placeholder": {
                              color: "#aab7c4",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Security badge */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure payment encrypted with SSL</span>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/meal-donation-payment")}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!stripe || !clientSecret || processing}
                  className="px-6 py-2 bg-[#63C6F7] text-white rounded-lg hover:bg-[#52b0e0] disabled:opacity-50 flex items-center justify-center"
                >
                  {processing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Pay Rs.5000`
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

const PaymentGateway: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default PaymentGateway;