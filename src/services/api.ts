import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/inventory';
const NEEDS_BASE_URL = 'http://localhost:4000/api/needs';
const MEAL_DONATION_BASE_URL = 'http://localhost:4000/api/meal-donations';

export interface InventoryItem {
  id: number;
  itemName: string;
  category: string;
  stockLevel: number;
  reorderLevel: number;
  itemDescription?: string;
}

export interface NeedItem {
  id: number;
  itemName: string;
  requiredQuantity: number;
  currentQuantity: number;
  category: string;
  urgencyLevel: 'High' | 'Medium' | 'Low';
}

export const InventoryService = {
  getAllItems: async (): Promise<InventoryItem[]> => {
    const response = await axios.get(API_BASE_URL);
    console.log('API Response:', response.data); 
    return response.data;
  },

  getItemById: async (id: number): Promise<InventoryItem> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  createItem: async (itemData: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
    const response = await axios.post(API_BASE_URL, itemData);
    return response.data;
  },

  updateItem: async (id: number, itemData: Partial<InventoryItem>): Promise<InventoryItem> => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, itemData);
    return response.data;
  },

  deleteItem: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },

  searchItems: async (query: string): Promise<InventoryItem[]> => {
    const response = await axios.get(`${API_BASE_URL}/search?q=${query}`);
    return response.data;
  }
};

export const NeedsService = {
  getAllNeeds: async (): Promise<NeedItem[]> => {
    const response = await axios.get(NEEDS_BASE_URL);
    return response.data;
  },

  getNeedById: async (id: number): Promise<NeedItem> => {
    const response = await axios.get(`${NEEDS_BASE_URL}/${id}`);
    return response.data;
  },

  createNeed: async (needData: Omit<NeedItem, 'id'>): Promise<NeedItem> => {
    const response = await axios.post(NEEDS_BASE_URL, needData);
    return response.data;
  },

  updateNeed: async (id: number, needData: Partial<NeedItem>): Promise<NeedItem> => {
    const response = await axios.put(`${NEEDS_BASE_URL}/${id}`, needData);
    return response.data;
  },

  deleteNeed: async (id: number): Promise<void> => {
    await axios.delete(`${NEEDS_BASE_URL}/${id}`);
  },
};
