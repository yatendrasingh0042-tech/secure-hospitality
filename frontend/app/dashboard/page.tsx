"use client";

import React, { Suspense } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingAppointment } from "@/components/dashboard/UpcomingAppointment";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { ReminderList } from "@/components/dashboard/ReminderList";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { EmergencyContactCard } from "@/components/emergency/EmergencyContactCard";

function DashboardContent() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Persistent Sidebar (Desktop) */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 mb-16 lg:mb-0">
        <DashboardHeader />
        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            <UpcomingAppointment />
            <RecentOrders />
            <ReminderList />
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            <RecentActivity />
            <EmergencyContactCard />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
