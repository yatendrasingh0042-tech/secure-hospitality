"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, UserX, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { DoctorSkeleton } from "@/components/doctors/DoctorSkeleton";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { FilterSection } from "@/components/filters/FilterSection";
import { SortDropdown, SortOption } from "@/components/filters/SortDropdown";
import { ActiveFilters, ActiveFilterTag } from "@/components/filters/ActiveFilters";
import { DOCTORS_DATA } from "@/data/doctors";
import { SPECIALTIES_LIST } from "@/data/specialties";
import { Doctor } from "@/types/doctor";
import { formatCurrency } from "@/lib/formatCurrency";
import { apiRequest } from "@/lib/apiClient";

const SORT_OPTIONS: SortOption[] = [
  { label: "Recommended", value: "recommended" },
  { label: "Highest Rated", value: "rating" },
  { label: "Most Experienced", value: "experience" },
  { label: "Lowest Fee", value: "fee_low" },
  { label: "Highest Fee", value: "fee_high" },
];

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("All");
  const [maxFee, setMaxFee] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [apiDoctors, setApiDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live doctor directory from backend API
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest("/api/doctors");
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: Doctor[] = res.data.map((bDoc: any) => ({
            id: bDoc._id || bDoc.id,
            name: bDoc.userId ? `Dr. ${bDoc.userId.firstName || ''} ${bDoc.userId.lastName || ''}`.trim() : "Dr. Medical Specialist",
            specialization: bDoc.specialization || "General Medicine",
            specialty: bDoc.specialization || "General Medicine",
            subSpecialization: bDoc.qualification || "MD",
            experienceYears: bDoc.experience || 10,
            rating: 4.9,
            reviewsCount: 180,
            consultationFee: bDoc.consultationFee || 500,
            location: bDoc.hospitalId?.city || "Central City",
            hospital: bDoc.hospitalId?.name || "City Care Hospital",
            languages: bDoc.languages || ["English", "Hindi"],
            availability: "Available Today",
            gender: "Male",
            education: bDoc.qualification || "MD",
            about: `Experienced ${bDoc.specialization || "medical"} practitioner providing patient-centered care.`,
            services: ["General Consultation", "Follow-up Checkup"],
            initials: (bDoc.userId?.firstName?.[0] || "D") + (bDoc.userId?.lastName?.[0] || "S"),
            avatarColor: "bg-blue-600",
          }));
          setApiDoctors(mapped);
        } else {
          setApiDoctors(DOCTORS_DATA);
        }
      } catch (err) {
        setApiDoctors(DOCTORS_DATA);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const activeDoctorsData = apiDoctors.length > 0 ? apiDoctors : DOCTORS_DATA;

  // Active filters calculation
  const activeFilters = useMemo(() => {
    const filters: ActiveFilterTag[] = [];
    if (selectedSpecialty !== "All") {
      filters.push({ key: "specialty", label: `Specialty: ${selectedSpecialty}`, value: selectedSpecialty });
    }
    if (selectedGender !== "All") {
      filters.push({ key: "gender", label: `Gender: ${selectedGender}`, value: selectedGender });
    }
    if (selectedAvailability !== "All") {
      filters.push({ key: "availability", label: selectedAvailability, value: selectedAvailability });
    }
    if (maxFee < 2000) {
      filters.push({ key: "maxFee", label: `Fee ≤ ${formatCurrency(maxFee)}`, value: String(maxFee) });
    }
    return filters;
  }, [selectedSpecialty, selectedGender, selectedAvailability, maxFee]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("All");
    setSelectedGender("All");
    setSelectedAvailability("All");
    setMaxFee(2000);
    setSortBy("recommended");
  };

  const handleRemoveFilter = (key: string) => {
    if (key === "specialty") setSelectedSpecialty("All");
    if (key === "gender") setSelectedGender("All");
    if (key === "availability") setSelectedAvailability("All");
    if (key === "maxFee") setMaxFee(2000);
  };

  // Filter & Sort Dataset
  const filteredDoctors = useMemo(() => {
    return activeDoctorsData.filter((doc) => {
      const spec = doc.specialty || doc.specialization || "";
      const hosp = doc.hospital || "";
      const matchesSearch =
        searchQuery === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spec.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hosp.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === "All" || spec === selectedSpecialty;

      const matchesFee = doc.consultationFee <= maxFee;

      return matchesSearch && matchesSpecialty && matchesFee;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "experience") return b.experienceYears - a.experienceYears;
      if (sortBy === "fee_low") return a.consultationFee - b.consultationFee;
      if (sortBy === "fee_high") return b.consultationFee - a.consultationFee;
      return 0;
    });
  }, [searchQuery, selectedSpecialty, maxFee, sortBy, activeDoctorsData]);

  return (
    <div className="py-10 lg:py-16 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        {/* Header Banner */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Consult Top Medical Specialists
          </h1>
          <p className="text-base text-[#64748B] max-w-2xl">
            Book in-person or video consultations with verified doctors.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by doctor name, specialty, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden"
          >
            Filters ({activeFilters.length})
          </Button>
        </div>

        {/* Active Filter Tags */}
        {activeFilters.length > 0 && (
          <div className="mb-6">
            <ActiveFilters
              filters={activeFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleResetFilters}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filter Sidebar */}
          <div className="lg:col-span-3">
            <FilterPanel
              isOpenMobile={isMobileFilterOpen}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
              onReset={handleResetFilters}
              activeCount={activeFilters.length}
            >
              <FilterSection title="Medical Specialty">
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {SPECIALTIES_LIST.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => setSelectedSpecialty(spec)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        selectedSpecialty === spec
                          ? "bg-blue-50 text-[#2563EB]"
                          : "text-[#64748B] hover:bg-slate-50"
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Max Consultation Fee">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-[#0F172A]">
                    <span>Up to</span>
                    <span className="text-[#2563EB]">{formatCurrency(maxFee)}</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="2000"
                    step="100"
                    value={maxFee}
                    onChange={(e) => setMaxFee(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                  />
                </div>
              </FilterSection>
            </FilterPanel>
          </div>

          {/* Doctors Grid */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">
                Showing {filteredDoctors.length} doctors available
              </span>
              <SortDropdown
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DoctorSkeleton />
                <DoctorSkeleton />
                <DoctorSkeleton />
                <DoctorSkeleton />
              </div>
            ) : filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-3xl bg-white border border-[#E2E8F0] space-y-4 p-8">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <UserX className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#0F172A]">No doctors found</h3>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                    No medical specialists match your current filter settings. Try adjusting your specialty or fee range.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleResetFilters} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
