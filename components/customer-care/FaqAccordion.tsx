"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { FaqEntry } from "@/lib/customer-care";
import { cn } from "@/utils/cn";

interface FaqAccordionProps {
  items: readonly FaqEntry[];
  defaultOpenIds?: readonly string[];
  accordionGroupLabel?: string;
}

export function FaqAccordion({
  items,
  defaultOpenIds = [],
  accordionGroupLabel = "Frequently asked questions",
}: FaqAccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(() => [...defaultOpenIds]);

  const allExpanded =
    items.length > 0 && items.every((item) => openIds.includes(item.id));

  function toggleItem(id: string) {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleToggleAll() {
    setOpenIds(allExpanded ? [] : items.map((item) => item.id));
  }

  return (
    <div
      role="region"
      aria-label={accordionGroupLabel}
      className="overflow-hidden rounded-[24px] border border-gray-200/80 bg-white shadow-xs"
    >
      {items.length > 1 && (
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#F8FAFC]/70 px-5 py-2.5 sm:px-6">
          <span className="text-xs font-medium text-[#64748B]">
            {items.length} {items.length === 1 ? "question" : "questions"}
          </span>
          <button
            type="button"
            onClick={handleToggleAll}
            className="cursor-pointer text-xs font-semibold text-[#4F46E5] transition-colors hover:text-[#4338CA] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/50 rounded-sm"
          >
            {allExpanded ? "Collapse all" : "Expand all"}
          </button>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {items.map((item) => {
          const isOpen = openIds.includes(item.id);
          const panelId = `faq-panel-${item.id}`;
          const triggerId = `faq-trigger-${item.id}`;

          return (
            <div key={item.id} className="px-5 py-4 sm:px-6 sm:py-5">
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/50 focus-visible:ring-offset-2"
              >
                <span
                  className={cn(
                    "text-base font-bold transition-colors sm:text-lg",
                    isOpen ? "text-[#4F46E5]" : "text-[#1E293B]"
                  )}
                >
                  {item.question}
                </span>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                    isOpen
                      ? "border-[#4F46E5] bg-[#4F46E5] text-white"
                      : "border-gray-200 bg-[#F8FAFC] text-[#64748B]"
                  )}
                >
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </span>
              </button>

              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className="mt-3 pr-2 text-sm leading-relaxed text-[#475569] sm:pr-10 sm:text-base"
                >
                  <p>{item.answer}</p>
                  {item.actionLink && (
                    <div className="mt-3">
                      <Link
                        href={item.actionLink.href}
                        className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/70 px-3.5 py-1.5 text-xs font-semibold text-[#4F46E5] transition-colors hover:bg-indigo-100/80"
                      >
                        <span>{item.actionLink.label}</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FaqAccordion;
