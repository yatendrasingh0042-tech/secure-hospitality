"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, PhoneCall, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MobileNav, NavItem } from "./MobileNav";
import { PageContainer } from "./PageContainer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Doctors", href: "/doctors" },
  { label: "Hospitals", href: "/hospitals" },
  { label: "Appointments", href: "/appointments" },
  { label: "Medicines", href: "/medicines" },
  { label: "Emergency", href: "/#emergency", isEmergency: true },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-all duration-200">
      <PageContainer>
        <div className="flex h-18 items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg p-1"
          >
            <div className="h-10 w-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-sm group-hover:bg-[#1D4ED8] transition-colors">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[#0F172A] leading-none tracking-tight">
                Secure<span className="text-[#2563EB]">Hospitality</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#64748B] mt-0.5">
                Healthcare Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              if (item.isEmergency) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#EF4444] bg-red-50 hover:bg-red-100 border border-red-200/80 transition-all shadow-2xs hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444]"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444]"></span>
                    </span>
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Emergency</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    isActive
                      ? "text-[#2563EB] font-semibold"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/70"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Cart Icon Button with Live Count Badge */}
            <Link
              href="/cart"
              className="relative p-2 rounded-xl text-[#0F172A] hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              aria-label={`View Cart with ${totalItemCount} items`}
            >
              <ShoppingBag className="h-5 w-5 text-[#0F172A]" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#2563EB] text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-50 duration-150">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <div className="relative group">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors"
                >
                  <div className="h-8 w-8 rounded-xl bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <span className="text-xs font-bold text-[#0F172A] pr-1">{user.firstName}</span>
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block w-48 z-50">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-2 space-y-1 text-xs font-semibold text-[#0F172A]">
                    <Link href="/profile" className="block px-3 py-2 rounded-xl hover:bg-slate-100">
                      My Profile
                    </Link>
                    <Link href="/appointments" className="block px-3 py-2 rounded-xl hover:bg-slate-100">
                      Appointments
                    </Link>
                    <Link href="/cart" className="block px-3 py-2 rounded-xl hover:bg-slate-100">
                      My Cart & Orders
                    </Link>
                    <Link href="/emergency" className="block px-3 py-2 rounded-xl hover:bg-slate-100 text-[#EF4444]">
                      Emergency Hub
                    </Link>
                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-[#0F172A]" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  asChild
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburger & Cart Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2 rounded-xl text-[#0F172A] hover:bg-slate-100 transition-colors"
              aria-label="View Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#2563EB] text-white font-bold text-[9px] flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </Link>

            <Link
              href="/#emergency"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-[#EF4444] bg-red-50 border border-red-200"
            >
              <PhoneCall className="h-3 w-3" />
              <span>SOS</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-[#0F172A] hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              aria-label="Open main navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </PageContainer>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        items={NAV_ITEMS}
        currentPath={pathname}
      />
    </header>
  );
};
