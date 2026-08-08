export interface HospitalDepartment {
  name: string;
  doctorCount: number;
  iconName: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: string; // e.g. "Multi-Specialty Trauma Center", "General Hospital"
  rating: number;
  reviewsCount: number;
  location: string;
  district: string;
  distanceKm: number;
  isOpen247: boolean;
  emergencyAvailable: boolean;
  icuBedsAvailable: number;
  generalBedsAvailable: number;
  emergencyPhone: string;
  description: string;
  departments: HospitalDepartment[];
  services: string[];
  facilities: string[];
  features?: string[];
  doctorsCount: number;
  accentColor: string;
}
