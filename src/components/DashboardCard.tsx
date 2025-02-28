import React from "react";

interface DashboardCardProps {
  title: string;
  icon: React.ElementType; // Accepts a React component (Lucide icon)
  color: string;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon: Icon, color, onClick }) => {
  return (
    <div
      className={`p-6 rounded-xl shadow-lg cursor-pointer ${color} transition-transform transform hover:scale-105`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <Icon className="w-12 h-12 text-gray-700" /> {/* Render the Lucide icon */}
        <h2 className="text-center font-semibold text-lg whitespace-pre-wrap">{title}</h2>
      </div>
    </div>
  );
};

export default DashboardCard;
