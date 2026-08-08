"use client";

import React from "react";
import Link from "next/link";
import { Package, Truck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const RecentOrders: React.FC = () => {
  return (
    <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
          <Package className="h-5 w-5 text-emerald-600" /> Recent Medicine Orders
        </h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/medicines">Shop More</Link>
        </Button>
      </div>

      <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#0F172A]">Order #SH-2026-001</span>
            <Badge variant="warning" size="sm" showDot>
              Processing Order
            </Badge>
          </div>
          <p className="text-xs text-[#64748B]">
            3 items (Advanced PainRelief Extra 500mg, Multivitamin Complex, Cetirizine 10mg)
          </p>
          <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
            <Truck className="h-3.5 w-3.5" /> Estimated Delivery: Tomorrow, 2:00 PM
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-sm font-extrabold text-[#0F172A]">₹749</span>
          <Button variant="outline" size="sm" className="mt-2 block" asChild>
            <Link href="/cart">Order Details</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
