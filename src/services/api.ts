import { InventoryItem } from '../Types/types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export const InventoryService = {
  async getAllItems(): Promise<InventoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/inventory`);
    if (!response.ok) throw new Error('Failed to fetch inventory items');
    return await response.json();
  },

  async getItemById(id: number): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`);
    if (!response.ok) throw new Error('Failed to fetch inventory item');
    return await response.json();
  },

  async createItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create inventory item');
    return await response.json();
  },

  async updateItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to update inventory item');
    return await response.json();
  },

  async deleteItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete inventory item');
  },

  async searchItems(query: string): Promise<InventoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/inventory/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search inventory items');
    return await response.json();
  },
};