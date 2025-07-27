// Environment configuration
export const config = {
  // API Configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",

  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Feature flags
  features: {
    // In development, we use mock data when backend is not available
    useMockData: process.env.NODE_ENV === "development",

    // In production, we require real API responses
    requireRealAPI: process.env.NODE_ENV === "production",
  },

  // Error handling
  errorHandling: {
    // Suppress 401 errors in development
    suppressUnauthorized: process.env.NODE_ENV === "development",

    // Show detailed error messages in development
    showDetailedErrors: process.env.NODE_ENV === "development",
  },
};
