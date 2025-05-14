import React from "react";
import { User, ClipboardList, Gift, Calendar } from "lucide-react";
import { Link } from "react-router-dom"; 

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  to: string; 
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, isActive, to }) => {
  return (
    <Link to={to} className="block"> {/* Changed to Link */}
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

interface SidebarProps {
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const menuItems = [
    { id: "dashboard", text: "Dashboard", icon: <User size={20} />, to: "/care_dashboard" },
    { id: "inventory", text: "Inventory Management", icon: <ClipboardList size={20} />, to: "/inventory" },
    { id: "need-list", text: "Need List", icon: <ClipboardList size={20} />, to: "/needs" },
    { id: "donation", text: "Donation Received", icon: <Gift size={20} />, to: "/donations" },
    { id: "scheduling", text: "Scheduling", icon: <Calendar size={20} />, to: "/scheduling" },
  ];

  return (
    <div className="w-56 bg-white border-r h-full fixed top-0 left-0 pt-20">
      {menuItems.map((item) => (
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

export default Sidebar;