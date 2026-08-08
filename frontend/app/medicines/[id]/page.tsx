"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Star,
  Pill,
  ShoppingBag,
  Plus,
  Minus,
  FileText,
  Building2,
  Package,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MedicineCard } from "@/components/medicines/MedicineCard";
import { PrescriptionModal } from "@/components/medicines/PrescriptionModal";
import { MEDICINES_DATA } from "@/data/medicines";
import { useCart } from "@/context/CartContext";
import { Medicine } from "@/types/medicine";

export default function MedicineDetailPage() {
  const params = useParams();
  const medicineId = params.id as string;

  const { items, addItem } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [rxModalMedicine, setRxModalMedicine] = useState<Medicine | null>(null);

  const medicine = MEDICINES_DATA.find((m) => m.id === medicineId);

  if (!medicine) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#0F172A]">Product Not Found</h2>
        <p className="text-sm text-[#64748B]">The requested medicine does not exist in our catalog.</p>
        <Button variant="primary" size="md" asChild>
          <Link href="/medicines">Back to Catalog</Link>
        </Button>
      </div>
    );
  }

  const cartItem = items.find((i) => i.medicine.id === medicine.id);
  const inCartQuantity = cartItem ? cartItem.quantity : 0;

  // Recommendations based on same category
  const relatedMedicines = MEDICINES_DATA.filter(
    (m) => m.category === medicine.category && m.id !== medicine.id
  ).slice(0, 3);

  const handleAddToCart = () => {
    if (medicine.requiresPrescription) {
      setRxModalMedicine(medicine);
    } else {
      addItem(medicine, selectedQuantity);
    }
  };

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-6 overflow-x-auto" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0F172A] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <Link href="/medicines" className="hover:text-[#0F172A] transition-colors">
            Medicines
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="font-semibold text-[#0F172A] truncate">{medicine.name}</span>
        </nav>

        {/* Product Details Hero Card */}
        <Card radius="xl" className="p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Visual Image Canvas */}
            <div className="lg:col-span-5">
              <div className="h-64 sm:h-80 w-full rounded-3xl bg-slate-50 border border-slate-200/80 flex items-center justify-center relative overflow-hidden">
                <div className={`h-24 w-24 rounded-3xl ${medicine.accentColor} text-white flex items-center justify-center shadow-lg`}>
                  <Pill className="h-12 w-12" />
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="neutral" size="sm">
                    {medicine.category}
                  </Badge>
                  {medicine.requiresPrescription && (
                    <Badge variant="warning" size="sm">
                      Prescription Required
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Right Specifications & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  {medicine.name}
                </h1>
                <p className="text-xs text-[#64748B] flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" /> By {medicine.manufacturer}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="h-3.5 w-3.5 text-slate-400" /> {medicine.packSize}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> {medicine.rating} ({medicine.reviewCount} reviews)
                  </span>
                </p>
              </div>

              {/* Price & Discounts */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#0F172A]">
                  ${medicine.price.toFixed(2)}
                </span>
                {medicine.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ${medicine.originalPrice.toFixed(2)}
                  </span>
                )}
                {medicine.discount && (
                  <Badge variant="success" size="sm">
                    Save {medicine.discount}%
                  </Badge>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-[#0F172A]">Product Information</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{medicine.description}</p>
              </div>

              {/* Tags list */}
              <div className="flex flex-wrap gap-2">
                {medicine.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-600">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Add to Cart Actions */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                {medicine.requiresPrescription ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100"
                    onClick={() => setRxModalMedicine(medicine)}
                    leftIcon={<FileText className="h-4 w-4 text-amber-600" />}
                  >
                    Upload Prescription Required
                  </Button>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Quantity Picker */}
                    <div className="flex items-center gap-3 p-1.5 rounded-xl border border-slate-200 bg-white">
                      <button
                        type="button"
                        onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                        className="h-9 w-9 rounded-lg bg-slate-100 text-[#0F172A] font-bold flex items-center justify-center hover:bg-slate-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-bold text-sm text-[#0F172A] px-2">{selectedQuantity}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedQuantity((q) => q + 1)}
                        className="h-9 w-9 rounded-lg bg-slate-100 text-[#0F172A] font-bold flex items-center justify-center hover:bg-slate-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:flex-1 justify-center"
                      onClick={handleAddToCart}
                      leftIcon={<ShoppingBag className="h-4 w-4" />}
                    >
                      {inCartQuantity > 0 ? `Add ${selectedQuantity} More to Cart (${inCartQuantity} in cart)` : `Add ${selectedQuantity} to Cart`}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* You May Also Like Recommendations */}
        {relatedMedicines.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0F172A]">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedMedicines.map((m) => (
                <MedicineCard
                  key={m.id}
                  medicine={m}
                  onUploadPrescription={(item) => setRxModalMedicine(item)}
                />
              ))}
            </div>
          </div>
        )}
      </PageContainer>

      <PrescriptionModal
        medicine={rxModalMedicine}
        isOpen={Boolean(rxModalMedicine)}
        onClose={() => setRxModalMedicine(null)}
      />
    </div>
  );
}
