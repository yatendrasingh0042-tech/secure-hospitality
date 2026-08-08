"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Medicine } from "@/types/medicine";

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (medicine: Medicine, quantity?: number) => void;
  removeItem: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discountTotal: number;
  estimatedDeliveryFee: number;
  grandTotal: number;
  totalItemCount: number;
  toastMessage: string | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const addItem = (medicine: Medicine, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.medicine.id === medicine.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prevItems, { medicine, quantity }];
    });
    setToastMessage(`Added "${medicine.name}" to your cart.`);
  };

  const removeItem = (medicineId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.medicine.id !== medicineId));
  };

  const updateQuantity = (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(medicineId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.medicine.id === medicineId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const dismissToast = () => {
    setToastMessage(null);
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.medicine.price * item.quantity, 0);
  const discountTotal = items.reduce((acc, item) => {
    if (item.medicine.originalPrice) {
      const savings = (item.medicine.originalPrice - item.medicine.price) * item.quantity;
      return acc + savings;
    }
    return acc;
  }, 0);

  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const estimatedDeliveryFee = subtotal > 0 ? (subtotal >= 40 ? 0 : 4.99) : 0;
  const grandTotal = subtotal + estimatedDeliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        discountTotal,
        estimatedDeliveryFee,
        grandTotal,
        totalItemCount,
        toastMessage,
        dismissToast,
      }}
    >
      {children}
      {/* Global Accessible Cart Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          <span className="h-2 w-2 rounded-full bg-[#10B981]" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={dismissToast}
            className="text-slate-400 hover:text-white ml-2 text-sm font-bold"
          >
            ×
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
