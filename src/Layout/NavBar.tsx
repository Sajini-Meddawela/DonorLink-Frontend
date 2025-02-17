import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/donorlink_logo.png';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-10">
      <div className="mx-auto" style={{ marginLeft: '5cm', marginRight: '5cm' }}>
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <a href="/"> 
              <img
                className="h-14 w-auto"
                src={logo}
                alt="DonorLink Logo"
              />
            </a>
          </div>
          
          <div className="hidden sm:ml-20 sm:flex sm:space-x-20">
            <Link
              to="/"
              className="text-[#85C536] hover:text-[#63C6F7] px-3 py-2 text-lg font-medium border-b-2 border-transparent hover:border-[#63C6F7]"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-[#85C536] hover:text-[#63C6F7] px-3 py-2 text-lg font-medium border-b-2 border-transparent hover:border-[#63C6F7]"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-[#85C536] hover:text-[#63C6F7] px-3 py-2 text-lg font-medium border-b-2 border-transparent hover:border-[#63C6F7]"
            >
              Contact
            </Link>
            <Link
              to="/services"
              className="text-[#85C536] hover:text-[#63C6F7] px-3 py-2 text-lg font-medium border-b-2 border-transparent hover:border-[#63C6F7]"
            >
              Services
            </Link>
          </div>

          <div>
            <Link to="/login">
              <button
                className="bg-[#85C536] hover:bg-[#85C536] text-white px-6 py-2 transition-colors duration-200"
                style={{
                  borderRadius: '20px',
                }}
              >
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
