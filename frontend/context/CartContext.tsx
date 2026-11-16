"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Medicine } from "@/types/medicine";
import { apiRequest } from "@/lib/apiClient";

import { calculateDeliveryCharge, DeliveryMethod } from "@/lib/pricing/deliveryPricing";

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (medicine: Medicine, quantity?: number) => Promise<void>;
  removeItem: (medicineId: string) => Promise<void>;
  updateQuantity: (medicineId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: (deliveryAddress: any) => Promise<any>;
  subtotal: number;
  discountTotal: number;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  estimatedDeliveryFee: number;
  grandTotal: number;
  totalItemCount: number;
  toastMessage: string | null;
  dismissToast: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load cart from backend on mount if token exists
  useEffect(() => {
    const fetchBackendCart = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      try {
        const res = await apiRequest("/api/cart");
        if (res && res.success && res.data && Array.isArray(res.data.items)) {
          const mappedItems: CartItem[] = res.data.items.map((it: any) => ({
            medicine: {
              id: it.medicineId._id || it.medicineId.id || it.medicineId,
              name: it.medicineId.name || "Medicine",
              category: it.medicineId.category || "General",
              price: it.medicineId.price || 100,
              originalPrice: it.medicineId.originalPrice || (it.medicineId.price ? it.medicineId.price * 1.2 : 120),
              inStock: it.medicineId.stock ? it.medicineId.stock > 0 : true,
              prescriptionRequired: it.medicineId.prescriptionRequired || false,
              dosage: it.medicineId.strength || "500mg",
              manufacturer: it.medicineId.manufacturer || "Pharma",
              description: it.medicineId.description || "",
              rating: 4.5,
              reviewsCount: 12,
            },
            quantity: it.quantity,
          }));
          setItems(mappedItems);
        }
      } catch (err) {
        // Fallback silently if offline/unauthenticated
      }
    };

    fetchBackendCart();
  }, []);

  const addItem = useCallback(async (medicine: Medicine, quantity: number = 1) => {
    // Local optimistic update
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

    // Sync to backend if authenticated
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        await apiRequest("/api/cart", {
          method: "POST",
          body: JSON.stringify({ medicineId: medicine.id, quantity }),
        });
      } catch (err) {
        console.warn("Backend cart sync notice:", err);
      }
    }
  }, []);

  const removeItem = useCallback(async (medicineId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.medicine.id !== medicineId));

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        await apiRequest(`/api/cart/items/${medicineId}`, { method: "DELETE" });
      } catch (err) {
        console.warn("Backend cart remove notice:", err);
      }
    }
  }, []);

  const updateQuantity = useCallback(
    async (medicineId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeItem(medicineId);
        return;
      }
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.medicine.id === medicineId ? { ...item, quantity } : item
        )
      );

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        try {
          await apiRequest("/api/cart", {
            method: "POST",
            body: JSON.stringify({ medicineId, quantity }),
          });
        } catch (err) {
          console.warn("Backend cart update notice:", err);
        }
      }
    },
    [removeItem]
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        await apiRequest("/api/cart", { method: "DELETE" });
      } catch (err) {
        console.warn("Backend clear cart notice:", err);
      }
    }
  }, []);

  const checkout = useCallback(
    async (deliveryAddress: any) => {
      setIsLoading(true);
      try {
        const payload = {
          items: items.map((it) => ({
            medicineId: it.medicine.id,
            quantity: it.quantity,
          })),
          deliveryAddress,
        };

        const res = await apiRequest("/api/orders", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (res && res.success) {
          await clearCart();
          setToastMessage("Order placed successfully!");
          return res.data;
        }
        throw new Error(res.message || "Failed to place order.");
      } catch (err: any) {
        setToastMessage(err.message || "Checkout failed.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [items, clearCart]
  );

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Calculations
  const { subtotal, discountTotal, totalItemCount } = useMemo(() => {
    let sub = 0;
    let disc = 0;
    let count = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      sub += item.medicine.price * item.quantity;
      count += item.quantity;
      if (item.medicine.originalPrice) {
        disc += (item.medicine.originalPrice - item.medicine.price) * item.quantity;
      }
    }

    return { subtotal: sub, discountTotal: disc, totalItemCount: count };
  }, [items]);

  const estimatedDeliveryFee = calculateDeliveryCharge(subtotal, deliveryMethod);
  const grandTotal = subtotal + estimatedDeliveryFee;

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      checkout,
      subtotal,
      discountTotal,
      deliveryMethod,
      setDeliveryMethod,
      estimatedDeliveryFee,
      grandTotal,
      totalItemCount,
      toastMessage,
      dismissToast,
      isLoading,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      checkout,
      subtotal,
      discountTotal,
      deliveryMethod,
      setDeliveryMethod,
      estimatedDeliveryFee,
      grandTotal,
      totalItemCount,
      toastMessage,
      dismissToast,
      isLoading,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
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
