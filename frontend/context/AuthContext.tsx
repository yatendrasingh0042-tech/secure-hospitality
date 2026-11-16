"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { User, UserPreferences, EmergencyContactItem } from "@/types/user";
import { apiRequest } from "@/lib/apiClient";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<boolean>;
  updateUser: (data: Partial<User>) => Promise<User | null>;
  addEmergencyContact: (contactData: { name: string; relation?: string; relationship?: string; phone: string }) => Promise<boolean>;
  updateEmergencyContact: (id: string, contactData: { name?: string; relation?: string; relationship?: string; phone?: string }) => Promise<boolean>;
  deleteEmergencyContact: (id: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  completeOnboarding: () => void;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const defaultPreferences: UserPreferences = {
  consultationType: "both",
  appointmentReminders: true,
  medicineReminders: true,
  orderUpdates: true,
  emergencyAlerts: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to map backend user object to frontend User interface
  const mapBackendUser = useCallback((bUser: any): User => {
    const rawDob = bUser.dateOfBirth
      ? typeof bUser.dateOfBirth === "string"
        ? bUser.dateOfBirth.split("T")[0]
        : new Date(bUser.dateOfBirth).toISOString().split("T")[0]
      : "";

    const mappedContacts: EmergencyContactItem[] = Array.isArray(bUser.emergencyContacts)
      ? bUser.emergencyContacts.map((c: any) => ({
          id: c._id ? c._id.toString() : c.id || `cnt-${Math.random().toString(36).substring(2, 6)}`,
          _id: c._id ? c._id.toString() : c.id,
          name: c.name || "",
          relation: c.relation || c.relationship || "",
          relationship: c.relationship || c.relation || "",
          phone: c.phone || "",
        }))
      : [];

    const formattedGender = (() => {
      const g = (bUser.gender || "").toLowerCase();
      if (g === "male") return "Male";
      if (g === "female") return "Female";
      if (g === "other") return "Other";
      return "Prefer not to say";
    })();

    return {
      id: bUser._id || bUser.id,
      firstName: bUser.firstName || "",
      lastName: bUser.lastName || "",
      email: bUser.email || "",
      phone: bUser.phone || "",
      avatar: bUser.avatar || "",
      dateOfBirth: rawDob,
      gender: formattedGender as any,
      address: bUser.address || "",
      city: bUser.city || "",
      state: bUser.state || "",
      country: bUser.country || "",
      emergencyContacts: mappedContacts,
      role: bUser.role || "patient",
      preferences: bUser.preferences || defaultPreferences,
      onboardingCompleted: true,
    };
  }, []);

  const refreshUser = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      const res = await apiRequest("/api/auth/me");
      if (res && res.success && res.user) {
        setUser(mapBackendUser(res.user));
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      console.warn("User refresh notice:", err.message);
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [mapBackendUser]);

  // Restore session from token on mount
  useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };

    restoreSession();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res && res.success && res.token && res.user) {
        localStorage.setItem("token", res.token);
        setUser(mapBackendUser(res.user));
        setIsAuthenticated(true);
        return true;
      }
      setError(res.message || "Invalid credentials.");
      return false;
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
      return false;
    }
  }, [mapBackendUser]);

  const register = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      password: string;
    }): Promise<boolean> => {
      setError(null);
      try {
        const res = await apiRequest("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (res && res.success && res.token && res.user) {
          localStorage.setItem("token", res.token);
          setUser(mapBackendUser(res.user));
          setIsAuthenticated(true);
          return true;
        }
        setError(res.message || "Registration failed.");
        return false;
      } catch (err: any) {
        setError(err.message || "Registration failed. Please try again.");
        return false;
      }
    },
    [mapBackendUser]
  );

  const updateUser = useCallback(async (data: Partial<User>): Promise<User | null> => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        const res = await apiRequest("/api/auth/me", {
          method: "PUT",
          body: JSON.stringify(data),
        });
        if (res && res.success && res.user) {
          const updated = mapBackendUser(res.user);
          setUser(updated);
          return updated;
        }
      } catch (err: any) {
        console.warn("Backend profile update sync notice:", err.message);
      }
    }
    return user;
  }, [mapBackendUser, user]);

  const addEmergencyContact = useCallback(
    async (contactData: { name: string; relation?: string; relationship?: string; phone: string }) => {
      const payload = {
        name: contactData.name,
        relationship: contactData.relationship || contactData.relation || "Family",
        phone: contactData.phone,
      };

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        try {
          const res = await apiRequest("/api/emergency-contacts", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          if (res && res.success && res.contacts) {
            const mappedContacts: EmergencyContactItem[] = res.contacts.map((c: any) => ({
              id: c._id || c.id,
              _id: c._id || c.id,
              name: c.name,
              relation: c.relation || c.relationship,
              relationship: c.relationship || c.relation,
              phone: c.phone,
            }));
            setUser((prev) => (prev ? { ...prev, emergencyContacts: mappedContacts } : null));
            return true;
          }
        } catch (err: any) {
          console.error("addEmergencyContact error:", err.message);
          throw err;
        }
      } else {
        const newContact: EmergencyContactItem = {
          id: `cnt-${Date.now()}`,
          name: contactData.name,
          relation: contactData.relation || contactData.relationship || "Family",
          phone: contactData.phone,
        };
        setUser((prev) => (prev ? { ...prev, emergencyContacts: [...(prev.emergencyContacts || []), newContact] } : null));
        return true;
      }
      return false;
    },
    []
  );

  const updateEmergencyContact = useCallback(
    async (id: string, contactData: { name?: string; relation?: string; relationship?: string; phone?: string }) => {
      const payload = {
        name: contactData.name,
        relationship: contactData.relationship || contactData.relation,
        phone: contactData.phone,
      };

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        try {
          const res = await apiRequest(`/api/emergency-contacts/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          });
          if (res && res.success && res.contacts) {
            const mappedContacts: EmergencyContactItem[] = res.contacts.map((c: any) => ({
              id: c._id || c.id,
              _id: c._id || c.id,
              name: c.name,
              relation: c.relation || c.relationship,
              relationship: c.relationship || c.relation,
              phone: c.phone,
            }));
            setUser((prev) => (prev ? { ...prev, emergencyContacts: mappedContacts } : null));
            return true;
          }
        } catch (err: any) {
          console.error("updateEmergencyContact error:", err.message);
          throw err;
        }
      } else {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                emergencyContacts: prev.emergencyContacts.map((c) =>
                  c.id === id || c._id === id
                    ? { ...c, ...contactData, relation: contactData.relation || c.relation }
                    : c
                ),
              }
            : null
        );
        return true;
      }
      return false;
    },
    []
  );

  const deleteEmergencyContact = useCallback(
    async (id: string) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        try {
          const res = await apiRequest(`/api/emergency-contacts/${id}`, {
            method: "DELETE",
          });
          if (res && res.success && res.contacts) {
            const mappedContacts: EmergencyContactItem[] = res.contacts.map((c: any) => ({
              id: c._id || c.id,
              _id: c._id || c.id,
              name: c.name,
              relation: c.relation || c.relationship,
              relationship: c.relationship || c.relation,
              phone: c.phone,
            }));
            setUser((prev) => (prev ? { ...prev, emergencyContacts: mappedContacts } : null));
            return true;
          }
        } catch (err: any) {
          console.error("deleteEmergencyContact error:", err.message);
          throw err;
        }
      } else {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                emergencyContacts: prev.emergencyContacts.filter((c) => c.id !== id && c._id !== id),
              }
            : null
        );
        return true;
      }
      return false;
    },
    []
  );

  const completeOnboarding = useCallback(() => {
    setUser((prev) => (prev ? { ...prev, onboardingCompleted: true } : null));
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    apiRequest("/api/auth/logout", { method: "POST" }).catch(() => {});
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isOnboarded = user ? user.onboardingCompleted : false;

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      isOnboarded,
      login,
      register,
      updateUser,
      addEmergencyContact,
      updateEmergencyContact,
      deleteEmergencyContact,
      refreshUser,
      completeOnboarding,
      logout,
      error,
      clearError,
    }),
    [
      isAuthenticated,
      isLoading,
      user,
      isOnboarded,
      login,
      register,
      updateUser,
      addEmergencyContact,
      updateEmergencyContact,
      deleteEmergencyContact,
      refreshUser,
      completeOnboarding,
      logout,
      error,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

