"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Building2, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HospitalCard } from "@/components/hospitals/HospitalCard";
import { HospitalSkeleton } from "@/components/hospitals/HospitalSkeleton";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { FilterSection } from "@/components/filters/FilterSection";
import { SortDropdown, SortOption } from "@/components/filters/SortDropdown";
import { ActiveFilters, ActiveFilterTag } from "@/components/filters/ActiveFilters";
import { HOSPITALS_DATA } from "@/data/hospitals";
import { LOCATIONS_LIST } from "@/data/locations";
import { Hospital } from "@/types/hospital";
import { apiRequest } from "@/lib/apiClient";

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
  const [apiHospitals, setApiHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live hospitals from backend API
  useEffect(() => {
    const fetchHospitals = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest("/api/hospitals");
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: Hospital[] = res.data.map((bHosp: any) => ({
            id: bHosp._id || bHosp.id,
            name: bHosp.name,
            type: "Multispeciality Hospital",
            location: `${bHosp.address || ""}, ${bHosp.city || ""}`,
            district: bHosp.city || "Central",
            distanceKm: 2.5,
            isOpen247: true,
            emergencyAvailable: bHosp.emergencyAvailable ?? true,
            rating: 4.8,
            reviewsCount: 120,
            icuBedsAvailable: 15,
            phone: bHosp.phone || "+91 98765 43210",
            email: bHosp.email || "info@hospital.com",
            image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80",
            departments: Array.isArray(bHosp.departments)
              ? bHosp.departments.map((d: any) => (typeof d === "string" ? { name: d, count: 5 } : { name: d.name || "General", count: 5 }))
              : [{ name: "Cardiology", count: 5 }, { name: "Neurology", count: 3 }],
            services: bHosp.facilities || ["24/7 ER", "ICU", "Lab Services"],
          }));
          setApiHospitals(mapped);
        } else {
          setApiHospitals(HOSPITALS_DATA);
        }
      } catch (err) {
        setApiHospitals(HOSPITALS_DATA);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  const activeHospitalsData = apiHospitals.length > 0 ? apiHospitals : HOSPITALS_DATA;

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

  // Filter & Sort dataset
  const filteredHospitals = useMemo(() => {
    return activeHospitalsData.filter((hosp) => {
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
  }, [searchQuery, selectedDistrict, only247, onlyEmergency, sortBy, activeHospitalsData]);

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
        <div className="mb-8 p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by hospital name, department, or city..."
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
              <FilterSection title="District Location">
                <div className="space-y-1">
                  {LOCATIONS_LIST.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setSelectedDistrict(loc)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        selectedDistrict === loc
                          ? "bg-blue-50 text-[#2563EB]"
                          : "text-[#64748B] hover:bg-slate-50"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Availability & Emergency">
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-[#0F172A] font-medium">
                    <input
                      type="checkbox"
                      checked={only247}
                      onChange={(e) => setOnly247(e.target.checked)}
                      className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>24/7 Open Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[#0F172A] font-medium">
                    <input
                      type="checkbox"
                      checked={onlyEmergency}
                      onChange={(e) => setOnlyEmergency(e.target.checked)}
                      className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>Emergency ER Ready</span>
                  </label>
                </div>
              </FilterSection>
            </FilterPanel>
          </div>

          {/* Hospitals Grid */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">
                Showing {filteredHospitals.length} facilities
              </span>
              <SortDropdown
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HospitalSkeleton />
                <HospitalSkeleton />
                <HospitalSkeleton />
                <HospitalSkeleton />
              </div>
            ) : filteredHospitals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHospitals.map((hospital) => (
                  <HospitalCard key={hospital.id} hospital={hospital} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-3xl bg-white border border-[#E2E8F0] space-y-4 p-8">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#0F172A]">No hospitals found</h3>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                    No hospital facilities match your current search query or active filter criteria.
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
