import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export const useAuthToken = () => {
  const { getToken } = useAuth();

  const getAuthToken = async (): Promise<string | null> => {
    try {
      const token = await getToken();
      return token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  const setAuthToken = (token: string) => {
    try {
      localStorage.setItem("clerk-token", token);
    } catch (error) {
      console.warn("Could not store token in localStorage:", error);
    }
  };

  const clearAuthToken = () => {
    try {
      localStorage.removeItem("clerk-token");
    } catch (error) {
      console.warn("Could not clear token from localStorage:", error);
    }
  };

  // Update stored token when user changes
  useEffect(() => {
    const updateStoredToken = async () => {
      const token = await getAuthToken();
      if (token) {
        setAuthToken(token);
      } else {
        clearAuthToken();
      }
    };

    updateStoredToken();
  }, [getToken]);

  return {
    getAuthToken,
    setAuthToken,
    clearAuthToken,
  };
};
