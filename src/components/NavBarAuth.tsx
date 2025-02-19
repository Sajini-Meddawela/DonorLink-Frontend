import React from 'react';
import { Bell, User, MessageSquare } from 'lucide-react';
import logo from '../Assets/donorlink_logo.png';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-10">
      <div className="mx-auto px-20">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link to={"/"}> 
              <img
                className="h-14 w-auto"
                src={logo}
                alt="DonorLink Logo"
              />
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-5">
              <MessageSquare className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800 transition-colors" />
              <Bell className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800 transition-colors" />
              <User className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800 transition-colors" />
            </div>
            <div>
                <Link to="/">
                    <button
                    className="bg-[#85C536] hover:bg-[#85C536] text-white px-6 py-2 transition-colors duration-200"
                    style={{
                        borderRadius: '20px',
                        }}
                    >
                    Logout
                    </button>
                </Link>
          </div>
        </div>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
