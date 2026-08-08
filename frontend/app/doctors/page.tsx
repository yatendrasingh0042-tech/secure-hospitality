"use client";

import React, { useState, useMemo } from "react";
import { Search, UserX, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { DoctorSkeleton } from "@/components/doctors/DoctorSkeleton";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { FilterSection } from "@/components/filters/FilterSection";
import { FilterButton } from "@/components/filters/FilterButton";
import { SortDropdown, SortOption } from "@/components/filters/SortDropdown";
import { ActiveFilters, ActiveFilterTag } from "@/components/filters/ActiveFilters";
import { DOCTORS_DATA } from "@/data/doctors";
import { SPECIALTIES_LIST } from "@/data/specialties";

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
  const [maxFee, setMaxFee] = useState<number>(100);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const isLoading = false;

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
    if (maxFee < 100) {
      filters.push({ key: "maxFee", label: `Fee ≤ $${maxFee}`, value: String(maxFee) });
    }
    return filters;
  }, [selectedSpecialty, selectedGender, selectedAvailability, maxFee]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("All");
    setSelectedGender("All");
    setSelectedAvailability("All");
    setMaxFee(100);
    setSortBy("recommended");
  };

  const handleRemoveFilter = (key: string) => {
    if (key === "specialty") setSelectedSpecialty("All");
    if (key === "gender") setSelectedGender("All");
    if (key === "availability") setSelectedAvailability("All");
    if (key === "maxFee") setMaxFee(100);
  };

  // Filter and sort mock data
  const filteredDoctors = useMemo(() => {
    return DOCTORS_DATA.filter((doc) => {
      const matchesSearch =
        searchQuery === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === "All" || doc.specialization === selectedSpecialty;

      const matchesGender =
        selectedGender === "All" || doc.gender === selectedGender;

      const matchesAvailability =
        selectedAvailability === "All" || doc.availability === selectedAvailability;

      const matchesFee = doc.consultationFee <= maxFee;

      return (
        matchesSearch &&
        matchesSpecialty &&
        matchesGender &&
        matchesAvailability &&
        matchesFee
      );
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "experience") return b.experienceYears - a.experienceYears;
      if (sortBy === "fee_low") return a.consultationFee - b.consultationFee;
      if (sortBy === "fee_high") return b.consultationFee - a.consultationFee;
      return 0;
    });
  }, [searchQuery, selectedSpecialty, selectedGender, selectedAvailability, maxFee, sortBy]);

  return (
    <div className="py-10 lg:py-16 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        {/* Header Banner */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Find the right doctor for you
          </h1>
          <p className="text-base text-[#64748B] max-w-2xl">
            Explore specialists and choose a healthcare professional based on your needs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-2xl">
          <Input
            placeholder="Search by doctor name, specialty or hospital..."
            leftIcon={<Search className="h-4 w-4 text-[#64748B]" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Layout Grid: Filters Sidebar + Doctor Results */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Shared Responsive Filter Panel */}
          <FilterPanel
            isOpenMobile={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            onReset={handleResetFilters}
            activeCount={activeFilters.length}
          >
            {/* Specialty Filter */}
            <FilterSection title="Specialization">
              <div className="space-y-1.5 text-xs text-[#0F172A]">
                <label className="flex items-center gap-2 cursor-pointer py-1 hover:text-[#2563EB]">
                  <input
                    type="radio"
                    name="specialty"
                    checked={selectedSpecialty === "All"}
                    onChange={() => setSelectedSpecialty("All")}
                    className="accent-[#2563EB]"
                  />
                  <span>All Specializations</span>
                </label>
                {SPECIALTIES_LIST.map((spec) => (
                  <label key={spec} className="flex items-center gap-2 cursor-pointer py-1 hover:text-[#2563EB]">
                    <input
                      type="radio"
                      name="specialty"
                      checked={selectedSpecialty === spec}
                      onChange={() => setSelectedSpecialty(spec)}
                      className="accent-[#2563EB]"
                    />
                    <span>{spec}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Availability Filter */}
            <FilterSection title="Availability">
              <div className="space-y-1.5 text-xs text-[#0F172A]">
                {["All", "Available Today", "Available Tomorrow"].map((avail) => (
                  <label key={avail} className="flex items-center gap-2 cursor-pointer py-1 hover:text-[#2563EB]">
                    <input
                      type="radio"
                      name="availability"
                      checked={selectedAvailability === avail}
                      onChange={() => setSelectedAvailability(avail)}
                      className="accent-[#2563EB]"
                    />
                    <span>{avail === "All" ? "Any Availability" : avail}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Max Fee Filter */}
            <FilterSection title="Max Consultation Fee">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-[#0F172A]">
                  <span>Up to</span>
                  <span>${maxFee}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={maxFee}
                  onChange={(e) => setMaxFee(Number(e.target.value))}
                  className="w-full accent-[#2563EB]"
                />
              </div>
            </FilterSection>

            {/* Gender Filter */}
            <FilterSection title="Doctor Gender">
              <div className="space-y-1.5 text-xs text-[#0F172A]">
                {["All", "Female", "Male"].map((gender) => (
                  <label key={gender} className="flex items-center gap-2 cursor-pointer py-1 hover:text-[#2563EB]">
                    <input
                      type="radio"
                      name="gender"
                      checked={selectedGender === gender}
                      onChange={() => setSelectedGender(gender)}
                      className="accent-[#2563EB]"
                    />
                    <span>{gender === "All" ? "All Genders" : gender}</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </FilterPanel>

          {/* Results Main Column */}
          <main className="flex-1 w-full space-y-4">
            {/* Bar: Results Count, Mobile Filter Button, Sort Dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                  Showing <span className="text-[#2563EB]">{filteredDoctors.length}</span> verified doctors
                </p>
                <FilterButton
                  activeCount={activeFilters.length}
                  onClick={() => setIsMobileFilterOpen(true)}
                />
              </div>

              <SortDropdown
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>

            {/* Active Filter Chips */}
            <ActiveFilters
              filters={activeFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleResetFilters}
            />

            {/* Doctor Grid or Skeleton or Empty State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <DoctorSkeleton key={i} />
                ))}
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 my-6">
                <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <UserX className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#0F172A]">No doctors found</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mx-auto">
                    Try adjusting your search criteria or resetting applied filters.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetFilters} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDoctors.map((doc) => (
                  <DoctorCard key={doc.id} doctor={doc} />
                ))}
              </div>
            )}
          </main>
        </div>
      </PageContainer>
    </div>
  );
}
