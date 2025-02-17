import React from 'react';

interface DashboardCardProps {
  title: string;
  icon: string;
  color: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  icon, 
  color,
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md w-64 h-64 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className={`w-24 h-24 ${color} rounded-lg flex items-center justify-center mb-4`}>
        <img src={icon} alt={title} className="w-14 h-14" />
      </div>
      <h3 className={`text-center ${title.includes('Inventory') ? 'text-[#8BC34A]' : 'text-[#03A9F4]'} text-xl font-semibold whitespace-pre-line`}>
        {title}
      </h3>
    </div>
  );
};

export default DashboardCard;
