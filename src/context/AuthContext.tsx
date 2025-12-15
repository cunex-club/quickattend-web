"use client";
import { createContext, useContext, useState, ReactNode } from "react";

/**
 * User role types for authorization
 */
export type UserRole = "attendee" | "staff" | "manager" | "owner";

interface AuthContextType {
  role: UserRole;
  // Future additions:
  // user: User | null;
  // isLoading: boolean;
  // login: (credentials: LoginCredentials) => Promise<void>;
  // logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Replace hardcoded role with actual auth state from backend
  const [role, setRole] = useState<UserRole>("owner");

  return (
    <AuthContext.Provider value={{ role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};