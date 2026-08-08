export interface HealthRecord {
  id: string;
  title: string;
  category: "Prescriptions" | "Lab Reports" | "Medical Documents" | "Vaccination Records" | "Visit Summaries";
  doctorName: string;
  facilityName: string;
  date: string;
  fileType: "PDF" | "JPG" | "PNG";
  fileSize: string;
  summary: string;
  downloadUrl: string;
  accentColor: string;
}

export const HEALTH_RECORDS_DATA: HealthRecord[] = [
  {
    id: "rec-001",
    title: "Complete Blood Count (CBC) & Lipid Profile",
    category: "Lab Reports",
    doctorName: "Dr. Ananya Sharma",
    facilityName: "City Care Hospital",
    date: "August 5, 2026",
    fileType: "PDF",
    fileSize: "1.4 MB",
    summary: "Routine annual blood work panel showing normal lipid levels and healthy hemoglobin count.",
    downloadUrl: "#",
    accentColor: "bg-blue-500",
  },
  {
    id: "rec-002",
    title: "Cardiology Prescription & EKG Notes",
    category: "Prescriptions",
    doctorName: "Dr. Ananya Sharma",
    facilityName: "City Care Hospital",
    date: "July 28, 2026",
    fileType: "PDF",
    fileSize: "850 KB",
    summary: "Follow-up prescription for cardiac checkup and recommended daily hydration routine.",
    downloadUrl: "#",
    accentColor: "bg-emerald-500",
  },
  {
    id: "rec-003",
    title: "COVID-19 Booster Vaccination Certificate",
    category: "Vaccination Records",
    doctorName: "Dr. Rajesh Varma",
    facilityName: "Metro General Hospital",
    date: "March 12, 2026",
    fileType: "PDF",
    fileSize: "420 KB",
    summary: "Official record of precautionary booster dose administration with QR verification marker.",
    downloadUrl: "#",
    accentColor: "bg-purple-500",
  },
  {
    id: "rec-004",
    title: "Orthopedic Knee MRI Scan Report",
    category: "Lab Reports",
    doctorName: "Dr. Vikramaditya Rao",
    facilityName: "Apex Specialty Hospital",
    date: "January 15, 2026",
    fileType: "JPG",
    fileSize: "3.2 MB",
    summary: "High-resolution knee joint MRI imaging showing minor cartilage strain and physio recommendations.",
    downloadUrl: "#",
    accentColor: "bg-amber-500",
  },
  {
    id: "rec-005",
    title: "Dermatology Initial Consultation Summary",
    category: "Visit Summaries",
    doctorName: "Dr. Meera Nambiar",
    facilityName: "Skin & Wellness Clinic",
    date: "November 20, 2025",
    fileType: "PDF",
    fileSize: "920 KB",
    summary: "Comprehensive skin health evaluation summary with prescribed topical moisturizer regimen.",
    downloadUrl: "#",
    accentColor: "bg-rose-500",
  },
];
