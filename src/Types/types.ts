export interface InventoryItem {
  id: number;
  itemName: string;
  category: string;
  stockLevel: number;
  reorderLevel: number;
  itemDescription?: string;
  careHomeId?: number; 
}
export interface InventoryTableItem {
  id: number;
  name: string;
  category: string;
  stockLevel: number;
  reorderLevel: number;
}

export interface NeedItem {
  id: number;
  itemName: string;
  requiredQuantity: number;
  currentQuantity: number;
  category: string;
  urgencyLevel: 'High' | 'Medium' | 'Low';
}

export interface NeedTableItem {
  id: number;
  name: string;
  requiredQuantity: number;
  currentQuantity: number;
  category: string;
  urgencyLevel: 'High' | 'Medium' | 'Low';
}
