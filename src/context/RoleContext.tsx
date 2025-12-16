"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole = "attendee" | "staff" | "manager" | "owner";

interface RoleContextType {
  role: UserRole;
}

const RoleContext = createContext<RoleContextType | null>(null);

// Mock function to get user role from authentication state
const getUserRoleFromAuth = (): UserRole => {
  return "owner";
};




export const RoleProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Replace hardcoded role with actual auth state from backend
  const [role, setRole] = useState<UserRole>("attendee");
  useEffect(() => {
    const fetchedRole = getUserRoleFromAuth();
    setRole(fetchedRole);
  }, []);
  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
