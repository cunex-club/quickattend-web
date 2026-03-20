"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "attendee" | "staff" | "manager" | "owner";

interface RoleContextType {
  role: UserRole;
}

const RoleContext = createContext<RoleContextType | null>(null);

interface RoleProviderProps {
  children: ReactNode;
  initialRole?: UserRole;
}

export const RoleProvider = ({
  children,
  initialRole = "attendee",
}: RoleProviderProps) => {
  const [role] = useState<UserRole>(initialRole);

  return (
    <RoleContext.Provider value={{ role }}>{children}</RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
