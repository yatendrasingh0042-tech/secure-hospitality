export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DayAvailability {
  day: string; // e.g. "Today", "Tomorrow", "Wed, Aug 12"
  slots: TimeSlot[];
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  specialty?: string;
  subSpecialization: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  consultFee?: string | number;
  location: string;
  hospital: string;
  languages: string[];
  availability: "Available Today" | "Available Tomorrow" | "Next Available in 2 Days";
  gender: "Male" | "Female";
  education: string;
  about: string;
  services: string[];
  initials: string;
  avatarColor: string;
  availableSlots?: DayAvailability[];
}
