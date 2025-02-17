import React from 'react';
import { Layout, ListTodo, Calendar, Inbox } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', icon: <Layout size={20} />, path: '/dashboard' },
    { title: 'Inventory Management', icon: <ListTodo size={20} />, path: '/inventory' },
    { title: 'Need List', icon: <Inbox size={20} />, path: '/needs' },
    { title: 'Donation Received', icon: <Inbox size={20} />, path: '/donations' },
    { title: 'Scheduling', icon: <Calendar size={20} />, path: '/scheduling' }
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col py-6">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`flex items-center gap-4 px-6 py-4 transition duration-300 hover:bg-gray-100
            ${location.pathname === item.path ? 'bg-[#03A9F4]/10 border-l-4 border-[#03A9F4]' : ''}`}
        >
          <span className={`${location.pathname === item.path ? 'text-[#03A9F4]' : 'text-gray-600'}`}>
            {item.icon}
          </span>
          <span className={`${location.pathname === item.path ? 'text-[#03A9F4] font-bold' : 'text-gray-600 font-medium'}`}>
            {item.title}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
