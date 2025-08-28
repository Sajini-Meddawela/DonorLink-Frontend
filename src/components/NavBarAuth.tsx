import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bell, User, MessageSquare, Home } from "lucide-react";
import logo from "../Assets/donorlink_logo.png";
import ProfileEditTooltip from "./ProfileEditTooltip";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser, logout } = useAuth();
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardPath = currentUser?.role === "CAREHOME" 
    ? "/care_dashboard" 
    : "/donor_dashboard";

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="mx-auto px-20">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <Link to={"/"}>
                <img className="h-14 w-auto" src={logo} alt="DonorLink Logo" />
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex gap-5">
                {/* Home Icon */}
                <Link to={dashboardPath}>
                  <Home 
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      isActive(dashboardPath) 
                        ? "text-[#63C6F7]" 
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  />
                </Link>
                
                {/* Chat Icon */}
                <Link to="/chat">
                  <MessageSquare 
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      isActive("/chat") 
                        ? "text-[#63C6F7]" 
                        : "text-gray-600 hover:text-gray-800"
                    }`} 
                  />
                </Link>
                
                {/* Notifications Icon */}
                <Bell 
                  className={`w-6 h-6 cursor-pointer transition-colors ${
                    isActive("/notifications") 
                      ? "text-[#63C6F7]" 
                      : "text-gray-600 hover:text-gray-800"
                  }`} 
                />
                
                {/* Profile Icon */}
                <div className="relative">
                  <User
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      showProfileTooltip || isActive("/profile")
                        ? "text-[#63C6F7]"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => setShowProfileTooltip(!showProfileTooltip)}
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={handleLogout}
                  className="bg-[#85C536] hover:bg-[#7bb530] text-white px-6 py-2 transition-colors duration-200 rounded-full"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Edit Tooltip */}
      {showProfileTooltip && (
        <ProfileEditTooltip
          currentUser={currentUser}
          onClose={() => setShowProfileTooltip(false)}
        />
      )}
    </>
  );
};

export default Navbar;