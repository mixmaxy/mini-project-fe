import axios from "axios";

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
api.interceptors.request.use((config) => {
  // For now, we'll handle auth differently since we're using Clerk
  // This will be updated when we integrate with our backend auth
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
    const response = await api.get("/events", { params });
    return response.data;
  },

  // Get single event by ID
  getEvent: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create event (organizer only)
  createEvent: async (data: any) => {
    const response = await api.post("/events", data);
    return response.data;
  },

  // Update event (organizer only)
  updateEvent: async (id: string, data: any) => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  // Delete event (organizer only)
  deleteEvent: async (id: string) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Get organizer's events
  getOrganizerEvents: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get("/events/organizer/my-events", { params });
    return response.data;
  },
};

// Transaction API calls
export const transactionAPI = {
  // Create transaction
  createTransaction: async (data: any) => {
    const response = await api.post("/transactions", data);
    return response.data;
  },

  // Get user transactions
  getUserTransactions: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get("/transactions/user/my-transactions", {
      params,
    });
    return response.data;
  },

  // Get organizer sales
  getOrganizerSales: async (params?: {
    page?: number;
    limit?: number;
    eventId?: string;
  }) => {
    const response = await api.get("/transactions/organizer/sales", { params });
    return response.data;
  },
};

// Review API calls
export const reviewAPI = {
  // Create review
  createReview: async (data: any) => {
    const response = await api.post("/reviews", data);
    return response.data;
  },

  // Update review
  updateReview: async (id: string, data: any) => {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },

  // Delete review
  deleteReview: async (id: string) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  // Get event reviews
  getEventReviews: async (
    eventId: string,
    params?: { page?: number; limit?: number }
  ) => {
    const response = await api.get(`/reviews/event/${eventId}`, { params });
    return response.data;
  },
};

// Dashboard API calls
export const dashboardAPI = {
  // Get organizer stats
  getOrganizerStats: async (period?: "day" | "month" | "year") => {
    const response = await api.get("/dashboard/organizer/stats", {
      params: { period },
    });
    return response.data;
  },

  // Get customer stats
  getCustomerStats: async () => {
    const response = await api.get("/dashboard/customer/stats");
    return response.data;
  },
};

// Promotion API calls
export const promotionAPI = {
  // Create promotion
  createPromotion: async (data: any) => {
    const response = await api.post("/promotions", data);
    return response.data;
  },

  // Get organizer promotions
  getOrganizerPromotions: async () => {
    const response = await api.get("/promotions/organizer/my-promotions");
    return response.data;
  },
};

export default api;
