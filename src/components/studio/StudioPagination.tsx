"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface UsePaginationResult<T> {
  page: number;
  setPage: (next: number) => void;
  pageSize: number;
  setPageSize: (next: number) => void;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  pagedItems: T[];
  pageSizeOptions: number[];
}

export function usePagination<T>(
  items: T[],
  defaultPageSize = 12,
  pageSizeOptions: number[] = [6, 12, 24, 48]
): UsePaginationResult<T> {
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize;
  const endIndex = Math.min(totalItems, startIndex + pageSize);

  const pagedItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  );

  const setPage = (next: number) => {
    setPageState(Math.max(1, Math.min(next, totalPages)));
  };

  const setPageSize = (next: number) => {
    setPageSizeState(next);
    setPageState(1);
  };

  return {
    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    pagedItems,
    pageSizeOptions,
  };
}

interface StudioPaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
  variant?: "light" | "dark";
}

function buildPageNumbers(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: Array<number | "ellipsis"> = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) pages.push("ellipsis");
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < total - 1) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export default function StudioPagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 12, 24, 48],
  itemLabel = "entries",
  variant = "light",
}: StudioPaginationProps) {
  if (totalItems === 0) return null;

  const isDark = variant === "dark";
  const pageNumbers = buildPageNumbers(page, totalPages);

  return (
    <div
      className={`rounded-2xl border px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs ${
        isDark
          ? "bg-[#141B2B] border-zinc-800 text-zinc-300"
          : "bg-white border-zinc-200 text-zinc-600 shadow-xs"
      }`}
    >
      {/* Left: Show entries selector & range summary */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <label className="inline-flex items-center gap-1.5 font-medium">
          <span className={isDark ? "text-zinc-400" : "text-zinc-500"}>Show</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Entries per page"
            className={`rounded-lg border px-2 py-1 text-xs font-bold cursor-pointer focus:outline-none ${
              isDark
                ? "bg-zinc-900 border-zinc-700 text-white focus:border-[#7F48ED]"
                : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-[#7F48ED]"
            }`}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className={isDark ? "text-zinc-400" : "text-zinc-500"}>entries</span>
        </label>

        <span className={isDark ? "text-zinc-700" : "text-zinc-300"}>|</span>

        <span className="font-medium">
          Showing{" "}
          <strong className={isDark ? "text-white font-mono" : "text-zinc-900 font-mono"}>
            {startIndex + 1}–{endIndex}
          </strong>{" "}
          of{" "}
          <strong className={isDark ? "text-white font-mono" : "text-zinc-900 font-mono"}>
            {totalItems}
          </strong>{" "}
          {itemLabel}
        </span>
      </div>

      {/* Right: Page controls */}
      <div className="flex items-center gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={`h-7 px-2.5 rounded-lg border font-bold inline-flex items-center gap-1 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            isDark
              ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-[#7F48ED] hover:text-white"
              : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-[#7F48ED] hover:text-[#7F48ED]"
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        {pageNumbers.map((item, idx) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className={`px-1.5 font-mono ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`h-7 min-w-[28px] px-2 rounded-lg border font-mono font-bold transition cursor-pointer ${
                item === page
                  ? "bg-[#7F48ED] border-[#7F48ED] text-white shadow-xs"
                  : isDark
                  ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                  : "bg-white border-zinc-200 text-zinc-700 hover:border-[#7F48ED] hover:text-[#7F48ED]"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={`h-7 px-2.5 rounded-lg border font-bold inline-flex items-center gap-1 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            isDark
              ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-[#7F48ED] hover:text-white"
              : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-[#7F48ED] hover:text-[#7F48ED]"
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

