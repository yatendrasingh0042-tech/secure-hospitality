"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Star,
  MapPin,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Navigation,
  Heart,
  Brain,
  Bone,
  Siren,
  Shield,
  Activity,
  Baby,
  Stethoscope,
  Sparkles,
  Eye,
  UserCheck,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { HOSPITALS_DATA } from "@/data/hospitals";
import { DOCTORS_DATA } from "@/data/doctors";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart: Heart,
  Brain: Brain,
  Bone: Bone,
  Siren: Siren,
  Shield: Shield,
  Activity: Activity,
  Baby: Baby,
  Stethoscope: Stethoscope,
  Sparkles: Sparkles,
  Eye: Eye,
};

export default function HospitalDetailPage() {
  const params = useParams();
  const hospitalId = params.id as string;

  const hospital = HOSPITALS_DATA.find((h) => h.id === hospitalId);

  if (!hospital) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#0F172A]">Hospital Not Found</h2>
        <p className="text-sm text-[#64748B]">The requested healthcare facility does not exist in our directory.</p>
        <Button variant="primary" size="md" asChild>
          <Link href="/hospitals">Back to Hospitals Directory</Link>
        </Button>
      </div>
    );
  }

  // Find doctors affiliated with this hospital
  const affiliatedDoctors = DOCTORS_DATA.filter((d) => d.hospital === hospital.name);

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-6 overflow-x-auto" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0F172A] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <Link href="/hospitals" className="hover:text-[#0F172A] transition-colors">
            Hospitals
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="font-semibold text-[#0F172A] truncate">{hospital.name}</span>
        </nav>

        {/* Hospital Hero Header Card */}
        <Card variant="elevated" radius="xl" className="p-6 sm:p-8 bg-white border border-[#E2E8F0] mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className={`h-20 w-20 sm:h-24 sm:w-24 rounded-3xl ${hospital.accentColor} text-white font-bold flex items-center justify-center shadow-lg shrink-0`}>
                <Building2 className="h-10 w-10" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                    {hospital.name}
                  </h1>
                  <Badge variant={hospital.isOpen247 ? "success" : "neutral"} size="sm" showDot>
                    {hospital.isOpen247 ? "24/7 Open" : "Standard Hours"}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-indigo-600">
                  {hospital.type}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] pt-1">
                  <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span>{hospital.rating}</span> ({hospital.reviewsCount} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {hospital.location} ({hospital.distanceKm} km away)
                  </span>
                  <span className="flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5 text-[#2563EB]" /> {hospital.doctorsCount} Specialists
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-left md:text-right">
                <span className="text-xs text-[#64748B]">Emergency Desk</span>
                <p className="text-lg font-bold text-[#EF4444]">{hospital.emergencyPhone}</p>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full md:w-auto"
                asChild
              >
                <Link href="/doctors">Book Consultation</Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Overview, Departments, Services, Doctors */}
          <div className="lg:col-span-8 space-y-6">
            {/* Overview */}
            <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-3">
              <h2 className="text-lg font-bold text-[#0F172A]">Hospital Overview</h2>
              <p className="text-sm text-[#64748B] leading-relaxed">{hospital.description}</p>
            </Card>

            {/* Visual Department Cards Grid */}
            <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Clinical Departments</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {hospital.departments.map((dept) => {
                  const DeptIcon = iconMap[dept.iconName] || Building2;
                  return (
                    <div
                      key={dept.name}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3"
                    >
                      <div className="h-10 w-10 rounded-xl bg-blue-100/80 text-[#2563EB] flex items-center justify-center shrink-0">
                        <DeptIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">{dept.name}</p>
                        <p className="text-xs text-[#64748B]">{dept.doctorCount} Doctors</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Special Services & Infrastructure */}
            <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Medical Services & Facilities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hospital.services.map((srv) => (
                  <div key={srv} className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-semibold text-[#0F172A]">
                    <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Affiliated Doctors */}
            {affiliatedDoctors.length > 0 && (
              <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#0F172A]">Doctors at this Facility</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/doctors">View All</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {affiliatedDoctors.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/doctors/${doc.id}`}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center gap-3"
                    >
                      <div className={`h-11 w-11 rounded-xl ${doc.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0`}>
                        {doc.initials}
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-bold text-[#0F172A] truncate">{doc.name}</p>
                        <p className="text-xs text-[#2563EB] truncate">{doc.specialization}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Emergency Status & Map Preview Placeholder */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Bed Capacity Card */}
            <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
              <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#10B981]" /> Live Capacity Tracker
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                  <p className="text-slate-500 font-medium">ICU Beds</p>
                  <p className="text-xl font-extrabold text-[#10B981] mt-1">{hospital.icuBedsAvailable}</p>
                  <p className="text-[10px] text-emerald-700">Open Now</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-center">
                  <p className="text-slate-500 font-medium">General Wards</p>
                  <p className="text-xl font-extrabold text-[#2563EB] mt-1">{hospital.generalBedsAvailable}</p>
                  <p className="text-[10px] text-blue-700">Open Now</p>
                </div>
              </div>
            </Card>

            {/* Stylized Map Preview Visual Placeholder */}
            <Card radius="xl" className="p-6 bg-white border border-[#E2E8F0] space-y-4">
              <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
                <Navigation className="h-4 w-4 text-[#2563EB]" /> Location Map Preview
              </h3>

              {/* Map Canvas Graphic Mock */}
              <div className="relative h-48 w-full rounded-2xl bg-gradient-to-tr from-slate-100 via-blue-50 to-slate-200 border border-slate-200 overflow-hidden flex items-center justify-center p-4">
                {/* Decorative map grid lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                <div className="relative z-10 text-center space-y-2">
                  <div className="h-10 w-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="text-xs font-bold text-[#0F172A]">{hospital.name}</p>
                    <p className="text-[10px] text-[#64748B]">{hospital.distanceKm} km from current location</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="md" className="w-full justify-center">
                <span>View Directions</span>
              </Button>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
