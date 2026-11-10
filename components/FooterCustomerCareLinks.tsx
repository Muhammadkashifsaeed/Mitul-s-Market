"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  FileText,
  HelpCircle,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface CustomerCareLinkItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const customerCareLinks: readonly CustomerCareLinkItem[] = [
  { label: "Help Center", href: "/help-center", icon: HelpCircle },
  { label: "Shipping & Returns", href: "/shipping-returns", icon: Truck },
  { label: "Privacy Policy", href: "/privacy-policy", icon: ShieldCheck },
  { label: "Terms & Conditions", href: "/terms-conditions", icon: FileText },
] as const;

export function FooterCustomerCareLinks() {
  const pathname = usePathname();
  const normalizedPathname = pathname ? pathname.replace(/\/+$/, "") || "/" : "/";

  return (
    <ul className="space-y-3">
      {customerCareLinks.map(({ label, href, icon: Icon }) => {
        const isActive =
          normalizedPathname === href ||
          normalizedPathname.startsWith(`${href}/`);

        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group inline-flex items-center gap-2 rounded-sm text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F2937]",
                isActive
                  ? "font-semibold text-white"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors duration-200",
                  isActive
                    ? "text-[#818CF8]"
                    : "text-[#6366F1] group-hover:text-[#818CF8]"
                )}
                aria-hidden="true"
              />
              <span>{label}</span>
              <ChevronRight
                className={cn(
                  "h-3.5 w-3.5 shrink-0 transition-all duration-200",
                  isActive
                    ? "translate-x-0.5 text-[#818CF8] opacity-100"
                    : "-translate-x-1 opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
                )}
                aria-hidden="true"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default FooterCustomerCareLinks;

