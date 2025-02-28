// types.ts
export interface InventoryItem {
    id: string | number;
    name: string;
    stockLevel: number;
    category: string;
    reorderLevel: number;
  }