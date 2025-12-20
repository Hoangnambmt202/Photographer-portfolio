export interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  maxPeople: number;
  includedItems: string[];
  isActive: boolean;
  image?: string;
  rating: number;
  totalBookings: number;
  createdAt: string;
}

export interface ServiceFormData {
  name: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  maxPeople: string;
  includedItems: string;
  isActive: boolean;
}

export type ServiceModalMode = "create" | "edit" | "view";
