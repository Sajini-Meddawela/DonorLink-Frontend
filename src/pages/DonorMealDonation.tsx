import React from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBarAuth";
import MealCalendar from "../components/MealCalendar";

const DonorMealDonation: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar activePage="donation" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <h1 className="text-4xl font-bold text-sky-400 mb-6 text-center">
            Donate a Meal
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            <MealCalendar isDonorView />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorMealDonation;
