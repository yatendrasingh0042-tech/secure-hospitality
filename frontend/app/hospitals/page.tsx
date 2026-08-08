"use client";

import React, { useState, useMemo } from "react";
import { Search, Building2, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HospitalCard } from "@/components/hospitals/HospitalCard";
import { HospitalSkeleton } from "@/components/hospitals/HospitalSkeleton";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { FilterSection } from "@/components/filters/FilterSection";
import { FilterButton } from "@/components/filters/FilterButton";
import { SortDropdown, SortOption } from "@/components/filters/SortDropdown";
import { ActiveFilters, ActiveFilterTag } from "@/components/filters/ActiveFilters";
import { HOSPITALS_DATA } from "@/data/hospitals";
import { LOCATIONS_LIST } from "@/data/locations";

const SORT_OPTIONS: SortOption[] = [
  { label: "Recommended", value: "recommended" },
  { label: "Nearest Distance", value: "distance" },
  { label: "Highest Rated", value: "rating" },
  { label: "Most ICU Beds Open", value: "icu_beds" },
];

export default function HospitalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [only247, setOnly247] = useState<boolean>(false);
  const [onlyEmergency, setOnlyEmergency] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const isLoading = false;

  // Active filters list
  const activeFilters = useMemo(() => {
    const filters: ActiveFilterTag[] = [];
    if (selectedDistrict !== "All") {
      filters.push({ key: "district", label: `District: ${selectedDistrict}`, value: selectedDistrict });
    }
    if (only247) {
      filters.push({ key: "only247", label: "24/7 Open Only", value: "true" });
    }
    if (onlyEmergency) {
      filters.push({ key: "onlyEmergency", label: "Emergency ER Ready", value: "true" });
    }
    return filters;
  }, [selectedDistrict, only247, onlyEmergency]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDistrict("All");
    setOnly247(false);
    setOnlyEmergency(false);
    setSortBy("recommended");
  };

  const handleRemoveFilter = (key: string) => {
    if (key === "district") setSelectedDistrict("All");
    if (key === "only247") setOnly247(false);
    if (key === "onlyEmergency") setOnlyEmergency(false);
  };

  // Filter & Sort mock dataset
  const filteredHospitals = useMemo(() => {
    return HOSPITALS_DATA.filter((hosp) => {
      const matchesSearch =
        searchQuery === "" ||
        hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hosp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hosp.departments.some((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        hosp.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDistrict =
        selectedDistrict === "All" || hosp.district === selectedDistrict;

      const matches247 = !only247 || hosp.isOpen247;
      const matchesEmergency = !onlyEmergency || hosp.emergencyAvailable;

      return matchesSearch && matchesDistrict && matches247 && matchesEmergency;
    }).sort((a, b) => {
      if (sortBy === "distance") return a.distanceKm - b.distanceKm;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "icu_beds") return b.icuBedsAvailable - a.icuBedsAvailable;
      return 0;
    });
  }, [searchQuery, selectedDistrict, only247, onlyEmergency, sortBy]);

  return (
    <div className="py-10 lg:py-16 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        {/* Header Banner */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Find trusted healthcare facilities
          </h1>
          <p className="text-base text-[#64748B] max-w-2xl">
            Explore hospitals, departments and healthcare services in one place.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-2xl">
          <Input
            placeholder="Search hospitals, locations, departments or services..."
            leftIcon={<Search className="h-4 w-4 text-[#64748B]" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Layout Grid: Filters Sidebar + Hospital Results */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Shared Responsive Filter Panel */}
          <FilterPanel
            isOpenMobile={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            onReset={handleResetFilters}
            activeCount={activeFilters.length}
          >
            {/* District / Location Filter */}
            <FilterSection title="District / Region">
              <div className="space-y-1.5 text-xs text-[#0F172A]">
                <label className="flex items-center gap-2 cursor-pointer py-1 hover:text-[#2563EB]">
                  <input
                    type="radio"
                    name="district"
                    checked={selectedDistrict === "All"}
                    onChange={() => setSelectedDistrict("All")}
                    className="accent-[#2563EB]"
                  />
                  <span>All Districts</span>
                </label>
                {LOCATIONS_LIST.map((dist) => (
                  <label key={dist} className="flex items-center gap-2 cursor-pointer py-1 hover:text-[#2563EB]">
                    <input
                      type="radio"
                      name="district"
                      checked={selectedDistrict === dist}
                      onChange={() => setSelectedDistrict(dist)}
                      className="accent-[#2563EB]"
                    />
                    <span>{dist}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Operating Status */}
            <FilterSection title="Facility Status">
              <div className="space-y-2 text-xs text-[#0F172A]">
                <label className="flex items-center gap-2 cursor-pointer hover:text-[#2563EB]">
                  <input
                    type="checkbox"
                    checked={only247}
                    onChange={(e) => setOnly247(e.target.checked)}
                    className="accent-[#2563EB] rounded"
                  />
                  <span>24/7 Open Hospitals Only</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-[#2563EB]">
                  <input
                    type="checkbox"
                    checked={onlyEmergency}
                    onChange={(e) => setOnlyEmergency(e.target.checked)}
                    className="accent-[#2563EB] rounded"
                  />
                  <span>Level-1 ER Ready Facilities</span>
                </label>
              </div>
            </FilterSection>
          </FilterPanel>

          {/* Results Main Column */}
          <main className="flex-1 w-full space-y-4">
            {/* Bar: Results Count, Mobile Filter Button, Sort Dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                  Showing <span className="text-[#2563EB]">{filteredHospitals.length}</span> healthcare centers
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

            {/* Hospital Grid or Skeleton or Empty State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <HospitalSkeleton key={i} />
                ))}
              </div>
            ) : filteredHospitals.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 my-6">
                <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Building2 className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#0F172A]">No hospitals found</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mx-auto">
                    Try changing your search terms or clearing applied location filters.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetFilters} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHospitals.map((hosp) => (
                  <HospitalCard key={hosp.id} hospital={hosp} />
                ))}
              </div>
            )}
          </main>
        </div>
      </PageContainer>
    </div>
  );
}
