import type { ReactNode } from "react";
import { PolicyTocSidebar } from "@/components/customer-care/PolicyTocSidebar";

export interface PolicyTocItem {
  id: string;
  number: number;
  title: string;
}

interface PolicyLayoutProps {
  tocTitle?: string;
  tocItems: readonly PolicyTocItem[];
  banner?: ReactNode;
  children: ReactNode;
}

export function PolicyLayout({
  tocTitle = "Table of Contents",
  tocItems,
  banner,
  children,
}: PolicyLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 text-[#1E293B] sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      {banner && <div className="mb-8">{banner}</div>}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[270px_1fr] xl:grid-cols-[290px_1fr] lg:items-start">
        <PolicyTocSidebar tocTitle={tocTitle} tocItems={tocItems} />

        {/* Policy Body Sections */}
        <article className="min-w-0 space-y-6 text-[#1E293B]">{children}</article>
      </div>
    </div>
  );
}

export default PolicyLayout;
