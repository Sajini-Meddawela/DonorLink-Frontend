import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/NavBarAuth";
import DashboardCard from "../components/DashboardCard";
import DonorDashboardBg from "../Assets/CareHomeDashboard.png";
import {
  Home,
  Gift,
  AlertCircle,
  Calendar,
  LucideIcon,
  Heart,
} from "lucide-react";

interface DashboardItem {
  title: string;
  icon: LucideIcon;
  color: string;
  path: string;
}

const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const dashboardItems: DashboardItem[] = [
    {
      title: "Select\nCareHome",
      icon: Home,
      color: "bg-[#85C536] hover:bg-[#85C536]/90",
      path: "/select-carehome",
    },
    {
      title: "Donation\nMade",
      icon: Gift,
      color: "bg-[#63C6F7] hover:bg-[#63C6F7]/90",
      path: "/donations/made",
    },
    {
      title: "Urgent\nNeeds",
      icon: AlertCircle,
      color: "bg-[#63C6F7] hover:bg-[#63C6F7]/90",
      path: "/urgent-needs",
    },
    {
      title: "Meal\nScheduling",
      icon: Calendar,
      color: "bg-[#63C6F7] hover:bg-[#63C6F7]/90",
      path: "/meal-scheduling",
    },
  ];

  const quickTips = [
    "Check urgent needs first to make the biggest impact",
    "Schedule meals in advance to help with planning",
    "Consider recurring donations for consistent support",
    "Contact care homes directly for specific item requests",
    "Spread the word to encourage others to donate",
  ];

  return (
    <div className="min-h-screen relative bg-gray-50">
      {/* Background with overlay */}
      <div className="fixed inset-0 z-0">
        <img
          src={DonorDashboardBg}
          alt="Donor Dashboard Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/70" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main className="min-h-[calc(100vh-80px)] pt-28 pb-12">
          {" "}
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-[#63C6F7] mb-4">
                Welcome {user?.name || "Care Home Manager"}!
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Make a difference today by supporting care homes in need
              </p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {dashboardItems.map((item, index) => (
                <DashboardCard
                  key={index}
                  title={item.title}
                  icon={item.icon}
                  color={item.color}
                  onClick={() => (window.location.href = item.path)}
                />
              ))}
            </div>

            {/* Quick Tips Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-[#85C536] mr-2" />
                <h2 className="text-2xl font-semibold text-[#63C6F7]">
                  Donation Tips
                </h2>
              </div>
              <ul className="space-y-3 max-w-2xl mx-auto">
                {quickTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-[#85C536] mr-2 mt-0.5">
                      •
                    </span>
                    <p className="text-gray-700">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DonorDashboard;
