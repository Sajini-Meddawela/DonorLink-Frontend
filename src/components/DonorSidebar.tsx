import React from "react";
import { Home, Gift, AlertCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  to: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, isActive, to }) => {
  return (
    <Link to={to} className="block">
      <div
        className={`flex items-center p-4 hover:bg-blue-100 transition-all 
        ${isActive ? "bg-sky-200 font-semibold" : "bg-white"}`}
      >
        <div className="mr-3 text-gray-700">{icon}</div>
        <span className="text-sm font-medium">{text}</span>
      </div>
    </Link>
  );
};

interface DonorSidebarProps {
  activePage: string;
}

const DonorSidebar: React.FC<DonorSidebarProps> = ({ activePage }) => {
  const donorMenuItems = [
    { id: "select-carehome", text: "Select Carehome", icon: <Home size={20} />, to: "/select-carehome" },
    { id: "donation-made", text: "Donation Made", icon: <Gift size={20} />, to: "/donation-made" },
    { id: "urgent-needs", text: "Urgent Needs", icon: <AlertCircle size={20} />, to: "/urgent-needs" },
    { id: "meal-scheduling", text: "Meal Scheduling", icon: <Calendar size={20} />, to: "/meal-scheduling" },
  ];

  return (
    <div className="w-56 bg-white border-r h-full fixed top-0 left-0 pt-20">
      {donorMenuItems.map((item) => (
        <SidebarItem
          key={item.id}
          icon={item.icon}
          text={item.text}
          isActive={activePage === item.id}
          to={item.to}
        />
      ))}
    </div>
  );
};

export default DonorSidebar;