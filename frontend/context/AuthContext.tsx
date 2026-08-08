"use client";

import React, { createContext, useContext, useState } from "react";
import { User, UserPreferences, EmergencyContactItem } from "@/types/user";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { firstName: string; lastName: string; email: string; phone: string }) => Promise<boolean>;
  updateUser: (data: Partial<User>) => void;
  completeOnboarding: () => void;
  logout: () => void;
}

const defaultPreferences: UserPreferences = {
  consultationType: "both",
  appointmentReminders: true,
  medicineReminders: true,
  orderUpdates: true,
  emergencyAlerts: true,
};

const defaultEmergencyContacts: EmergencyContactItem[] = [
  { id: "cnt-1", name: "Mother (Primary)", relation: "Parent", phone: "+91 98765 43210" },
  { id: "cnt-2", name: "Father", relation: "Parent", phone: "+91 98123 45678" },
];

const mockDefaultUser: User = {
  id: "usr-94820",
  firstName: "Yatendra",
  lastName: "Singh",
  email: "yatendra@example.com",
  phone: "+91 98765 43210",
  dateOfBirth: "1994-08-15",
  gender: "Male",
  city: "Central City",
  state: "Haryana",
  emergencyContacts: defaultEmergencyContacts,
  preferences: defaultPreferences,
  onboardingCompleted: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const isOnboarded = user ? user.onboardingCompleted : false;

  const login = async (email: string): Promise<boolean> => {
    // Simulated demo login
    const loggedInUser: User = {
      ...mockDefaultUser,
      email: email || mockDefaultUser.email,
    };
    setUser(loggedInUser);
    setIsAuthenticated(true);
    return true;
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }): Promise<boolean> => {
    // Simulated demo registration
    const newUser: User = {
      id: `usr-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      emergencyContacts: defaultEmergencyContacts,
      preferences: defaultPreferences,
      onboardingCompleted: false,
    };
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const completeOnboarding = () => {
    if (user) {
      setUser({ ...user, onboardingCompleted: true });
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isOnboarded,
        login,
        register,
        updateUser,
        completeOnboarding,
        logout,
      }}
    >
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
