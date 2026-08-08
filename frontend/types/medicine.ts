export interface Medicine {
  id: string;
  name: string;
  category: "Pain Relief" | "First Aid" | "Vitamins" | "Personal Care" | "Wellness" | "Cold & Allergy" | "Digestive Care" | "Health Devices";
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number; // e.g. 15 for 15% off
  manufacturer: string;
  packSize: string; // e.g. "10 Tablets", "200 ml Bottle", "1 Unit"
  dosage?: string;
  availability: "In Stock" | "Low Stock" | "Out of Stock";
  requiresPrescription: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  accentColor: string; // Tailwind color class for card icon badge
  iconName: string; // Lucide icon identifier
}
