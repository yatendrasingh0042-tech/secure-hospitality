export interface EmergencyContactItem {
  id: string;
  name: string;
  relation: string;
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
  city?: string;
  state?: string;
  emergencyContacts: EmergencyContactItem[];
  preferences: UserPreferences;
  onboardingCompleted: boolean;
}
