"use client";

import { useMemo, useState } from "react";
import {
  CreditCard,
  Package,
  RotateCcw,
  Search,
  Truck,
  UserCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { CustomerCareHero } from "@/components/customer-care/CustomerCareHero";
import { FaqAccordion } from "@/components/customer-care/FaqAccordion";
import { SupportContactCard } from "@/components/customer-care/SupportContactCard";
import {
  HELP_CENTER_CATEGORIES,
  type HelpFaqCategory,
} from "@/lib/customer-care";
import { cn } from "@/utils/cn";

const categoryIcons: Record<HelpFaqCategory["label"], LucideIcon> = {
  "Account & Login": UserCheck,
  Orders: Package,
  Payments: CreditCard,
  Shipping: Truck,
  "Returns & Refunds": RotateCcw,
};

export function HelpCenterView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    return HELP_CENTER_CATEGORIES.filter(
      (category) =>
        selectedCategoryId === "all" || category.id === selectedCategoryId
    )
      .map((category) => {
        if (!normalizedQuery) {
          return category;
        }

        const categoryMatches =
          category.label.toLowerCase().includes(normalizedQuery) ||
          category.description.toLowerCase().includes(normalizedQuery);

        const matchingItems = category.items.filter(
          (item) =>
            categoryMatches ||
            item.question.toLowerCase().includes(normalizedQuery) ||
            item.answer.toLowerCase().includes(normalizedQuery)
        );

        return {
          ...category,
          items: matchingItems,
        };
      })
      .filter((category) => category.items.length > 0);
  }, [normalizedQuery, selectedCategoryId]);

  const totalMatchingQuestions = useMemo(
    () =>
      filteredCategories.reduce(
        (total, category) => total + category.items.length,
        0
      ),
    [filteredCategories]
  );

  function handleResetSearch() {
    setSearchQuery("");
    setSelectedCategoryId("all");
  }

  return (
    <main className="w-full flex-1 bg-[#F8FAFC] text-[#1E293B]">
      <CustomerCareHero
        badge="Customer Support"
        breadcrumbLabel="Help Center"
        title="How Can We Help You?"
        subtitle="Find answers to your questions and get the support you need."
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* A. Search Help Section */}
        <section
          aria-labelledby="help-search-heading"
          className="rounded-[28px] border border-gray-200/80 bg-white p-5 shadow-xs sm:p-7"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-lg">
              <h2
                id="help-search-heading"
                className="text-lg font-bold text-[#1E293B] sm:text-xl"
              >
                Search Help Topics
              </h2>
              <p className="mt-1 text-xs text-[#64748B] sm:text-sm">
                Filter across Account &amp; Login, Orders, Payments, Shipping,
                and Returns &amp; Refunds.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search for help..."
                aria-label="Search for help"
                className="h-12 w-full rounded-full border border-gray-200 bg-[#F8FAFC] pl-11 pr-10 text-sm text-[#1E293B] placeholder:text-gray-400 transition-all focus:border-[#4F46E5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search query"
                  className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200/70 hover:text-gray-700"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Topic Filter Pills */}
          <div
            role="group"
            aria-label="Filter help topics by category"
            className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-5 sm:gap-2.5"
          >
            <button
              type="button"
              aria-pressed={selectedCategoryId === "all"}
              onClick={() => setSelectedCategoryId("all")}
              className={cn(
                "shrink-0 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm",
                selectedCategoryId === "all"
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "border border-gray-200 bg-white text-[#1E293B] hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              All Topics
            </button>

            {HELP_CENTER_CATEGORIES.map((category) => {
              const Icon = categoryIcons[category.label];
              const isSelected = selectedCategoryId === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={cn(
                    "inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm",
                    isSelected
                      ? "bg-[#4F46E5] text-white shadow-xs"
                      : "border border-gray-200 bg-white text-[#1E293B] hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Quick Topic Summary Cards (shown on default overview) */}
        {!normalizedQuery && selectedCategoryId === "all" && (
          <section
            aria-label="Browse help categories"
            className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            {HELP_CENTER_CATEGORIES.map((category) => {
              const Icon = categoryIcons[category.label];
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(category.id)}
                  className="group flex cursor-pointer flex-col items-start rounded-[22px] border border-gray-200/80 bg-white p-5 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4F46E5]/40 hover:shadow-md"
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5] transition-colors group-hover:bg-[#4F46E5] group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-[#F8FAFC] px-2.5 py-0.5 text-[11px] font-semibold text-[#64748B]">
                      {category.items.length} FAQs
                    </span>
                  </div>
                  <h2 className="mt-3.5 text-base font-bold text-[#1E293B] group-hover:text-[#4F46E5]">
                    {category.label}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#64748B]">
                    {category.description}
                  </p>
                </button>
              );
            })}
          </section>
        )}

        {/* Search Results Summary Bar */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-[#64748B]">
          <p aria-live="polite" data-testid="help-results-count">
            Showing {totalMatchingQuestions}{" "}
            {totalMatchingQuestions === 1 ? "help article" : "help articles"}
            {normalizedQuery ? ` matching "${searchQuery.trim()}"` : ""}
          </p>
          {(normalizedQuery || selectedCategoryId !== "all") && (
            <button
              type="button"
              onClick={handleResetSearch}
              className="cursor-pointer font-semibold text-[#4F46E5] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* B. Frequently Asked Questions Sections */}
        {filteredCategories.length > 0 ? (
          <div className="mt-6 space-y-10">
            {filteredCategories.map((category) => {
              const Icon = categoryIcons[category.label];
              const defaultExpanded = normalizedQuery
                ? category.items.map((item) => item.id)
                : [category.items[0]?.id].filter((v): v is string =>
                    Boolean(v)
                  );

              return (
                <section
                  key={category.id}
                  id={category.id}
                  aria-labelledby={`faq-heading-${category.id}`}
                  className="scroll-mt-32 space-y-4 md:scroll-mt-28"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2
                        id={`faq-heading-${category.id}`}
                        className="text-xl font-bold tracking-tight text-[#1E293B] sm:text-2xl"
                      >
                        {category.label}
                      </h2>
                      <p className="mt-0.5 text-sm text-[#64748B]">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <FaqAccordion
                    key={`${category.id}-${normalizedQuery}-${selectedCategoryId}`}
                    items={category.items}
                    defaultOpenIds={defaultExpanded}
                    accordionGroupLabel={`${category.label} FAQs`}
                  />
                </section>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] border border-gray-200/80 bg-white px-6 py-16 text-center shadow-xs">
            <h2 className="text-xl font-bold text-[#1E293B]">
              No matching help topics found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
              Try searching with broader keywords such as &ldquo;order&rdquo;,
              &ldquo;refund&rdquo;, &ldquo;shipping&rdquo;, or
              &ldquo;Google&rdquo;, or reset your filters to browse all topics.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleResetSearch}
                className="cursor-pointer rounded-full bg-[#4F46E5] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#4338CA]"
              >
                Show All Help Topics
              </button>
            </div>
          </div>
        )}

        {/* C. Contact Support Section */}
        <div className="mt-12 lg:mt-14">
          <SupportContactCard />
        </div>
      </div>
    </main>
  );
}

export default HelpCenterView;
