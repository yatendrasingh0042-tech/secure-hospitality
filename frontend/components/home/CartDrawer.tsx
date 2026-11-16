"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Medicine } from "@/data/medicines";
import { formatCurrency } from "@/lib/formatCurrency";

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (medicineId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearCart,
}) => {
  const [checkoutSimulated, setCheckoutSimulated] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.medicine.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setCheckoutSimulated(true);
    setTimeout(() => {
      setCheckoutSimulated(false);
      onClearCart();
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-emerald-100 text-[#10B981] flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#0F172A]">Medicine Cart</h3>
                    <p className="text-xs text-[#64748B]">{items.length} items added</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {items.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-[#0F172A]">Your cart is empty</p>
                  <p className="text-xs text-[#64748B]">Add medicines from the catalog to build your order.</p>
                </div>
              ) : (
                <div className="py-4 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.medicine.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#0F172A]">{item.medicine.name}</p>
                        <p className="text-[11px] text-[#64748B]">{item.medicine.dosage}</p>
                        <p className="font-semibold text-[#10B981] mt-1">
                          {formatCurrency(item.medicine.price)} × {item.quantity}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.medicine.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-[#0F172A]">
                  <span>Total Estimated Cost</span>
                  <span className="text-lg text-[#10B981]">{formatCurrency(subtotal)}</span>
                </div>

                {checkoutSimulated ? (
                  <div className="py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                    <span>Order Simulation Placed!</span>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center bg-[#10B981] hover:bg-emerald-600"
                    onClick={handleCheckout}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Simulate Order Checkout
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
