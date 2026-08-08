"use client";

import React from "react";
import Link from "next/link";
import {
  Pill,
  HeartPulse,
  Cross,
  Sparkles,
  Shield,
  Wind,
  Activity,
  Moon,
  Brain,
  ShieldAlert,
  Star,
  Plus,
  Minus,
  FileText,
  ShoppingBag,
} from "lucide-react";

import { Medicine } from "@/types/medicine";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Pill: Pill,
  HeartPulse: HeartPulse,
  Cross: Cross,
  Sparkles: Sparkles,
  Shield: Shield,
  Wind: Wind,
  Activity: Activity,
  Moon: Moon,
  Brain: Brain,
  ShieldAlert: ShieldAlert,
};

interface MedicineCardProps {
  medicine: Medicine;
  onUploadPrescription?: (medicine: Medicine) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onUploadPrescription,
}) => {
  const { items, addItem, updateQuantity } = useCart();

  const cartItem = items.find((i) => i.medicine.id === medicine.id);
  const inCartQuantity = cartItem ? cartItem.quantity : 0;

  const IconComponent = iconMap[medicine.iconName] || Pill;

  return (
    <Card
      variant="interactive"
      radius="xl"
      className="h-full flex flex-col justify-between border border-[#E2E8F0] hover:border-blue-200 group overflow-hidden bg-white"
    >
      <CardHeader className="space-y-3 p-5">
        {/* Category & Badge Header */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="neutral" size="sm">
            {medicine.category}
          </Badge>
          {medicine.requiresPrescription ? (
            <Badge variant="warning" size="sm">
              Prescription Req.
            </Badge>
          ) : medicine.discount ? (
            <Badge variant="success" size="sm">
              {medicine.discount}% OFF
            </Badge>
          ) : null}
        </div>

        {/* Product Visual Icon Canvas */}
        <Link href={`/medicines/${medicine.id}`} className="block">
          <div className="h-32 w-full rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden group-hover:scale-102 transition-transform duration-200">
            <div className={`h-14 w-14 rounded-2xl ${medicine.accentColor} text-white flex items-center justify-center shadow-md`}>
              <IconComponent className="h-7 w-7" />
            </div>
            <span className="absolute bottom-2 right-2 text-[10px] font-semibold text-[#64748B] bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-200">
              {medicine.packSize}
            </span>
          </div>
        </Link>

        {/* Title & Brand */}
        <div>
          <Link href={`/medicines/${medicine.id}`} className="block group-hover:text-[#2563EB] transition-colors">
            <CardTitle className="text-base font-bold text-[#0F172A] line-clamp-1">
              {medicine.name}
            </CardTitle>
          </Link>
          <p className="text-xs text-[#64748B] mt-0.5">By {medicine.manufacturer}</p>
        </div>

        {/* Ratings & Meta */}
        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>{medicine.rating}</span>
          </span>
          <span>({medicine.reviewCount} reviews)</span>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-4">
        {/* Price display */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-[#0F172A]">
            ${medicine.price.toFixed(2)}
          </span>
          {medicine.originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              ${medicine.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action CTAs */}
        {medicine.requiresPrescription ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center border-amber-300 text-amber-800 hover:bg-amber-50"
            onClick={() => onUploadPrescription && onUploadPrescription(medicine)}
            leftIcon={<FileText className="h-3.5 w-3.5 text-amber-600" />}
          >
            Upload Rx
          </Button>
        ) : inCartQuantity > 0 ? (
          <div className="flex items-center justify-between p-1 rounded-xl bg-blue-50 border border-blue-200 text-xs">
            <button
              type="button"
              onClick={() => updateQuantity(medicine.id, inCartQuantity - 1)}
              className="h-8 w-8 rounded-lg bg-white text-[#2563EB] font-bold flex items-center justify-center shadow-2xs hover:bg-blue-100"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="font-bold text-[#0F172A] px-2">{inCartQuantity} in cart</span>
            <button
              type="button"
              onClick={() => updateQuantity(medicine.id, inCartQuantity + 1)}
              className="h-8 w-8 rounded-lg bg-white text-[#2563EB] font-bold flex items-center justify-center shadow-2xs hover:bg-blue-100"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            className="w-full justify-center"
            onClick={() => addItem(medicine, 1)}
            leftIcon={<ShoppingBag className="h-3.5 w-3.5" />}
          >
            Add to Cart
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
