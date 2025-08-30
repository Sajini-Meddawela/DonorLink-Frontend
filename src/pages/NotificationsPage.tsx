import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ArrowLeft, CheckCircle } from "lucide-react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBarAuth";
import { NotificationService } from "../services/api";
import { Notification } from "../Types/types";
import { useAuth } from "../context/AuthContext";

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await NotificationService.getNotifications(user.id);
        setNotifications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleNotificationClick = async (notification: Notification) => {

    await NotificationService.markAsRead(notification.id);
    
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      await NotificationService.markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  if (!user) {
    return <div className="text-center p-8">Please login to access this page</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar activePage="notifications" />
        <div className="flex-1 flex flex-col overflow-auto p-6 ml-[260px]">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-sky-400">Notifications</h1>
            <div className="ml-auto">
              <button
                onClick={markAllAsRead}
                className="flex items-center px-4 py-2 bg-[#63C6F7] text-white rounded-md hover:bg-[#52b0e0]"
              >
                <CheckCircle size={16} className="mr-2" />
                Mark all as read
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center p-8">Loading notifications...</div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">Error: {error}</div>
          ) : notifications.length === 0 ? (
            <div className="text-center p-8">
              <Bell size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-md shadow overflow-hidden">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className={`font-medium ${!notification.isRead ? "text-blue-800" : "text-gray-800"}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  {notification.actionUrl && (
                    <div className="mt-2">
                      <span className="text-xs text-blue-500">Click to view details</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;