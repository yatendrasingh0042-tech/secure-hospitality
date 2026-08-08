"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

interface OrderSummaryProps {
  showCheckoutButton?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  showCheckoutButton = true,
}) => {
  const { subtotal, discountTotal, estimatedDeliveryFee, grandTotal, totalItemCount } = useCart();

  return (
    <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-5 sticky top-24 shadow-xs">
      <h3 className="font-bold text-base text-[#0F172A] pb-3 border-b border-slate-100 flex items-center justify-between">
        <span>Order Summary</span>
        <span className="text-xs font-normal text-[#64748B]">{totalItemCount} items</span>
      </h3>

      <div className="space-y-3 text-xs text-[#64748B]">
        <div className="flex justify-between items-center">
          <span>Items Subtotal</span>
          <span className="font-semibold text-[#0F172A]">${subtotal.toFixed(2)}</span>
        </div>

        {discountTotal > 0 && (
          <div className="flex justify-between items-center text-emerald-600">
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" /> Product Savings
            </span>
            <span className="font-bold">-${discountTotal.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>Estimated Delivery</span>
          {estimatedDeliveryFee === 0 ? (
            <span className="font-bold text-emerald-600 uppercase text-[10px]">Free</span>
          ) : (
            <span className="font-semibold text-[#0F172A]">${estimatedDeliveryFee.toFixed(2)}</span>
          )}
        </div>

        {subtotal > 0 && subtotal < 40 && (
          <p className="text-[11px] text-[#2563EB] bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
            Add ${(40 - subtotal).toFixed(2)} more for <strong>Free Express Delivery</strong>!
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
        <span className="text-sm font-bold text-[#0F172A]">Total Amount</span>
        <span className="text-xl font-extrabold text-[#2563EB]">${grandTotal.toFixed(2)}</span>
      </div>

      {showCheckoutButton && (
        <Button
          variant="primary"
          size="lg"
          className="w-full justify-between"
          disabled={totalItemCount === 0}
          asChild
        >
          <Link href="/checkout">
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}

      <div className="flex items-center gap-2 text-[11px] text-[#64748B] pt-1">
        <ShieldCheck className="h-4 w-4 text-[#10B981] shrink-0" />
        <span>Guaranteed authentic products & secure delivery</span>
      </div>
    </Card>
  );
};
