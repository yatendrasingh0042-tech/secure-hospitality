"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingBag } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { MedicineCard } from "./MedicineCard";
import { CartDrawer, CartItem } from "./CartDrawer";
import { MEDICINES_DATA, Medicine } from "@/data/medicines";

const CATEGORIES = ["All", "Pain Relief", "First Aid", "Vitamins", "Personal Care", "Wellness"];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const MedicinePreview: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredMedicines = MEDICINES_DATA.filter((med) => {
    const matchesCategory =
      selectedCategory === "All" || med.category === selectedCategory;
    const matchesQuery =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleAddToCart = (medicine: Medicine) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map((item) =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { medicine, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (medicineId: string) => {
    setCartItems((prev) => prev.filter((item) => item.medicine.id !== medicineId));
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section id="medicines" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <PageContainer>
        <SectionHeading
          eyebrow="Pharmacy & Essentials"
          heading="Medicines, made simpler."
          description="Browse authentic prescription medications, first-aid kits, and daily health supplements with home delivery."
          action={
            <Button
              variant="outline"
              size="md"
              leftIcon={<ShoppingBag className="h-4 w-4 text-[#10B981]" />}
              onClick={() => setIsCartOpen(true)}
            >
              View Cart ({totalCartCount})
            </Button>
          }
        />

        {/* Filter Controls: Search & Category Pills */}
        <div className="space-y-4 mb-8">
          <div className="max-w-md">
            <Input
              placeholder="Search medicines, vitamins, first-aid supplies..."
              leftIcon={<Search className="h-4 w-4 text-[#64748B]" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-[#10B981] text-white shadow-xs"
                    : "bg-slate-100 text-[#64748B] hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Medicine Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {filteredMedicines.map((medicine) => {
            const isAdded = cartItems.some((item) => item.medicine.id === medicine.id);
            return (
              <motion.div key={medicine.id} variants={fadeInUp}>
                <MedicineCard
                  medicine={medicine}
                  isAdded={isAdded}
                  onAddToCart={handleAddToCart}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </PageContainer>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
      />
    </section>
  );
};
