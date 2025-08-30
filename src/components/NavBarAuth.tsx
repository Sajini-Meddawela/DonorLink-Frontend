import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bell, User, MessageSquare, Home } from "lucide-react";
import logo from "../Assets/donorlink_logo.png";
import ProfileEditTooltip from "./ProfileEditTooltip";
import { NotificationService } from "../services/api";
import { Notification } from "../Types/types";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser, logout, updateUser } = useAuth();
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const dashboardPath = currentUser?.role === "CAREHOME" 
    ? "/care_dashboard" 
    : "/donor_dashboard";

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const [notificationsData, unreadCountData] = await Promise.all([
          NotificationService.getNotifications(currentUser.id),
          NotificationService.getUnreadCount(currentUser.id)
        ]);
        
        setNotifications(notificationsData);
        setUnreadCount(unreadCountData);
        
        if (currentUser.unreadNotifications !== unreadCountData) {
          updateUser({ ...currentUser, unreadNotifications: unreadCountData });
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    const intervalId = setInterval(fetchNotifications, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [currentUser, updateUser]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNotificationClick = async (notification: Notification) => {
    await NotificationService.markAsRead(notification.id);
    
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => prev - 1);
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    
    setShowNotifications(false);
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;
    
    try {
      await NotificationService.markAllAsRead(currentUser.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
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
                <div className="relative">
                  <Bell 
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      showNotifications || isActive("/notifications") 
                        ? "text-[#63C6F7]" 
                        : "text-gray-600 hover:text-gray-800"
                    }`} 
                    onClick={() => setShowNotifications(!showNotifications)}
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-3.5 h-3.5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
                      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                          <div className="p-4 text-center">Loading notifications...</div>
                        ) : notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">No notifications</div>
                        ) : (
                          notifications.map(notification => (
                            <div
                              key={notification.id}
                              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                                !notification.isRead ? "bg-blue-50" : ""
                              }`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex justify-between items-start">
                                <span className={`text-sm font-medium ${!notification.isRead ? "text-blue-800" : "text-gray-800"}`}>
                                  {notification.title}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(notification.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-3 border-t border-gray-200">
                        <button 
                          onClick={() => {
                            setShowNotifications(false);
                            navigate("/notifications");
                          }}
                          className="w-full text-center text-blue-500 hover:text-blue-700 text-sm"
                        >
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
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