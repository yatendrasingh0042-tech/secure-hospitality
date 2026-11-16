export interface EmergencyContactItem {
  id: string;
  _id?: string;
  name: string;
  relation: string;
  relationship?: string;
  phone: string;
}

export interface UserPreferences {
  consultationType: "in_person" | "video" | "both";
  appointmentReminders: boolean;
  medicineReminders: boolean;
  orderUpdates: boolean;
  emergencyAlerts: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other" | "Prefer not to say";
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  emergencyContacts: EmergencyContactItem[];
  role?: string;
  preferences: UserPreferences;
  onboardingCompleted: boolean;
}

