"use client";

import React, { useState, useMemo } from "react";
import { Search, Pill, Cross, Sparkles, Shield, Wind, Activity, Moon, HeartPulse, RefreshCw, PackageX } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MedicineCard } from "@/components/medicines/MedicineCard";
import { PrescriptionModal } from "@/components/medicines/PrescriptionModal";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { FilterSection } from "@/components/filters/FilterSection";
import { FilterButton } from "@/components/filters/FilterButton";
import { SortDropdown, SortOption } from "@/components/filters/SortDropdown";
import { ActiveFilters, ActiveFilterTag } from "@/components/filters/ActiveFilters";
import { MEDICINES_DATA } from "@/data/medicines";
import { Medicine } from "@/types/medicine";

const CATEGORIES = [
  { name: "All Products", icon: Pill },
  { name: "Pain Relief", icon: Pill },
  { name: "First Aid", icon: Cross },
  { name: "Vitamins", icon: Sparkles },
  { name: "Personal Care", icon: Shield },
  { name: "Wellness", icon: Moon },
  { name: "Cold & Allergy", icon: Wind },
  { name: "Digestive Care", icon: Activity },
  { name: "Health Devices", icon: HeartPulse },
];

const SORT_OPTIONS: SortOption[] = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Highest Rated", value: "rating" },
  { label: "Most Popular", value: "popular" },
];

export default function MedicinesCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedRxFilter, setSelectedRxFilter] = useState<"all" | "otc" | "rx">("all");
  const [maxPrice, setMaxPrice] = useState<number>(60);
  const [sortBy, setSortBy] = useState("recommended");

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [rxModalMedicine, setRxModalMedicine] = useState<Medicine | null>(null);

  const activeFilters = useMemo(() => {
    const list: ActiveFilterTag[] = [];
    if (selectedCategory !== "All Products") {
      list.push({ key: "cat", label: `Category: ${selectedCategory}`, value: selectedCategory });
    }
    if (selectedRxFilter === "otc") {
      list.push({ key: "otc", label: "OTC Products Only", value: "otc" });
    } else if (selectedRxFilter === "rx") {
      list.push({ key: "rx", label: "Prescription Required", value: "rx" });
    }
    if (maxPrice < 60) {
      list.push({ key: "price", label: `Max Price: $${maxPrice}`, value: String(maxPrice) });
    }
    return list;
  }, [selectedCategory, selectedRxFilter, maxPrice]);

  const handleRemoveFilter = (key: string) => {
    if (key === "cat") setSelectedCategory("All Products");
    if (key === "otc" || key === "rx") setSelectedRxFilter("all");
    if (key === "price") setMaxPrice(60);
  };

  const filteredMedicines = useMemo(() => {
    let result = [...MEDICINES_DATA];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.manufacturer.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "All Products") {
      result = result.filter((m) => m.category === selectedCategory);
    }

    if (selectedRxFilter === "otc") {
      result = result.filter((m) => !m.requiresPrescription);
    } else if (selectedRxFilter === "rx") {
      result = result.filter((m) => m.requiresPrescription);
    }

    result = result.filter((m) => m.price <= maxPrice);

    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "popular") {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [searchQuery, selectedCategory, selectedRxFilter, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Products");
    setSelectedRxFilter("all");
    setMaxPrice(60);
    setSortBy("recommended");
  };

  return (
    <div className="py-8 lg:py-14 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
          <Badge variant="info" size="sm" showDot>
            Healthcare Essentials
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Medicines made simpler.
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Explore healthcare essentials and everyday wellness products from one convenient, trusted platform.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <Input
            placeholder="Search medicines, categories, or brands..."
            leftIcon={<Search className="h-4 w-4 text-[#2563EB]" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Bar */}
        <div className="mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    isSelected
                      ? "bg-[#2563EB] text-white shadow-sm"
                      : "bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-slate-100/70"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid Layout: Desktop Sidebar Filter + Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3">
            <FilterPanel
              activeCount={activeFilters.length}
              onReset={handleResetFilters}
              isOpenMobile={isMobileFilterOpen}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
            >
              <FilterSection title="Prescription Filter" defaultOpen>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-[#0F172A]">
                    <input
                      type="radio"
                      name="rx"
                      checked={selectedRxFilter === "all"}
                      onChange={() => setSelectedRxFilter("all")}
                      className="text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>All Products</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[#0F172A]">
                    <input
                      type="radio"
                      name="rx"
                      checked={selectedRxFilter === "otc"}
                      onChange={() => setSelectedRxFilter("otc")}
                      className="text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>Over-the-Counter (OTC) Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[#0F172A]">
                    <input
                      type="radio"
                      name="rx"
                      checked={selectedRxFilter === "rx"}
                      onChange={() => setSelectedRxFilter("rx")}
                      className="text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>Prescription Required</span>
                  </label>
                </div>
              </FilterSection>

              <FilterSection title="Max Price ($)" defaultOpen>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#2563EB]"
                  />
                  <div className="flex justify-between text-xs text-[#64748B]">
                    <span>$10</span>
                    <span className="font-bold text-[#0F172A]">${maxPrice}</span>
                  </div>
                </div>
              </FilterSection>
            </FilterPanel>
          </aside>

          {/* Catalog Content Area */}
          <main className="lg:col-span-9 space-y-6">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <FilterButton
                  activeCount={activeFilters.length}
                  onClick={() => setIsMobileFilterOpen(true)}
                />
                <p className="text-xs font-semibold text-[#0F172A]">
                  Showing <span className="text-[#2563EB] font-bold">{filteredMedicines.length}</span> healthcare products
                </p>
              </div>

              <SortDropdown
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>

            {/* Active Chips */}
            <ActiveFilters
              filters={activeFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleResetFilters}
            />

            {/* Product Grid */}
            {filteredMedicines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMedicines.map((med) => (
                  <MedicineCard
                    key={med.id}
                    medicine={med}
                    onUploadPrescription={(m) => setRxModalMedicine(m)}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search Results State */
              <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
                <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <PackageX className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">No products matched your search</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Try adjusting your search query, category selection, or price filters.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </PageContainer>

      {/* Prescription Upload Simulation Modal */}
      <PrescriptionModal
        medicine={rxModalMedicine}
        isOpen={Boolean(rxModalMedicine)}
        onClose={() => setRxModalMedicine(null)}
      />
    </div>
  );
}
