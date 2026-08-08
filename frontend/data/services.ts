export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: "CalendarCheck" | "Pill" | "Building2" | "Siren" | "FileText" | "Bell";
  badge: string;
  badgeVariant: "info" | "success" | "neutral" | "danger" | "warning";
  actionText: string;
  href: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "doctor-appointments",
    title: "Doctor Appointments",
    description: "Book video consultations or in-clinic visits with certified healthcare specialists.",
    iconName: "CalendarCheck",
    badge: "Instant Booking",
    badgeVariant: "info",
    actionText: "Book Doctor",
    href: "#doctors",
  },
  {
    id: "medicines",
    title: "Medicines",
    description: "Order prescription drugs, OTC healthcare supplies, and wellness products online.",
    iconName: "Pill",
    badge: "Express Delivery",
    badgeVariant: "success",
    actionText: "Order Medicines",
    href: "#medicines",
  },
  {
    id: "hospitals",
    title: "Find Hospitals",
    description: "Discover nearby medical centers, check real-time bed availability & facilities.",
    iconName: "Building2",
    badge: "Verified Beds",
    badgeVariant: "neutral",
    actionText: "Locate Hospitals",
    href: "#hospitals",
  },
  {
    id: "emergency",
    title: "Emergency Assistance",
    description: "One-tap emergency SOS hotline, ambulance dispatch, and rapid triage support.",
    iconName: "Siren",
    badge: "24/7 SOS",
    badgeVariant: "danger",
    actionText: "Get Emergency Help",
    href: "#emergency",
  },
  {
    id: "health-records",
    title: "Health Records",
    description: "Centralize your lab reports, medical history, and prescriptions in one place.",
    iconName: "FileText",
    badge: "Encrypted Storage",
    badgeVariant: "info",
    actionText: "View Records",
    href: "#health-management",
  },
  {
    id: "medication-reminders",
    title: "Medication Reminders",
    description: "Never miss a dose with personalized daily medicine schedules & notifications.",
    iconName: "Bell",
    badge: "Smart Schedule",
    badgeVariant: "warning",
    actionText: "Setup Reminders",
    href: "#health-management",
  },
];
