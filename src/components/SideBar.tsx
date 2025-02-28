import React from "react";
import { User, ClipboardList, Gift, Calendar } from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, isActive, onClick }) => {
  return (
    <div
      className={`flex items-center p-4 cursor-pointer hover:bg-blue-100 transition-all 
      ${isActive ? "bg-sky-200 font-semibold" : "bg-white"} `}
      onClick={onClick}
    >
      <div className="mr-3 text-gray-700">{icon}</div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const menuItems = [
    { id: "dashboard", text: "Dashboard", icon: <User size={20} /> },
    { id: "inventory", text: "Inventory Management", icon: <ClipboardList size={20} /> },
    { id: "need-list", text: "Need List", icon: <ClipboardList size={20} /> },
    { id: "donation", text: "Donation Received", icon: <Gift size={20} /> },
    { id: "scheduling", text: "Scheduling", icon: <Calendar size={20} /> },
  ];

  return (
    <div className="w-56 bg-white border-r h-full fixed top-0 left-0 pt-20">
      {menuItems.map((item) => (
        <SidebarItem
          key={item.id}
          icon={item.icon}
          text={item.text}
          isActive={activePage === item.id}
          onClick={() => onPageChange(item.id)}
        />
      ))}
    </div>
  );
};

export default Sidebar;
