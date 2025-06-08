import axios from "axios";
import {
  MealDonationSlot,
  CalendarDay,
  NeedItem,
  CareHome,
  InventoryItem,
} from "../Types/types";

const API_BASE_URL = "http://localhost:4000/api/inventory";
const NEEDS_BASE_URL = "http://localhost:4000/api/needs";
const MEAL_DONATION_BASE_URL = "http://localhost:4000/api/mealdonations";
const CARE_HOME_BASE_URL = "http://localhost:4000/api/carehomes";

export const InventoryService = {
  getAllItems: async (careHomeId: number): Promise<InventoryItem[]> => {
    const response = await axios.get(API_BASE_URL, { params: { careHomeId } });
    return response.data;
  },

  getItemById: async (
    id: number,
    careHomeId: number
  ): Promise<InventoryItem> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      params: { careHomeId },
    });
    return response.data;
  },

  createItem: async (
    itemData: Omit<InventoryItem, "id">
  ): Promise<InventoryItem> => {
    const response = await axios.post(API_BASE_URL, itemData);
    return response.data;
  },

  updateItem: async (
    id: number,
    careHomeId: number,
    itemData: Partial<InventoryItem>
  ): Promise<InventoryItem> => {
    const response = await axios.put(
      `${API_BASE_URL}/${id}`,
      {
        ...itemData,
        careHomeId,
      },
      {
        params: { careHomeId },
      }
    );
    return response.data;
  },

  deleteItem: async (id: number, careHomeId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`, { params: { careHomeId } });
  },

  searchItems: async (
    query: string,
    careHomeId: number
  ): Promise<InventoryItem[]> => {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { q: query, careHomeId },
    });
    return response.data;
  },
};

export const NeedsService = {
  getAllNeeds: async (careHomeId: number): Promise<NeedItem[]> => {
    try {
      const response = await axios.get(`${NEEDS_BASE_URL}/carehome/${careHomeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching needs:', error);
      throw error;
    }
  },

  getNeedById: async (id: number, careHomeId: number): Promise<NeedItem> => {
    const response = await axios.get(`${NEEDS_BASE_URL}/${id}`, {
      params: { careHomeId }
    });
    return response.data;
  },

  createNeed: async (needData: Omit<NeedItem, "id">): Promise<NeedItem> => {
    const response = await axios.post(NEEDS_BASE_URL, needData);
    return response.data;
  },

  updateNeed: async (
    id: number,
    needData: Partial<NeedItem>,
    careHomeId: number
  ): Promise<NeedItem> => {
    const response = await axios.put(`${NEEDS_BASE_URL}/${id}`, needData, {
      params: { careHomeId }
    });
    return response.data;
  },

  deleteNeed: async (id: number, careHomeId: number): Promise<void> => {
    await axios.delete(`${NEEDS_BASE_URL}/${id}`, {
      params: { careHomeId }
    });
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
