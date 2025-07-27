export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CUSTOMER" | "ORGANIZER";
  referralCode: string;
  pointsBalance: number;
  avatar?: string;
  isVerified: boolean;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  price: number;
  date: string;
  time: string;
  location: string;
  category: string;
  availableSeats: number;
  bookedSeats: number;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
  imageUrl?: string;
  isFree: boolean;
  organizerId: string;
  organizer?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  tickets?: Ticket[];
  reviews?: Review[];
  averageRating?: number;
  totalBookings?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  type: "REGULAR" | "VIP" | "EARLY_BIRD";
  price: number;
  quantity: number;
  sold: number;
  description?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  eventId: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED";
  paymentMethod?: string;
  referralDiscount: number;
  pointsUsed: number;
  event?: {
    name: string;
    date: string;
    imageUrl?: string;
  };
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items?: TransactionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  ticketId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  ticket?: {
    type: string;
  };
}

export interface Review {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  comment?: string;
  user?: {
    firstName: string;
    lastName: string;
  };
  event?: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  id: string;
  eventId: string;
  name: string;
  description: string;
  discountPercent: number;
  maxUses: number;
  currentUses: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  event?: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  summary: {
    totalEvents?: number;
    totalRevenue?: number;
    totalTicketsSold?: number;
    totalAttendees?: number;
    totalTransactions?: number;
    totalSpent?: number;
    upcomingEvents?: number;
    attendedEvents?: number;
    pointsBalance?: number;
    referralCount?: number;
  };
  charts?: {
    revenueByPeriod?: Array<{
      date: string;
      revenue: number;
    }>;
    topEvents?: Array<{
      id: string;
      name: string;
      revenue: number;
      attendees: number;
    }>;
    eventStatusDistribution?: Array<{
      status: string;
      count: number;
    }>;
  };
  referralCode?: string;
  recentTransactions?: Transaction[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  pagination?: PaginationInfo;
}

export interface EventFilters {
  search?: string;
  category?: string;
  location?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
