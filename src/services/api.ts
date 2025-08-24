import axios from "axios";
import { useAuth } from "../context/AuthContext";

import {
  NeedItem,
  CareHome,
  InventoryItem,
  Donation,
  User,
  Chat,
  Message,
} from "../Types/types";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const API_BASE_URL = "http://localhost:4000/api/inventory";
const NEEDS_BASE_URL = "http://localhost:4000/api/needs";
const MEAL_DONATION_BASE_URL = "http://localhost:4000/api/mealdonations";
const CARE_HOME_BASE_URL = "http://localhost:4000/api/carehomes";
const API_AUTH_URL = "http://localhost:4000/api/v1";

export const InventoryService = {
  getAllItems: async (userId: number): Promise<InventoryItem[]> => {
    const response = await api.get("/inventory", { params: { userId } });
    return response.data;
  },

  getItemById: async (id: number, userId: number): Promise<InventoryItem> => {
    const response = await api.get(`/inventory/${id}`, {
      params: { userId },
    });
    return response.data;
  },

  createItem: async (
    itemData: Omit<InventoryItem, "id">
  ): Promise<InventoryItem> => {
    const response = await api.post("/inventory", itemData);
    return response.data;
  },

  updateItem: async (
    id: number,
    userId: number,
    itemData: Partial<InventoryItem>
  ): Promise<InventoryItem> => {
    const response = await api.put(`/inventory/${id}`, itemData, {
      params: { userId },
    });
    return response.data;
  },

  deleteItem: async (id: number, userId: number): Promise<void> => {
    await api.delete(`/inventory/${id}`, { params: { userId } });
  },

  searchItems: async (
    query: string,
    userId: number
  ): Promise<InventoryItem[]> => {
    const response = await api.get("/inventory/search", {
      params: { q: query, userId },
    });
    return response.data;
  },
};

export const NeedsService = {
  getAllNeeds: async (userId: number): Promise<NeedItem[]> => {
    const response = await api.get("/needs", { params: { userId } });
    return response.data;
  },

  getNeedById: async (id: number, userId?: number): Promise<NeedItem> => {
    try {
      const params = userId ? { userId } : {};
      const response = await api.get(`/needs/${id}`, { params });

      if (response.status === 404) {
        throw new Error("Need not found");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching need:", error);
      throw error;
    }
  },

  createNeed: async (needData: Omit<NeedItem, "id">): Promise<NeedItem> => {
    const response = await api.post("/needs", needData);
    return response.data;
  },

  updateNeed: async (
    id: number,
    needData: Partial<NeedItem>,
    userId: number
  ): Promise<NeedItem> => {
    const response = await api.put(`/needs/${id}`, needData, {
      params: { userId },
    });
    return response.data;
  },

  deleteNeed: async (id: number, userId: number): Promise<void> => {
    await api.delete(`/needs/${id}`, { params: { userId } });
  },

  getCareHomeNeeds: async (careHomeId: number): Promise<NeedItem[]> => {
    const response = await api.get(`/needs/carehome/${careHomeId}`);
    return response.data;
  },

  getNeedByIdPublic: async (id: number): Promise<NeedItem> => {
    const response = await api.get(`/needs/public/${id}`);
    return response.data;
  },
};

export const DonationsService = {
  createDonation: async (
    donationData: Omit<Donation, "id">
  ): Promise<Donation> => {
    const response = await api.post("/donations", donationData);
    return response.data;
  },

  getDonationById: async (
    id: number
  ): Promise<
    Donation & {
      donor?: User;
      need?: NeedItem & { user?: User };
    }
  > => {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  },

  getDonationsByDonor: async (donorId: number): Promise<Donation[]> => {
    const response = await api.get(`/donations/donor/${donorId}`);
    return response.data;
  },

  getCareHomeDonations: async (careHomeId: number): Promise<Donation[]> => {
    const response = await api.get(`/donations/carehome/${careHomeId}`);
    return response.data;
  },

  updateDonationStatus: async (
    id: number,
    status: string
  ): Promise<Donation> => {
    const response = await api.patch(`/donations/${id}/status`, { status });
    return response.data;
  },
};

export const MealDonationService = {
  async getSlots(
    careHomeId: number,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const response = await api.get(`${MEAL_DONATION_BASE_URL}`, {
      params: {
        careHomeId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return response.data;
  },

  async createSlots(
    careHomeId: number,
    date: Date,
    mealTypes: string[]
  ): Promise<any> {
    const response = await api.post(`${MEAL_DONATION_BASE_URL}`, {
      careHomeId,
      date: date.toISOString(),
      mealTypes,
    });
    return response.data;
  },

  async bookSlot(slotId: number, donorId: number): Promise<any> {
    const response = await api.post(
      `${MEAL_DONATION_BASE_URL}/${slotId}/book`,
      { donorId }
    );
    return response.data;
  },

  async getDonorBookings(donorId: number): Promise<any> {
    const response = await api.get(`${MEAL_DONATION_BASE_URL}/donor`, {
      params: { donorId },
    });
    return response.data;
  },

  async updateMealDonationStatus(
    slotId: number,
    status: "completed" | "cancelled"
  ): Promise<any> {
    const response = await api.patch(
      `${MEAL_DONATION_BASE_URL}/${slotId}/status`,
      { status }
    );
    return response.data;
  },
};

export const CareHomeService = {
  async getCareHomes(filters: {
    search?: string;
    category?: string;
    location?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await axios.get(CARE_HOME_BASE_URL, { params: filters });
    return response.data;
  },

  async getCareHomeDetails(id: number): Promise<CareHome> {
    const response = await axios.get(`${CARE_HOME_BASE_URL}/${id}`);
    return response.data;
  },

  async getCareHomeNeeds(careHomeId: number): Promise<NeedItem[]> {
    const response = await axios.get(
      `${NEEDS_BASE_URL}/carehome/${careHomeId}`
    );
    return response.data;
  },
};

export const UserService = {
  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/v1/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/v1/users/${id}`, userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/v1/users/me");
    return response.data;
  },
};

export const ChatService = {
  getOrCreateChat: async (careHomeId: number): Promise<Chat> => {
    const response = await api.post("/chats", { careHomeId });
    return response.data;
  },
  getUserChats: async (): Promise<Chat[]> => {
    try {
      const response = await api.get("/chats");
      return response.data;
    } catch (error) {
      console.error("Error fetching chats:", error);
      throw new Error("Failed to fetch chats");
    }
  },

  getChatMessages: async (chatId: number): Promise<Message[]> => {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
  },

  sendMessage: async (chatId: number, content: string): Promise<Message> => {
    const response = await api.post("/chats/message", { chatId, content });
    return response.data;
  },
};
