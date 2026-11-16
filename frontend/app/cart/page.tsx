"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Pill } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { MedicineCard } from "@/components/medicines/MedicineCard";
import { useCart } from "@/context/CartContext";
import { MEDICINES_DATA } from "@/data/medicines";
import { formatCurrency } from "@/lib/formatCurrency";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalItemCount } = useCart();

  const recommendedMedicines = MEDICINES_DATA.slice(0, 3);

  if (items.length === 0) {
    return (
      <div className="py-16 lg:py-24 bg-[#F8FAFC] min-h-screen">
        <PageContainer>
          <div className="max-w-md mx-auto text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
            <div className="h-20 w-20 rounded-3xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto border border-blue-100">
              <ShoppingBag className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#0F172A]">Your cart is empty</h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Explore healthcare essentials, vitamins, first aid kits, and everyday wellness products.
              </p>
            </div>

            <Button variant="primary" size="lg" className="w-full justify-center" asChild>
              <Link href="/medicines">Browse Medicines Catalog</Link>
            </Button>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        {/* Navigation Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/medicines"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Catalog
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-8">
          Shopping Cart ({totalItemCount} {totalItemCount === 1 ? "item" : "items"})
        </h1>

        {/* Layout Grid: Item List + Persistent Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Cart Item List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map(({ medicine, quantity }) => (
              <Card
                key={medicine.id}
                radius="xl"
                className="p-4 sm:p-5 bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 truncate">
                  <div className={`h-14 w-14 rounded-2xl ${medicine.accentColor} text-white flex items-center justify-center shrink-0`}>
                    <Pill className="h-7 w-7" />
                  </div>
                  <div className="truncate space-y-1">
                    <Link href={`/medicines/${medicine.id}`} className="font-bold text-sm text-[#0F172A] hover:text-[#2563EB] transition-colors truncate block">
                      {medicine.name}
                    </Link>
                    <p className="text-xs text-[#64748B]">
                      {medicine.packSize} · {formatCurrency(medicine.price)} each
                    </p>
                    {medicine.requiresPrescription && (
                      <Badge variant="warning" size="sm">
                        Prescription Attached
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => updateQuantity(medicine.id, quantity - 1)}
                      className="h-7 w-7 rounded-lg bg-white text-[#0F172A] font-bold flex items-center justify-center hover:bg-slate-200"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-bold text-[#0F172A] px-2">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(medicine.id, quantity + 1)}
                      className="h-7 w-7 rounded-lg bg-white text-[#0F172A] font-bold flex items-center justify-center hover:bg-slate-200"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <p className="font-extrabold text-base text-[#0F172A]">
                      {formatCurrency(medicine.price * quantity)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(medicine.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar Order Summary */}
          <div className="lg:col-span-4 w-full">
            <OrderSummary showCheckoutButton />
          </div>
        </div>

        {/* You May Also Like Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#0F172A]">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendedMedicines.map((m) => (
              <MedicineCard key={m.id} medicine={m} />
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
