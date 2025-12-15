"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "attendee" | "staff" | "manager" | "owner";

interface RoleContextType {
  role: UserRole;
}

const RoleContext = createContext<RoleContextType | null>(null);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Replace hardcoded role with actual auth state from backend
  const [role, setRole] = useState<UserRole>("owner");
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
