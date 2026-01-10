export enum BookingStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum Category {
  PLUMBING = "plumbing",
  ELECTRICAL = "electrical",
  CLEANING = "cleaning",
  HANDYMAN = "handyman",
  PAINTING = "painting",
}

export type Booking = {
  id: string;
  clientId: string;
  proId: string;
  category: string; // Category enum value
  description: string;
  status: BookingStatus;
  scheduledAt: Date;
  estimatedHours: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Pro = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  hourlyRate: number;
  categories: string[]; // Array of Category enum values
  serviceArea: string | null;
  rating: number | null;
  reviewCount: number;
  isApproved: boolean;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
};
