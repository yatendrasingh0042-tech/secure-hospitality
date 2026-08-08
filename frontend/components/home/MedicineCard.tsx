"use client";

import React from "react";
import { Pill, Plus, Check, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Medicine } from "@/data/medicines";

interface MedicineCardProps {
  medicine: Medicine;
  isAdded: boolean;
  onAddToCart: (medicine: Medicine) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  isAdded,
  onAddToCart,
}) => {
  return (
    <Card variant="interactive" radius="xl" className="h-full flex flex-col justify-between border border-[#E2E8F0] hover:border-emerald-200">
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center border border-emerald-100">
            <Pill className="h-5 w-5" />
          </div>
          <Badge variant="neutral" size="sm">
            {medicine.category}
          </Badge>
        </div>

        <CardTitle className="text-base font-bold text-[#0F172A] line-clamp-1">
          {medicine.name}
        </CardTitle>
        <p className="text-xs text-[#64748B] mt-0.5">{medicine.dosage}</p>
        <p className="text-xs text-[#64748B] line-clamp-2 mt-2 leading-relaxed">
          {medicine.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between py-2 border-t border-slate-100 text-xs mb-3">
          <div className="flex items-center gap-1 font-semibold text-[#0F172A]">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>{medicine.rating}</span>
          </div>
          <Badge variant="success" size="sm">
            In Stock
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold text-[#0F172A]">
              ${medicine.price.toFixed(2)}
            </span>
            {medicine.originalPrice && (
              <span className="text-xs text-slate-400 line-through ml-1.5 font-medium">
                ${medicine.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <Button
            variant={isAdded ? "secondary" : "primary"}
            size="sm"
            onClick={() => onAddToCart(medicine)}
            leftIcon={isAdded ? <Check className="h-3.5 w-3.5 text-[#10B981]" /> : <Plus className="h-3.5 w-3.5" />}
            className={isAdded ? "bg-emerald-50 text-[#10B981] border border-emerald-200" : "bg-[#10B981] hover:bg-emerald-600 text-white"}
          >
            {isAdded ? "Added" : "Add"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
