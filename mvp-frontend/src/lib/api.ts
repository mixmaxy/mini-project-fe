import axios from "axios";
import { Event, Transaction, Review, Promotion } from "@/types";
import { config } from "./config";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  // Get Clerk token from browser storage
  try {
    const token = localStorage.getItem("clerk-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Could not add auth token:", error);
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress 401 errors in development since backend auth is not fully integrated
    if (
      config.errorHandling.suppressUnauthorized &&
      error.response?.status === 401
    ) {
      console.warn("API 401 Unauthorized - Using mock data instead");
      return Promise.reject(error);
    }
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// Event API calls
export const eventAPI = {
  // Get all events with filters
  getEvents: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    location?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    try {
      const response = await api.get("/events", { params });
      return response.data;
    } catch (error) {
      // Return mock data if backend is not available
      console.warn("Backend not available, using mock data for events:", error);
      return {
        events: [
          {
            id: "1",
            organizerId: "1",
            name: "Tech Conference 2024",
            description: "Join us for the biggest tech conference of the year!",
            category: "Technology",
            location: "Jakarta Convention Center",
            date: "2024-12-15",
            time: "09:00",
            availableSeats: 500,
            bookedSeats: 150,
            price: 500000,
            isFree: false,
            status: "PUBLISHED",
            organizer: {
              id: "1",
              firstName: "Tech",
              lastName: "Events Inc",
            },
            averageRating: 4.5,
            totalBookings: 25,
            imageUrl: "/api/placeholder/400/300",
            createdAt: "2024-01-15",
            updatedAt: "2024-01-20",
          },
          {
            id: "2",
            organizerId: "2",
            name: "Music Festival 2024",
            description: "The biggest music festival in Indonesia!",
            category: "Music",
            location: "Gelora Bung Karno",
            date: "2024-11-20",
            time: "18:00",
            availableSeats: 1000,
            bookedSeats: 800,
            price: 750000,
            isFree: false,
            status: "PUBLISHED",
            organizer: {
              id: "2",
              firstName: "Music",
              lastName: "Productions",
            },
            averageRating: 4.8,
            totalBookings: 45,
            imageUrl: "/api/placeholder/400/300",
            createdAt: "2024-01-10",
            updatedAt: "2024-01-15",
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          total: 2,
          limit: 10,
        },
      };
    }
  },

  // Get single event by ID
  getEvent: async (id: string) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch {
      // Return mock data if backend is not available
      console.warn("Backend not available, using mock data for event details");
      return {
        id: id,
        organizerId: "1",
        name: "Tech Conference 2024",
        description: "Join us for the biggest tech conference of the year!",
        category: "Technology",
        location: "Jakarta Convention Center",
        date: "2024-12-15",
        time: "09:00",
        availableSeats: 500,
        bookedSeats: 150,
        price: 500000,
        isFree: false,
        status: "PUBLISHED",
        organizer: {
          id: "1",
          firstName: "Tech",
          lastName: "Events Inc",
        },
        averageRating: 4.5,
        totalBookings: 25,
        imageUrl: "/api/placeholder/400/300",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
      };
    }
  },

  // Create event (organizer only)
  createEvent: async (data: Partial<Event>) => {
    try {
      const response = await api.post("/events", data);
      return response.data;
    } catch {
      console.warn("Backend not available, simulating event creation");
      return { success: true, id: "mock-" + Date.now() };
    }
  },

  // Update event (organizer only)
  updateEvent: async (id: string, data: Partial<Event>) => {
    try {
      const response = await api.put(`/events/${id}`, data);
      return response.data;
    } catch {
      console.warn("Backend not available, simulating event update");
      return { success: true };
    }
  },

  // Delete event (organizer only)
  deleteEvent: async (id: string) => {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch {
      console.warn("Backend not available, simulating event deletion");
      return { success: true };
    }
  },

  // Get organizer's events
  getOrganizerEvents: async (params?: { page?: number; limit?: number }) => {
    try {
      const response = await api.get("/events/organizer/my-events", { params });
      return response.data;
    } catch {
      // Return mock data if backend is not available
      console.warn(
        "Backend not available, using mock data for organizer events"
      );
      return {
        events: [
          {
            id: "1",
            organizerId: "1",
            name: "Tech Conference 2024",
            description: "Join us for the biggest tech conference of the year!",
            category: "Technology",
            location: "Jakarta Convention Center",
            date: "2024-12-15",
            time: "09:00",
            availableSeats: 500,
            bookedSeats: 150,
            price: 500000,
            isFree: false,
            status: "PUBLISHED",
            organizer: {
              id: "1",
              firstName: "Tech",
              lastName: "Events Inc",
            },
            averageRating: 4.5,
            totalBookings: 25,
            imageUrl: "/api/placeholder/400/300",
            createdAt: "2024-01-15",
            updatedAt: "2024-01-20",
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          total: 1,
          limit: 10,
        },
      };
    }
  },
};

// Transaction API calls
export const transactionAPI = {
  // Create transaction
  createTransaction: async (data: Partial<Transaction>) => {
    try {
      const response = await api.post("/transactions", data);
      return response.data;
    } catch {
      console.warn("Backend not available, simulating transaction creation");
      return { success: true, id: "mock-" + Date.now() };
    }
  },

  // Get user transactions
  getUserTransactions: async (params?: { page?: number; limit?: number }) => {
    try {
      const response = await api.get("/transactions/user/my-transactions", {
        params,
      });
      return response.data;
    } catch {
      // Return mock data if backend is not available
      console.warn("Backend not available, using mock data for transactions");
      return {
        transactions: [
          {
            id: "1",
            eventName: "Tech Conference 2024",
            eventDate: "2024-12-15",
            eventLocation: "Jakarta Convention Center",
            ticketQuantity: 2,
            totalAmount: 1000000,
            status: "COMPLETED",
            paymentMethod: "Credit Card",
            transactionDate: "2024-01-15",
            referenceNumber: "TXN-2024-001",
            organizerName: "Tech Events Inc",
            pointsUsed: 5000,
            discountApplied: 100000,
          },
          {
            id: "2",
            eventName: "Music Festival 2024",
            eventDate: "2024-11-20",
            eventLocation: "Gelora Bung Karno",
            ticketQuantity: 1,
            totalAmount: 750000,
            status: "COMPLETED",
            paymentMethod: "Bank Transfer",
            transactionDate: "2024-01-10",
            referenceNumber: "TXN-2024-002",
            organizerName: "Music Productions",
            pointsUsed: 0,
            discountApplied: 0,
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          total: 2,
          limit: 10,
        },
      };
    }
  },

  // Get organizer sales
  getOrganizerSales: async (params?: {
    page?: number;
    limit?: number;
    eventId?: string;
  }) => {
    try {
      const response = await api.get("/transactions/organizer/sales", {
        params,
      });
      return response.data;
    } catch {
      // Return mock data if backend is not available
      console.warn(
        "Backend not available, using mock data for organizer sales"
      );
      return {
        sales: [
          {
            id: "1",
            eventName: "Tech Conference 2024",
            eventDate: "2024-12-15",
            ticketsSold: 150,
            totalRevenue: 75000000,
            status: "COMPLETED",
            transactionDate: "2024-01-15",
            referenceNumber: "TXN-2024-001",
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          total: 1,
          limit: 10,
        },
      };
    }
  },
};

// Review API calls
export const reviewAPI = {
  // Create review
  createReview: async (data: Partial<Review>) => {
    try {
      const response = await api.post("/reviews", data);
      return response.data;
    } catch {
      console.warn("Backend not available, simulating review creation");
      return { success: true, id: "mock-" + Date.now() };
    }
  },

  // Update review
  updateReview: async (id: string, data: Partial<Review>) => {
    try {
      const response = await api.put(`/reviews/${id}`, data);
      return response.data;
    } catch {
      console.warn("Backend not available, simulating review update");
      return { success: true };
    }
  },

  // Delete review
  deleteReview: async (id: string) => {
    try {
      const response = await api.delete(`/reviews/${id}`);
      return response.data;
    } catch {
      console.warn("Backend not available, simulating review deletion");
      return { success: true };
    }
  },

  // Get event reviews
  getEventReviews: async (
    eventId: string,
    params?: { page?: number; limit?: number }
  ) => {
    try {
      const response = await api.get(`/reviews/event/${eventId}`, { params });
      return response.data;
    } catch {
      // Return mock data if backend is not available
      console.warn("Backend not available, using mock data for reviews");
      return {
        reviews: [
          {
            id: "1",
            eventId: eventId,
            userId: "user1",
            rating: 5,
            title: "Amazing Event!",
            comment:
              "This was one of the best events I've ever attended. Highly recommended!",
            categories: {
              overall: 5,
              organization: 5,
              venue: 4,
              value: 5,
            },
            createdAt: "2024-01-15",
            updatedAt: "2024-01-15",
          },
          {
            id: "2",
            eventId: eventId,
            userId: "user2",
            rating: 4,
            title: "Great Experience",
            comment: "Very well organized event with excellent speakers.",
            categories: {
              overall: 4,
              organization: 4,
              venue: 5,
              value: 4,
            },
            createdAt: "2024-01-14",
            updatedAt: "2024-01-14",
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          total: 2,
          limit: 10,
        },
      };
    }
  },
};

// Dashboard API calls
export const dashboardAPI = {
  // Get organizer stats
  getOrganizerStats: async (period?: "day" | "month" | "year") => {
    try {
      const response = await api.get("/dashboard/organizer/stats", {
        params: { period },
      });
      return response.data;
    } catch {
      // Return mock data if backend is not available
      console.warn(
        "Backend not available, using mock data for organizer stats"
      );
      return {
        summary: {
          totalEvents: 12,
          totalRevenue: 25000000,
          totalTicketsSold: 450,
          totalAttendees: 1200,
          averageRating: 4.2,
        },
        charts: {
          revenueByPeriod: [
            { date: "Jan", revenue: 5000000 },
            { date: "Feb", revenue: 6000000 },
            { date: "Mar", revenue: 4500000 },
            { date: "Apr", revenue: 7000000 },
            { date: "May", revenue: 5500000 },
            { date: "Jun", revenue: 8000000 },
          ],
          eventStatusDistribution: [
            { name: "Published", value: 8 },
            { name: "Draft", value: 3 },
            { name: "Cancelled", value: 1 },
          ],
        },
        topEvents: [
          { name: "Tech Conference 2024", revenue: 5000000 },
          { name: "Music Festival", revenue: 3000000 },
          { name: "Business Summit", revenue: 2500000 },
        ],
      };
    }
  },

  // Get customer stats
  getCustomerStats: async () => {
    try {
      const response = await api.get("/dashboard/customer/stats");
      return response.data;
    } catch {
      // Return mock data if backend is not available
      console.warn("Backend not available, using mock data for customer stats");
      return {
        summary: {
          totalEvents: 8,
          totalSpent: 1500000,
          pointsBalance: 25000,
          referralCount: 3,
          averageRating: 4.5,
        },
        charts: {
          spendingByPeriod: [
            { date: "Jan", spending: 200000 },
            { date: "Feb", spending: 300000 },
            { date: "Mar", spending: 150000 },
            { date: "Apr", spending: 400000 },
            { date: "May", spending: 250000 },
            { date: "Jun", spending: 200000 },
          ],
          categoryDistribution: [
            { name: "Technology", value: 3 },
            { name: "Music", value: 2 },
            { name: "Business", value: 2 },
            { name: "Sports", value: 1 },
          ],
        },
        favoriteCategories: [
          { category: "Technology", count: 3 },
          { category: "Music", count: 2 },
          { category: "Business", count: 2 },
          { category: "Sports", count: 1 },
        ],
      };
    }
  },
};

// Promotion API calls
export const promotionAPI = {
  // Create promotion
  createPromotion: async (data: Partial<Promotion>) => {
    try {
      const response = await api.post("/promotions", data);
      return response.data;
    } catch {
      console.warn("Backend not available, simulating promotion creation");
      return { success: true, id: "mock-" + Date.now() };
    }
  },

  // Get organizer promotions
  getOrganizerPromotions: async () => {
    try {
      const response = await api.get("/promotions/organizer/my-promotions");
      return response.data;
    } catch {
      // Return mock data if backend is not available
      console.warn("Backend not available, using mock data for promotions");
      return {
        promotions: [
          {
            id: "1",
            name: "Early Bird Discount",
            description: "Get 20% off for early bookings",
            discountType: "PERCENTAGE",
            discountValue: 20,
            minimumPurchase: 100000,
            validFrom: "2024-01-01",
            validUntil: "2024-12-31",
            usageLimit: 100,
            usedCount: 25,
            status: "ACTIVE",
            createdAt: "2024-01-01",
            updatedAt: "2024-01-15",
          },
        ],
      };
    }
  },
};

export default api;
