import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ReminderProvider } from "@/context/ReminderContext";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { ConnectionStatus } from "@/components/pwa/ConnectionStatus";
import { InstallAppPrompt } from "@/components/pwa/InstallAppPrompt";
import { PWAUpdatePrompt } from "@/components/pwa/PWAUpdatePrompt";

export const metadata: Metadata = {
  title: "Secure Hospitality — Healthcare, Simplified",
  description:
    "A modern healthcare platform for appointments, medicines, hospitals, health management and emergency assistance.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Secure Hospitality",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-[#2563EB]/10 selection:text-[#2563EB]">
        <ServiceWorkerRegistration />
        <ConnectionStatus />
        <InstallAppPrompt />
        <PWAUpdatePrompt />
        <AuthProvider>
          <CartProvider>
            <ReminderProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </ReminderProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


