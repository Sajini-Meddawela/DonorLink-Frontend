import { Notification } from "../Types/types";

const API_BASE_URL = "http://localhost:4000/api";

export const NotificationService = {
  getNotifications: async (userId: number): Promise<Notification[]> => {
    const response = await fetch(
      `${API_BASE_URL}/notifications?userId=${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }
    return response.json();
  },

  getUnreadCount: async (userId: number): Promise<number> => {
    const response = await fetch(
      `${API_BASE_URL}/notifications/unread-count?userId=${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch unread count");
    }
    const data = await response.json();
    return data.count;
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {
        method: "PATCH",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }
  },

  markAllAsRead: async (userId: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/notifications/mark-all-read?userId=${userId}`,
      {
        method: "PATCH",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read");
    }
  },

  createNotification: async (
    notification: Omit<Notification, "id">
  ): Promise<Notification> => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    });
    if (!response.ok) {
      throw new Error("Failed to create notification");
    }
    return response.json();
  },
};
