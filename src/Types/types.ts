export interface InventoryItem {
  id?: number;
  itemName: string;
  category: string;
  stockLevel: number;
  reorderLevel: number;
  itemDescription?: string;
}

export interface InventoryTableItem {
  id?: number;
  name: string;
  category: string;
  stockLevel: number;
  reorderLevel: number;
}