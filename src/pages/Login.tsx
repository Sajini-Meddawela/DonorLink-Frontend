import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import logo from '../Assets/donorlink_logo.png';

const LoginPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleCareHomeClick = () => {
    navigate('/carelogin'); // Navigate to care home login page
  };

  const handleDonorClick = () => {
    navigate('/donorlogin'); // Navigate to donor login page
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side - Logo (40%) */}
      <div className="w-[40%] bg-white flex flex-col items-center justify-center p-8">
        <img 
          src={logo}
          alt="DonorLink Logo" 
          className="max-w-[280px] w-full mb-8"
        />
        <div className="w-full max-w-[320px] p-4 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm leading-relaxed">
            Join our community of care homes and donors making a difference in elderly and children lives.
          </p>
        </div>
      </div>

      {/* Right side - Login Options (60%) */}
      <div className="w-[60%] bg-[#63C6F7] flex flex-col items-center justify-center p-8 relative">
        {/* Help Button */}
        <button className="absolute top-8 right-8 text-white hover:text-blue-100 px-4 py-2">
          Need Help?
        </button>

        <h1 className="text-white text-4xl font-bold mb-4">Welcome!</h1>
        <p className="text-white font-bold mb-12">Choose your login type to continue</p>
        
        <div className="flex flex-col gap-8 w-full max-w-[600px]">
          {/* Care Home Option */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-[#63C6F7] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Care Home Login</h2>
                <p className="text-sm text-gray-500">For registered care facilities</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex gap-4 mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
              </div>
              <p className="text-sm text-gray-600">
                Access your dashboard to manage donation requests, track received items, and update your facility's needs.
              </p>
            </div>

            {/* Button */}
            <button 
              onClick={handleCareHomeClick} 
              className="w-full bg-[#63C6F7] rounded-[30px] hover:bg-[#5BB5F6] text-white py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
            >
              Login as a Care Home Owner
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Donor Option */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-[#85C536] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Donor Login</h2>
                <p className="text-sm text-gray-500">For generous contributors</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex gap-4 mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
              </div>
              <p className="text-sm text-gray-600">
                Browse care home needs, make donations, and track your contribution history. Your generosity makes a difference!
              </p>
            </div>

            {/* Button */}
            <button 
              onClick={handleDonorClick} 
              className="w-full bg-[#85C536] rounded-[30px] hover:bg-[#75B82F] text-white py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
            >
              Login as a Donor
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
