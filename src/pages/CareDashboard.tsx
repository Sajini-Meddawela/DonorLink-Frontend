import React from "react";
import Navbar from "../components/NavBarAuth";
import DashboardCard from "../components/DashboardCard";
import CareHomeDashboard from "../Assets/CareHomeDashboard.jpg";
import { Package, Gift, ClipboardList, Calendar } from "lucide-react";

interface DashboardItem {
  title: string;
  icon: keyof typeof iconMap;
  color: string;
  path: string;
}

const iconMap = {
  "Inventory Management": Package,
  "Donation Received": Gift,
  "Needs List": ClipboardList,
  "Donation Scheduling": Calendar,
};

const Dashboard: React.FC = () => {
  const dashboardItems: DashboardItem[] = [
    {
      title: "Inventory\nManagement",
      icon: "Inventory Management",
      color: "bg-[#8BC34A]/10",
      path: "/inventory",
    },
    {
      title: "Donation\nReceived",
      icon: "Donation Received",
      color: "bg-[#03A9F4]/10",
      path: "/donations/received",
    },
    {
      title: "Needs\nList",
      icon: "Needs List",
      color: "bg-[#03A9F4]/10",
      path: "/needs",
    },
    {
      title: "Donation\nScheduling",
      icon: "Donation Scheduling",
      color: "bg-[#03A9F4]/10",
      path: "/scheduling",
    },
  ];

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0">
        <img src={CareHomeDashboard} alt="background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/80" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main className="min-h-[calc(100vh-100px)] flex flex-col justify-center">
          <div className="max-w-full mx-auto w-full px-4 md:px-10">
            <h1 className="text-5xl font-semibold text-[#03A9F4] mb-16 text-center">
              Welcome Eden-bridge Owner!
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dashboardItems.map((item, index) => (
                <DashboardCard
                  key={index}
                  title={item.title}
                  icon={iconMap[item.icon]} // Pass the actual Lucide component
                  color={item.color}
                  onClick={() => (window.location.href = item.path)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
