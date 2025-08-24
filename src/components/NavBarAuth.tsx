import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bell, User, MessageSquare } from "lucide-react";
import logo from "../Assets/donorlink_logo.png";
import ProfileEditTooltip from "./ProfileEditTooltip";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
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
                <Link to="/chat">
                  <MessageSquare className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800 transition-colors" />
                </Link>
                <Bell className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800 transition-colors" />
                <div className="relative">
                  <User
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      showProfileTooltip
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
