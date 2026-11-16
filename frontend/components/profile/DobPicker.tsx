"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight, Check, X, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DobPickerProps {
  value?: string; // Expects YYYY-MM-DD or formatted string
  onChange: (formattedDate: string) => void;
  onError?: (errorMessage: string) => void;
  label?: string;
  disabled?: boolean;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const getDaysInMonth = (monthIndex: number, year: number): number => {
  const daysMap = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysMap[monthIndex] || 31;
};

/**
 * Parses input string into day, monthIndex, year
 */
const parseDateString = (dateStr?: string) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  let day = 15;
  let monthIndex = 7; // August
  let year = 1994;

  if (!dateStr) {
    return { day, monthIndex, year };
  }

  // Check YYYY-MM-DD
  const isoMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const parsedYear = parseInt(isoMatch[1], 10);
    const parsedMonth = parseInt(isoMatch[2], 10) - 1;
    const parsedDay = parseInt(isoMatch[3], 10);
    if (!isNaN(parsedYear) && parsedMonth >= 0 && parsedMonth < 12 && !isNaN(parsedDay)) {
      return { day: parsedDay, monthIndex: parsedMonth, year: parsedYear };
    }
  }

  // Check Date object parsing
  const parsedDate = new Date(dateStr);
  if (!isNaN(parsedDate.getTime())) {
    return {
      day: parsedDate.getDate(),
      monthIndex: parsedDate.getMonth(),
      year: parsedDate.getFullYear(),
    };
  }

  return { day, monthIndex, year };
};

/**
 * Format to human readable format: e.g. "15 August 2004"
 */
export const formatDobHuman = (dateStr?: string): string => {
  if (!dateStr) return "";
  const { day, monthIndex, year } = parseDateString(dateStr);
  const formattedDay = day < 10 ? `0${day}` : `${day}`;
  const monthName = MONTH_NAMES[monthIndex];
  return `${formattedDay} ${monthName} ${year}`;
};

/**
 * Format to ISO string YYYY-MM-DD
 */
export const formatDobIso = (day: number, monthIndex: number, year: number): string => {
  const formattedDay = day < 10 ? `0${day}` : `${day}`;
  const formattedMonth = monthIndex + 1 < 10 ? `0${monthIndex + 1}` : `${monthIndex + 1}`;
  return `${year}-${formattedMonth}-${formattedDay}`;
};

export const DobPicker: React.FC<DobPickerProps> = ({
  value = "",
  onChange,
  onError,
  label = "Date of Birth",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"day" | "month" | "year">("day");

  const initialParsed = useMemo(() => parseDateString(value), [value]);

  const [selectedDay, setSelectedDay] = useState<number>(initialParsed.day);
  const [selectedMonth, setSelectedMonth] = useState<number>(initialParsed.monthIndex);
  const [selectedYear, setSelectedYear] = useState<number>(initialParsed.year);

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const yearList = useMemo(() => {
    const years: number[] = [];
    for (let y = currentYear; y >= currentYear - 120; y--) {
      years.push(y);
    }
    return years;
  }, [currentYear]);

  const modalRef = useRef<HTMLDivElement>(null);
  const selectedYearRef = useRef<HTMLButtonElement>(null);

  // Scroll to selected year when year step opens
  useEffect(() => {
    if (isOpen && step === "year" && selectedYearRef.current) {
      selectedYearRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [isOpen, step]);

  // Max days based on current month & year selection
  const maxDays = useMemo(() => {
    return getDaysInMonth(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleOpenPicker = () => {
    if (!disabled) {
      const { day, monthIndex, year } = parseDateString(value);
      setSelectedDay(day);
      setSelectedMonth(monthIndex);
      setSelectedYear(year);
      setStep("day");
      setIsOpen(true);
    }
  };

  const handleSelectMonth = (idx: number) => {
    setSelectedMonth(idx);
    const newMaxDays = getDaysInMonth(idx, selectedYear);
    if (selectedDay > newMaxDays) {
      setSelectedDay(newMaxDays);
    }
  };

  const handleSelectYear = (y: number) => {
    setSelectedYear(y);
    const newMaxDays = getDaysInMonth(selectedMonth, y);
    if (selectedDay > newMaxDays) {
      setSelectedDay(newMaxDays);
    }
  };

  const handleConfirmDate = () => {
    const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
    const today = new Date();

    // Reset time components for accurate date comparison
    today.setHours(23, 59, 59, 999);

    if (isNaN(selectedDate.getTime()) || selectedDate > today) {
      if (onError) {
        onError("Please select a valid date of birth (cannot be in the future).");
      }
      return;
    }

    const isoString = formatDobIso(selectedDay, selectedMonth, selectedYear);
    onChange(isoString);
    setIsOpen(false);
  };

  const formattedDisplay = value ? formatDobHuman(value) : "Select date of birth";

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="block text-xs font-semibold text-[#0F172A]">{label}</label>}

      {/* Input Trigger Button */}
      <button
        type="button"
        onClick={handleOpenPicker}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all text-left font-medium text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
          value
            ? "border-slate-300 bg-white text-[#0F172A]"
            : "border-slate-200 bg-slate-50 text-[#64748B]"
        } hover:border-[#2563EB] ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Calendar className="h-4 w-4 text-[#2563EB] shrink-0" />
          <span className="truncate">{formattedDisplay}</span>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
      </button>

      {/* Modal / Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="dob-picker-title"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh] sm:max-h-[600px]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
                <div>
                  <h3 id="dob-picker-title" className="font-extrabold text-base text-[#0F172A]">
                    Select Date of Birth
                  </h3>
                  <p className="text-xs text-[#64748B]">Step {step === "day" ? "1" : step === "month" ? "2" : "3"} of 3: Select {step.toUpperCase()}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-200/60 text-slate-500 hover:text-slate-900 transition-colors"
                  aria-label="Close date picker"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Step Navigation Breadcrumbs */}
              <div className="grid grid-cols-3 gap-1 p-2 bg-slate-100/70 border-b border-slate-200/60 text-center shrink-0">
                <button
                  type="button"
                  onClick={() => setStep("day")}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                    step === "day"
                      ? "bg-white text-[#2563EB] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Day: <span className="underline decoration-blue-400">{selectedDay < 10 ? `0${selectedDay}` : selectedDay}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep("month")}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                    step === "month"
                      ? "bg-white text-[#2563EB] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Month: <span className="underline decoration-blue-400">{MONTH_NAMES[selectedMonth].substring(0, 3)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep("year")}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                    step === "year"
                      ? "bg-white text-[#2563EB] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Year: <span className="underline decoration-blue-400">{selectedYear}</span>
                </button>
              </div>

              {/* Step Content Area */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
                {/* STEP 1: DAY SELECTOR */}
                {step === "day" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#0F172A] uppercase tracking-wider">
                        Select Day (1–{maxDays})
                      </span>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center">
                      {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => {
                        const isSelected = d === selectedDay;
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSelectedDay(d)}
                            className={`h-10 w-full rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-[#2563EB] text-white shadow-md scale-105"
                                : "bg-slate-50 text-[#0F172A] hover:bg-slate-100 border border-slate-200/60"
                            }`}
                          >
                            {d < 10 ? `0${d}` : d}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: MONTH SELECTOR */}
                {step === "month" && (
                  <div className="space-y-4">
                    <span className="font-bold text-xs text-[#0F172A] uppercase tracking-wider block">
                      Select Month
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {MONTH_NAMES.map((mName, idx) => {
                        const isSelected = idx === selectedMonth;
                        return (
                          <button
                            key={mName}
                            type="button"
                            onClick={() => handleSelectMonth(idx)}
                            className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all border ${
                              isSelected
                                ? "bg-[#2563EB] text-white border-[#2563EB] shadow-md"
                                : "bg-slate-50 text-[#0F172A] border-slate-200/80 hover:bg-slate-100"
                            }`}
                          >
                            <span>{mName}</span>
                            {isSelected && <Check className="h-4 w-4 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 3: YEAR SELECTOR */}
                {step === "year" && (
                  <div className="space-y-4">
                    <span className="font-bold text-xs text-[#0F172A] uppercase tracking-wider block">
                      Select Year ({currentYear - 120} – {currentYear})
                    </span>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
                      {yearList.map((y) => {
                        const isSelected = y === selectedYear;
                        return (
                          <button
                            key={y}
                            ref={isSelected ? selectedYearRef : null}
                            type="button"
                            onClick={() => handleSelectYear(y)}
                            className={`py-2.5 px-2 rounded-xl text-xs font-bold text-center transition-all ${
                              isSelected
                                ? "bg-[#2563EB] text-white shadow-md scale-105 ring-2 ring-blue-400"
                                : "bg-slate-50 text-[#0F172A] hover:bg-slate-100 border border-slate-200/60"
                            }`}
                          >
                            {y}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
                {step !== "day" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<ArrowLeft className="h-4 w-4" />}
                    onClick={() => {
                      if (step === "year") setStep("month");
                      else if (step === "month") setStep("day");
                    }}
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {step === "day" && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    onClick={() => setStep("month")}
                    className="bg-[#2563EB] hover:bg-blue-700 font-bold"
                  >
                    Next: Month →
                  </Button>
                )}

                {step === "month" && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    onClick={() => setStep("year")}
                    className="bg-[#2563EB] hover:bg-blue-700 font-bold"
                  >
                    Next: Year →
                  </Button>
                )}

                {step === "year" && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    leftIcon={<Check className="h-4 w-4" />}
                    onClick={handleConfirmDate}
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                  >
                    Done ✓
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
