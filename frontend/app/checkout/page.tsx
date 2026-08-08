"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Truck,
  CreditCard,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Banknote,
} from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();

  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const [deliveryOption, setDeliveryOption] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "card">("cod");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!deliveryInfo.fullName.trim()) errors.fullName = "Full Name is required";
    if (!deliveryInfo.phone.trim() || deliveryInfo.phone.length < 7) errors.phone = "Valid Phone number required";
    if (!deliveryInfo.address.trim()) errors.address = "Street Address is required";
    if (!deliveryInfo.city.trim()) errors.city = "City is required";
    if (!deliveryInfo.pinCode.trim()) errors.pinCode = "PIN/ZIP Code required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      router.push("/checkout/confirmation");
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#0F172A]">No items to checkout</h2>
        <p className="text-sm text-[#64748B]">Your cart is currently empty.</p>
        <Button variant="primary" size="md" asChild>
          <Link href="/medicines">Return to Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        {/* Navigation Link */}
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-8">
          Checkout & Delivery
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Checkout Steps Form */}
          <main className="lg:col-span-8 space-y-6">
            {/* Section 1: Delivery Address */}
            <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
              <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#2563EB]" /> 1. Delivery Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Jane Doe"
                  value={deliveryInfo.fullName}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })}
                  error={formErrors.fullName}
                />
                <Input
                  label="Phone Number *"
                  placeholder="e.g. +1 (555) 019-2834"
                  type="tel"
                  value={deliveryInfo.phone}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                  error={formErrors.phone}
                />
              </div>

              <Input
                label="Street Address *"
                placeholder="House No., Building Name, Street Name"
                value={deliveryInfo.address}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                error={formErrors.address}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City *"
                  placeholder="e.g. Central City"
                  value={deliveryInfo.city}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                  error={formErrors.city}
                />
                <Input
                  label="State"
                  placeholder="State/Province"
                  value={deliveryInfo.state}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, state: e.target.value })}
                />
                <Input
                  label="PIN / ZIP Code *"
                  placeholder="e.g. 10001"
                  value={deliveryInfo.pinCode}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, pinCode: e.target.value })}
                  error={formErrors.pinCode}
                />
              </div>
            </Card>

            {/* Section 2: Delivery Speed Option */}
            <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
              <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#2563EB]" /> 2. Delivery Option
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setDeliveryOption("standard")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    deliveryOption === "standard"
                      ? "bg-blue-50/80 border-[#2563EB] ring-2 ring-[#2563EB]"
                      : "bg-white border-[#E2E8F0] hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#0F172A]">Standard Delivery</span>
                    <Badge variant="success" size="sm">Free</Badge>
                  </div>
                  <p className="text-xs text-[#64748B]">Estimated delivery in 2–3 business days.</p>
                </div>

                <div
                  onClick={() => setDeliveryOption("express")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    deliveryOption === "express"
                      ? "bg-blue-50/80 border-[#2563EB] ring-2 ring-[#2563EB]"
                      : "bg-white border-[#E2E8F0] hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#0F172A]">Express Priority Delivery</span>
                    <span className="text-xs font-bold text-[#2563EB]">$4.99</span>
                  </div>
                  <p className="text-xs text-[#64748B]">Same-day or Next-morning doorstep dispatch.</p>
                </div>
              </div>
            </Card>

            {/* Section 3: Safe Payment Method */}
            <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
              <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#2563EB]" /> 3. Payment Method (Demo Only)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    paymentMethod === "cod"
                      ? "bg-blue-50/80 border-[#2563EB] ring-2 ring-[#2563EB]"
                      : "bg-white border-[#E2E8F0] hover:bg-slate-50"
                  }`}
                >
                  <Banknote className="h-5 w-5 text-emerald-600" />
                  <p className="font-bold text-xs text-[#0F172A]">Cash on Delivery</p>
                  <p className="text-[11px] text-[#64748B]">Pay cash upon delivery</p>
                </div>

                <div
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    paymentMethod === "upi"
                      ? "bg-blue-50/80 border-[#2563EB] ring-2 ring-[#2563EB]"
                      : "bg-white border-[#E2E8F0] hover:bg-slate-50"
                  }`}
                >
                  <QrCode className="h-5 w-5 text-indigo-600" />
                  <p className="font-bold text-xs text-[#0F172A]">UPI / QR Code</p>
                  <p className="text-[11px] text-[#64748B]">Instant mobile transfer</p>
                </div>

                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    paymentMethod === "card"
                      ? "bg-blue-50/80 border-[#2563EB] ring-2 ring-[#2563EB]"
                      : "bg-white border-[#E2E8F0] hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <p className="font-bold text-xs text-[#0F172A]">Credit / Debit Card</p>
                  <p className="text-[11px] text-[#64748B]">Demo card interface</p>
                </div>
              </div>

              {/* Safety notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#64748B] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>Safe Prototype Notice: Payment gateway integration will be available in future releases. No real payment data is collected.</span>
              </div>
            </Card>
          </main>

          {/* Persistent Order Summary Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            <OrderSummary showCheckoutButton={false} />

            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center"
              isLoading={isSubmitting}
              onClick={handlePlaceOrder}
              rightIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              {isSubmitting ? "Placing Order..." : "Place Demo Order"}
            </Button>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}
