"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

interface CustomDatePickerProps {
  value: string; // "YYYY-MM-DD"
  onChange: (dateStr: string) => void;
  minDate?: Date;
  placeholder?: string;
  className?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CustomDatePicker({
  value,
  onChange,
  minDate = new Date(),
  placeholder = "Select Date",
  className = "",
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial selected date or default to current date
  const parsedValue = value ? new Date(value + "T00:00:00") : null;
  const initialDate = parsedValue && !isNaN(parsedValue.getTime()) ? parsedValue : new Date();

  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const formatted = `${currentYear}-${monthStr}-${dayStr}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    const monthStr = String(today.getMonth() + 1).padStart(2, "0");
    const dayStr = String(today.getDate()).padStart(2, "0");
    const formatted = `${today.getFullYear()}-${monthStr}-${dayStr}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  // Calendar Math
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Format trigger label
  const formattedDisplay = parsedValue && !isNaN(parsedValue.getTime())
    ? `${MONTH_NAMES[parsedValue.getMonth()].slice(0, 3)} ${parsedValue.getDate()}, ${parsedValue.getFullYear()}`
    : placeholder;

  const today = new Date();
  const isCurrentMonthToday =
    today.getMonth() === currentMonth && today.getFullYear() === currentYear;

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs sm:text-sm flex items-center justify-between text-left transition-all cursor-pointer shadow-xs ${
          isOpen
            ? "border-[#FF6700] ring-2 ring-[#FF6700]/15 text-slate-900"
            : "border-[#FF6700]/30 text-slate-800 hover:border-[#FF6700]"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-3.5 h-3.5 text-[#FF6700] shrink-0" />
          <span className={value ? "font-bold text-slate-900" : "text-slate-400 font-normal"}>
            {formattedDisplay}
          </span>
        </div>
        {value && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>

      {/* Brand Orange Custom Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1.5 w-72 sm:w-80 bg-white border border-[#FF6700]/30 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-orange-100">
            <div className="font-heading font-bold text-sm text-[#090D16]">
              <span className="text-[#FF6700]">{MONTH_NAMES[currentMonth]}</span>{" "}
              <span>{currentYear}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-orange-50 text-slate-600 hover:text-[#FF6700] transition-colors cursor-pointer"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-orange-50 text-slate-600 hover:text-[#FF6700] transition-colors cursor-pointer"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_LABELS.map((day) => (
              <span
                key={day}
                className="text-[10px] font-mono font-bold uppercase text-slate-400 py-1"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Previous Month Overflow Days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <span
                key={`prev-${i}`}
                className="text-[11px] font-medium text-slate-300 py-1.5 opacity-40 cursor-default"
              >
                {daysInPrevMonth - firstDayIndex + i + 1}
              </span>
            ))}

            {/* Current Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                parsedValue &&
                parsedValue.getDate() === day &&
                parsedValue.getMonth() === currentMonth &&
                parsedValue.getFullYear() === currentYear;

              const isToday = isCurrentMonthToday && today.getDate() === day;

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`text-xs font-semibold py-1.5 rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FF6700] text-white font-bold shadow-md scale-105"
                      : isToday
                      ? "bg-orange-50 text-[#FF6700] font-bold border border-[#FF6700]/40 hover:bg-[#FF6700] hover:text-white"
                      : "text-slate-800 hover:bg-orange-50 hover:text-[#FF6700]"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-orange-100 text-xs">
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-[#FF6700] hover:text-[#E55C00] font-bold cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
