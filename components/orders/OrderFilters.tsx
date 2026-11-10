"use client";

import { ArrowUpDown, Calendar, ChevronDown, Search, X } from "lucide-react";
import { ORDER_DATE_RANGE_OPTIONS, ORDER_FILTER_TABS } from "@/lib/orders";
import type { OrderDateRange, OrderFilterStatus, OrderSortOrder } from "@/types";
import { cn } from "@/utils/cn";

interface OrderFiltersProps {
  activeStatus: OrderFilterStatus;
  onStatusChange: (status: OrderFilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateRange: OrderDateRange;
  onDateRangeChange: (range: OrderDateRange) => void;
  sortBy: OrderSortOrder;
  onSortChange: (sort: OrderSortOrder) => void;
}

export function OrderFilters({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortChange,
}: OrderFiltersProps) {
  return (
    <div className="space-y-4 rounded-[24px] border border-gray-200/80 bg-white p-4 shadow-xs sm:p-5">
      {/* Status Tabs */}
      <nav
        aria-label="Order status filters"
        className="flex items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0"
      >
        {ORDER_FILTER_TABS.map((status) => {
          const isSelected = activeStatus === status;
          return (
            <button
              key={status}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onStatusChange(status)}
              className={cn(
                "shrink-0 cursor-pointer whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/50 focus-visible:ring-offset-2",
                isSelected
                  ? "bg-[#4F46E5] text-white shadow-sm shadow-[#4F46E5]/25"
                  : "border border-gray-200 bg-[#F8FAFC] text-[#1E293B] hover:border-gray-300 hover:bg-gray-100"
              )}
            >
              {status}
            </button>
          );
        })}
      </nav>

      {/* Search, Date Range & Sort Controls */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
        {/* Search by Product Name or Order ID */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search orders by product name or order ID..."
            aria-label="Search orders by product name or order ID"
            className="h-11 w-full rounded-full border border-gray-200 bg-[#F8FAFC] pl-10 pr-10 text-sm text-[#1E293B] placeholder:text-gray-400 transition-all duration-200 focus:border-[#4F46E5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear order search"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-200/70 hover:text-gray-700"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Date Filter */}
        <div className="relative">
          <Calendar
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <select
            value={dateRange}
            onChange={(event) =>
              onDateRangeChange(event.target.value as OrderDateRange)
            }
            aria-label="Filter by order date"
            className="h-11 w-full cursor-pointer appearance-none rounded-full border border-gray-200 bg-[#F8FAFC] pl-10 pr-9 text-sm font-medium text-[#1E293B] transition-colors hover:border-gray-300 focus:border-[#4F46E5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15 md:w-44"
          >
            {ORDER_DATE_RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
        </div>

        {/* Sort Newest / Oldest */}
        <div className="relative">
          <ArrowUpDown
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <select
            value={sortBy}
            onChange={(event) =>
              onSortChange(event.target.value as OrderSortOrder)
            }
            aria-label="Sort orders"
            className="h-11 w-full cursor-pointer appearance-none rounded-full border border-gray-200 bg-[#F8FAFC] pl-10 pr-9 text-sm font-medium text-[#1E293B] transition-colors hover:border-gray-300 focus:border-[#4F46E5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15 md:w-44"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

export default OrderFilters;
