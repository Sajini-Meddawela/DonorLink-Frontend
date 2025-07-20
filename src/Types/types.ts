export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'DONOR' | 'CAREHOME';
  isVerified: boolean;
}

export interface InventoryItem {
  id: number;
  itemName: string;
  category: string;
  stockLevel: number;
  reorderLevel: number;
  itemDescription?: string;
  userId: number;
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
  urgencyLevel: "High" | "Medium" | "Low";
  userId: number; 
}

export interface NeedTableItem {
  id: number;
  name: string;
  requiredQuantity: number;
  currentQuantity: number;
  category: string;
  urgencyLevel: "High" | "Medium" | "Low";
  userId?: number; 
}

export interface MealDonationSlot {
  id?: number;
  date: Date;
  mealType: "Breakfast" | "Lunch" | "Dinner";
  status: "Available" | "Booked" | "Completed";
  careHomeId: number;
  donorId?: number;
}

export interface CalendarDay {
  date: Date;
  breakfast?: MealDonationSlot;
  lunch?: MealDonationSlot;
  dinner?: MealDonationSlot;
}

export interface CareHome {
  id: number;
  registrationNo: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  category: string;
}

export interface Donation {
  id: number;
  quantity: number;
  date: string;
  status: "pending" | "completed" | "rejected";
  notes?: string;
  donorId: number;
  needId: number;
  need?: NeedItem & { user?: User };
  donor?: User;
}