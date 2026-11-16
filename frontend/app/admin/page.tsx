"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSafeRouter } from "@/hooks/useSafeRouter";
import {
  Users,
  UserCheck,
  Stethoscope,
  Building2,
  Calendar,
  ShoppingBag,
  Siren,
  TrendingUp,
  ShieldAlert,
  RefreshCw,
  DollarSign,
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/apiClient";

interface AdminDashboardData {
  overview: {
    totalUsers: number;
    totalPatients: number;
    totalDoctors: number;
    totalHospitals: number;
    totalAppointments: number;
    totalOrders: number;
    totalRevenue: number;
  };
  appointmentsSummary: {
    total: number;
    byStatus: Record<string, number>;
  };
  ordersSummary: {
    totalOrders: number;
    totalRevenue: number;
  };
  ambulancesSummary: Record<string, number>;
}

export default function AdminDashboardPage() {
  const router = useSafeRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [dashRes, userRes] = await Promise.allSettled([
        apiRequest("/api/admin/dashboard"),
        apiRequest("/api/admin/stats/users"),
      ]);

      if (dashRes.status === "fulfilled" && dashRes.value?.success) {
        setData(dashRes.value.data);
      } else if (dashRes.status === "rejected") {
        throw dashRes.reason;
      }

      if (userRes.status === "fulfilled" && userRes.value?.success) {
        setUserStats(userRes.value.data);
      }
    } catch (err: any) {
      console.error("Admin dashboard fetch error:", err);
      setError(err.message || "Failed to load admin statistics.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && user) {
      const isAllowed = ["admin", "super_admin", "hospital_admin"].includes(user.role || "");
      if (isAllowed) {
        fetchAdminData();
      }
    }
  }, [isAuthLoading, user]);

  if (isAuthLoading) {
    return (
      <div className="py-12 bg-[#F8FAFC] min-h-screen">
        <PageContainer>
          <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
            <div className="h-10 w-64 bg-slate-200 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-32 bg-slate-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  const isAdminRole = user && ["admin", "super_admin", "hospital_admin"].includes(user.role || "");

  if (!user || !isAdminRole) {
    return (
      <div className="py-14 bg-[#F8FAFC] min-h-screen">
        <PageContainer>
          <div className="max-w-md mx-auto text-center space-y-4 py-8">
            <Card radius="xl" className="p-8 bg-white border border-[#E2E8F0] shadow-md space-y-4">
              <ShieldAlert className="h-14 w-14 text-red-500 mx-auto" />
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-[#0F172A]">403 - Access Forbidden</h2>
                <p className="text-xs text-[#64748B]">
                  Administrative privileges are required to access the Secure Hospitality Admin Portal.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                className="w-full bg-[#2563EB] font-bold"
                onClick={() => router.push(user ? "/profile" : "/login")}
              >
                {user ? "Return to Profile" : "Sign In as Admin"}
              </Button>
            </Card>
          </div>
        </PageContainer>
      </div>
    );
  }

  const overview = data?.overview || {
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalHospitals: 0,
    totalAppointments: 0,
    totalOrders: 0,
    totalRevenue: 0,
  };

  const apptByStatus = data?.appointmentsSummary?.byStatus || {};
  const completedAppts = apptByStatus.completed || 0;
  const pendingAppts = (apptByStatus.pending || 0) + (apptByStatus.scheduled || 0);
  const cancelledAppts = apptByStatus.cancelled || 0;

  return (
    <div className="py-8 lg:py-12 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="info" size="sm" showDot className="bg-blue-50 text-[#2563EB] border-blue-200">
                  MongoDB Atlas Live System
                </Badge>
                <Badge variant="success" size="sm">
                  Role: {user.role?.toUpperCase()}
                </Badge>
              </div>
              <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
                Secure Hospitality System Analytics
              </h1>
              <p className="text-xs text-[#64748B]">
                Real-time operational metrics fetched directly from MongoDB database models.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchAdminData}
              isLoading={isLoading}
              leftIcon={<RefreshCw className="h-4 w-4" />}
              className="font-bold border-slate-300"
            >
              Refresh Data
            </Button>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Users */}
            <Card radius="xl" className="p-5 bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Users</span>
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#0F172A]">{overview.totalUsers}</p>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3.5 w-3.5" /> Registered Accounts in MongoDB
                </p>
              </div>
            </Card>

            {/* Total Doctors */}
            <Card radius="xl" className="p-5 bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Doctors</span>
                <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#0F172A]">{overview.totalDoctors}</p>
                <p className="text-[11px] text-[#64748B] font-semibold mt-1">Specialists & Practitioners</p>
              </div>
            </Card>

            {/* Total Hospitals */}
            <Card radius="xl" className="p-5 bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Hospitals</span>
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#0F172A]">{overview.totalHospitals}</p>
                <p className="text-[11px] text-[#64748B] font-semibold mt-1">Partner Medical Centers</p>
              </div>
            </Card>

            {/* Total Revenue / Orders */}
            <Card radius="xl" className="p-5 bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Revenue</span>
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#0F172A]">
                  ₹{overview.totalRevenue ? overview.totalRevenue.toLocaleString() : "0"}
                </p>
                <p className="text-[11px] text-[#64748B] font-semibold mt-1">
                  From {overview.totalOrders} Medicine Orders
                </p>
              </div>
            </Card>
          </div>

          {/* Breakdown Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Appointments Breakdown */}
            <div className="lg:col-span-6 space-y-6">
              <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#2563EB]" /> Appointment Analytics
                  </h3>
                  <Badge variant="neutral" size="sm">
                    Total: {overview.totalAppointments}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                    <span className="text-xs text-emerald-800 font-semibold block">Completed</span>
                    <span className="text-xl font-extrabold text-emerald-900">{completedAppts}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                    <Clock className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                    <span className="text-xs text-amber-800 font-semibold block">Pending / Scheduled</span>
                    <span className="text-xl font-extrabold text-amber-900">{pendingAppts}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200">
                    <XCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
                    <span className="text-xs text-red-800 font-semibold block">Cancelled</span>
                    <span className="text-xl font-extrabold text-red-900">{cancelledAppts}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full font-bold text-xs" asChild>
                    <Link href="/appointments">Manage System Appointments →</Link>
                  </Button>
                </div>
              </Card>
            </div>

            {/* Emergency & Fleet Dispatch Breakdown */}
            <div className="lg:col-span-6 space-y-6">
              <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
                    <Siren className="h-5 w-5 text-red-500" /> Emergency Fleet Analytics
                  </h3>
                  <Badge variant="danger" size="sm">
                    Live Dispatch
                  </Badge>
                </div>

                <div className="space-y-3">
                  {Object.keys(data?.ambulancesSummary || {}).length === 0 ? (
                    <p className="text-xs text-[#64748B] text-center py-4">No active ambulance dispatches recorded.</p>
                  ) : (
                    Object.entries(data?.ambulancesSummary || {}).map(([statusKey, count]) => (
                      <div
                        key={statusKey}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-[#0F172A] capitalize">{statusKey.replace("_", " ")}</span>
                        <span className="font-extrabold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg">
                          {count} Vehicles
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full font-bold text-xs" asChild>
                    <Link href="/emergency">Open Emergency Hub →</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Quick Management Links */}
          <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
            <h3 className="font-bold text-base text-[#0F172A]">System Administration Controls</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
              <Link
                href="/doctors"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-[#0F172A] flex items-center justify-between transition-colors"
              >
                <span>Doctor Directory & Schedules</span>
                <ArrowUpRight className="h-4 w-4 text-[#2563EB]" />
              </Link>
              <Link
                href="/hospitals"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-[#0F172A] flex items-center justify-between transition-colors"
              >
                <span>Hospital Network Management</span>
                <ArrowUpRight className="h-4 w-4 text-[#2563EB]" />
              </Link>
              <Link
                href="/medicines"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-[#0F172A] flex items-center justify-between transition-colors"
              >
                <span>Pharmacy Inventory & Orders</span>
                <ArrowUpRight className="h-4 w-4 text-[#2563EB]" />
              </Link>
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
