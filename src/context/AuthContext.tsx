"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "attendee" | "staff" | "manager" | "owner";

interface AuthContextType {
  role: UserRole;
  // ... user, isLoading, login(), logout()
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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