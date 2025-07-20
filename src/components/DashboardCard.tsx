import React from "react";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon: Icon,
  color,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`${color} p-8 rounded-xl shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl min-h-[200px] flex flex-col justify-center`}
    >
      <div className="flex flex-col items-center text-center text-white">
        <div className="p-3 rounded-full bg-white/20 mb-4">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold whitespace-pre-line">{title}</h3>
        <p className="mt-2 text-sm text-white/90">View and manage</p>
      </div>
    </div>
  );
};

export default DashboardCard;
