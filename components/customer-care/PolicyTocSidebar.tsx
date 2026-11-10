"use client";

import { useEffect, useState } from "react";
import { ArrowUp, List } from "lucide-react";
import type { PolicyTocItem } from "@/components/customer-care/PolicyLayout";
import { cn } from "@/utils/cn";

interface PolicyTocSidebarProps {
  tocTitle: string;
  tocItems: readonly PolicyTocItem[];
}

export function PolicyTocSidebar({
  tocTitle,
  tocItems,
}: PolicyTocSidebarProps) {
  const [activeId, setActiveId] = useState<string>(tocItems[0]?.id ?? "");

  useEffect(() => {
    const sections = tocItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const atPageBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 48;
        if (atPageBottom) {
          setActiveId(sections[sections.length - 1].id);
          return;
        }

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible.length > 0 && visible[0].target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-110px 0px -60% 0px",
        threshold: [0, 0.25],
      }
    );

    function handleScroll() {
      const atPageBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 48;
      if (atPageBottom) {
        setActiveId(sections[sections.length - 1].id);
        return;
      }

      if (window.scrollY <= 80) {
        setActiveId(sections[0].id);
      }
    }

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [tocItems]);

  return (
    <aside className="rounded-[24px] border border-gray-200/80 bg-white p-5 shadow-xs lg:sticky lg:top-28">
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3.5">
        <div className="flex items-center gap-2">
          <List className="h-4 w-4 text-[#4F46E5]" aria-hidden="true" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E293B]">
            {tocTitle}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top of page"
          className="hidden cursor-pointer items-center gap-1 rounded-full bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-semibold text-[#64748B] transition-colors hover:bg-indigo-50 hover:text-[#4F46E5] lg:inline-flex"
        >
          <ArrowUp className="h-3 w-3" aria-hidden="true" />
          <span>Top</span>
        </button>
      </div>

      <nav aria-label={tocTitle} className="mt-3">
        <ol className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1">
          {tocItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setActiveId(item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "flex items-start gap-2 rounded-xl px-2.5 py-2 text-xs transition-colors sm:text-sm",
                    isActive
                      ? "bg-indigo-50/90 font-semibold text-[#4F46E5]"
                      : "font-medium text-[#475569] hover:bg-indigo-50/60 hover:text-[#4F46E5]"
                  )}
                >
                  <span className="shrink-0 font-bold text-[#4F46E5]">
                    {item.number}.
                  </span>
                  <span className="leading-snug">{item.title}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
