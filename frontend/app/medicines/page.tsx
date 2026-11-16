"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Pill, Cross, Sparkles, Shield, Wind, Activity, Moon, HeartPulse, RefreshCw, PackageX } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MedicineCard } from "@/components/medicines/MedicineCard";
import { PrescriptionModal } from "@/components/medicines/PrescriptionModal";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { FilterSection } from "@/components/filters/FilterSection";
import { SortDropdown, SortOption } from "@/components/filters/SortDropdown";
import { ActiveFilters, ActiveFilterTag } from "@/components/filters/ActiveFilters";
import { MEDICINES_DATA } from "@/data/medicines";
import { Medicine } from "@/types/medicine";
import { formatCurrency } from "@/lib/formatCurrency";
import { apiRequest } from "@/lib/apiClient";

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
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState("recommended");

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [rxModalMedicine, setRxModalMedicine] = useState<Medicine | null>(null);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [apiMedicines, setApiMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live medicines from backend API
  useEffect(() => {
    const fetchMedicines = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest("/api/medicines");
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: Medicine[] = res.data.map((bMed: any) => ({
            id: bMed._id || bMed.id,
            name: bMed.name,
            category: (bMed.category as any) || "Pain Relief",
            price: bMed.price || 100,
            originalPrice: bMed.price ? Math.round(bMed.price * 1.25) : 125,
            availability: bMed.stock && bMed.stock > 0 ? "In Stock" : "Out of Stock",
            requiresPrescription: bMed.prescriptionRequired || false,
            dosage: bMed.strength || "500mg",
            manufacturer: bMed.manufacturer || "Pharma Lab",
            packSize: bMed.dosageForm || "10 Tablets",
            description: bMed.description || "",
            rating: 4.7,
            reviewCount: 42,
            tags: ["Fast Delivery", "Genuine"],
            accentColor: "bg-[#2563EB]",
            iconName: "Pill",
          }));
          setApiMedicines(mapped);
        } else {
          setApiMedicines(MEDICINES_DATA);
        }
      } catch (err) {
        setApiMedicines(MEDICINES_DATA);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const activeMedicinesData = apiMedicines.length > 0 ? apiMedicines : MEDICINES_DATA;

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
    if (maxPrice < 2000) {
      list.push({ key: "maxPrice", label: `Price ≤ ${formatCurrency(maxPrice)}`, value: String(maxPrice) });
    }
    return list;
  }, [selectedCategory, selectedRxFilter, maxPrice]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Products");
    setSelectedRxFilter("all");
    setMaxPrice(2000);
    setSortBy("recommended");
  };

  const handleRemoveFilter = (key: string) => {
    if (key === "cat") setSelectedCategory("All Products");
    if (key === "otc" || key === "rx") setSelectedRxFilter("all");
    if (key === "maxPrice") setMaxPrice(2000);
  };

  const filteredMedicines = useMemo(() => {
    return activeMedicinesData.filter((med) => {
      const matchesSearch =
        searchQuery === "" ||
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Products" || med.category === selectedCategory;

      const matchesRx =
        selectedRxFilter === "all" ||
        (selectedRxFilter === "otc" && !med.requiresPrescription) ||
        (selectedRxFilter === "rx" && med.requiresPrescription);

      const matchesPrice = med.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesRx && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedRxFilter, maxPrice, sortBy, activeMedicinesData]);

  const handleOpenRxModal = (med: Medicine) => {
    setRxModalMedicine(med);
    setIsRxModalOpen(true);
  };

  return (
    <div className="py-10 lg:py-16 bg-[#F8FAFC] min-h-screen">
      <PageContainer>
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="info">Pharmacy Catalog</Badge>
            <span className="text-xs text-[#64748B] font-semibold">100% Genuine Medicines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Order Medicines Online
          </h1>
          <p className="text-base text-[#64748B] max-w-2xl">
            Browse genuine medicines, health products, and OTC supplements with quick home delivery.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by medicine name, generic salt, or category..."
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
          {/* Sidebar Filters */}
          <div className="lg:col-span-3">
            <FilterPanel
              isOpenMobile={isMobileFilterOpen}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
              onReset={handleResetFilters}
              activeCount={activeFilters.length}
            >
              <FilterSection title="Categories">
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        selectedCategory === cat.name
                          ? "bg-blue-50 text-[#2563EB]"
                          : "text-[#64748B] hover:bg-slate-50"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Prescription Status">
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedRxFilter("all")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      selectedRxFilter === "all" ? "bg-blue-50 text-[#2563EB]" : "text-[#64748B] hover:bg-slate-50"
                    }`}
                  >
                    All Products
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRxFilter("otc")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      selectedRxFilter === "otc" ? "bg-blue-50 text-[#2563EB]" : "text-[#64748B] hover:bg-slate-50"
                    }`}
                  >
                    Over The Counter (OTC)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRxFilter("rx")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      selectedRxFilter === "rx" ? "bg-blue-50 text-[#2563EB]" : "text-[#64748B] hover:bg-slate-50"
                    }`}
                  >
                    Rx Required
                  </button>
                </div>
              </FilterSection>

              <FilterSection title="Max Price">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-[#0F172A]">
                    <span>Up to</span>
                    <span className="text-[#2563EB]">{formatCurrency(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                  />
                </div>
              </FilterSection>
            </FilterPanel>
          </div>

          {/* Catalog Grid */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">
                Showing {filteredMedicines.length} products
              </span>
              <SortDropdown
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>

            {filteredMedicines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMedicines.map((med) => (
                  <MedicineCard
                    key={med.id}
                    medicine={med}
                    onUploadPrescription={(m) => handleOpenRxModal(m)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-3xl bg-white border border-[#E2E8F0] space-y-4 p-8">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <PackageX className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#0F172A]">No products found</h3>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                    We couldn&apos;t find any medicines or healthcare products matching your query.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleResetFilters} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </PageContainer>

      {/* Prescription Upload Modal */}
      <PrescriptionModal
        medicine={rxModalMedicine}
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
      />
    </div>
  );
}
