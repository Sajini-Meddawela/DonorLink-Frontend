import axios from "axios";
import { useAuth } from "../context/AuthContext";

import {
  MealDonationSlot,
  CalendarDay,
  NeedItem,
  CareHome,
  InventoryItem,
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

export const MealDonationService = {
  async getSlots(
    careHomeId: number,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const response = await axios.get(MEAL_DONATION_BASE_URL, {
      params: { careHomeId, startDate, endDate },
    });
    return response.data;
  },

  async createSlots(
    careHomeId: number,
    date: Date,
    mealTypes: string[]
  ): Promise<any> {
    const response = await axios.post(MEAL_DONATION_BASE_URL, {
      careHomeId,
      date,
      mealTypes,
    });
    return response.data;
  },

  async bookSlot(slotId: number, donorId: number): Promise<any> {
    const response = await axios.post(
      `${MEAL_DONATION_BASE_URL}/${slotId}/book`,
      { donorId }
    );
    return response.data;
  },

  async getDonorBookings(donorId: number): Promise<any> {
    const response = await axios.get(`${MEAL_DONATION_BASE_URL}/donor`, {
      params: { donorId },
    });
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
