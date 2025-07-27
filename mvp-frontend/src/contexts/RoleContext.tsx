"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";

type UserRole = "CUSTOMER" | "ORGANIZER";

interface RoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isOrganizer: boolean;
  isCustomer: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<UserRole>("CUSTOMER");
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client side before accessing localStorage
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load role from localStorage on mount
  useEffect(() => {
    if (isClient && isLoaded && user) {
      try {
        const savedRole = localStorage.getItem(`userRole_${user.id}`);
        if (
          savedRole &&
          (savedRole === "CUSTOMER" || savedRole === "ORGANIZER")
        ) {
          setUserRole(savedRole as UserRole);
        }
      } catch (error) {
        console.warn("Failed to load role from localStorage:", error);
      }
    }
  }, [isClient, isLoaded, user]);

  // Save role to localStorage when it changes
  useEffect(() => {
    if (isClient && user) {
      try {
        localStorage.setItem(`userRole_${user.id}`, userRole);
      } catch (error) {
        console.warn("Failed to save role to localStorage:", error);
      }
    }
  }, [userRole, user, isClient]);

  const isOrganizer = userRole === "ORGANIZER";
  const isCustomer = userRole === "CUSTOMER";

  return (
    <RoleContext.Provider
      value={{
        userRole,
        setUserRole,
        isOrganizer,
        isCustomer,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
