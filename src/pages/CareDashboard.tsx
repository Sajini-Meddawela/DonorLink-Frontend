import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/NavBarAuth";
import DashboardCard from "../components/DashboardCard";
import CareHomeDashboardBg from "../Assets/CareHomeDashboard.png";
import {
  Package,
  Gift,
  ClipboardList,
  Calendar,
  LucideIcon,
  Lightbulb,
} from "lucide-react";

interface DashboardItem {
  title: string;
  icon: LucideIcon;
  color: string;
  path: string;
}

const CareHomeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const dashboardItems: DashboardItem[] = [
    {
      title: "Inventory\nManagement",
      icon: Package,
      color: "bg-[#85C536] hover:bg-[#85C536]/90",
      path: "/inventory",
    },
    {
      title: "Donation\nReceived",
      icon: Gift,
      color: "bg-[#63C6F7] hover:bg-[#63C6F7]/90",
      path: "/donations/received",
    },
    {
      title: "Needs\nList",
      icon: ClipboardList,
      color: "bg-[#63C6F7] hover:bg-[#63C6F7]/90",
      path: "/needs",
    },
    {
      title: "Meal\nScheduling",
      icon: Calendar,
      color: "bg-[#63C6F7] hover:bg-[#63C6F7]/90",
      path: "/scheduling",
    },
  ];

  const quickTips = [
    "Update your needs list regularly to get more donations",
    "Mark donations as received when items arrive",
    "Schedule meals at least 3 days in advance",
    "Set urgent priority for time-sensitive needs",
    "Keep your inventory updated for better planning",
  ];

  return (
    <div className="min-h-screen relative bg-gray-50">
      <div className="fixed inset-0 z-0">
        <img
          src={CareHomeDashboardBg}
          alt="Care Home Dashboard Background"
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
                Manage your care home's needs and donations in one place
              </p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {" "}
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
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
              {" "}
              <div className="flex items-center justify-center mb-6">
                {" "}
                <Lightbulb className="h-6 w-6 text-[#85C536] mr-2" />
                <h2 className="text-2xl font-semibold text-[#63C6F7]">
                  Quick Tips
                </h2>
              </div>
              <ul className="space-y-4 max-w-2xl mx-auto">
                {" "}
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

export default CareHomeDashboard;
