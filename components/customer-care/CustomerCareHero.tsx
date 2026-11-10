import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface CustomerCareHeroProps {
  badge: string;
  breadcrumbLabel: string;
  title: string;
  subtitle: string;
  lastUpdated?: string;
}

export function CustomerCareHero({
  badge,
  breadcrumbLabel,
  title,
  subtitle,
  lastUpdated,
}: CustomerCareHeroProps) {
  return (
    <section
      aria-labelledby="page-heading"
      className="border-b border-gray-200/80 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs sm:text-sm"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-semibold text-[#4F46E5] transition-colors hover:text-[#4338CA]"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
              <span>Home</span>
            </Link>
            <span className="inline-flex items-center gap-1.5">
              <ChevronRight
                className="h-3.5 w-3.5 text-gray-400 sm:h-4 sm:w-4"
                aria-hidden="true"
              />
              <span className="font-medium text-[#64748B]">Customer Care</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ChevronRight
                className="h-3.5 w-3.5 text-gray-400 sm:h-4 sm:w-4"
                aria-hidden="true"
              />
              <span className="font-semibold text-[#1E293B]">
                {breadcrumbLabel}
              </span>
            </span>
          </nav>

          {lastUpdated && (
            <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-[#4F46E5]">
              Last Updated: {lastUpdated}
            </span>
          )}
        </div>

        <div className="mt-6 max-w-3xl">
          <span className="inline-flex w-fit rounded-full bg-[#EEF2FF] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
            {badge}
          </span>
          <h1
            id="page-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl lg:text-[42px] lg:leading-tight"
          >
            {title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#64748B] sm:text-lg">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}

export default CustomerCareHero;
