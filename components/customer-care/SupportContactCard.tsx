"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  Headset,
  Mail,
  MapPin,
  Package,
  Phone,
} from "lucide-react";
import { STORE_SUPPORT_INFO } from "@/lib/customer-care";

interface SupportContactCardProps {
  heading?: string;
  description?: string;
}

export function SupportContactCard({
  heading = "Still Need Help? Contact Support",
  description = "Reach our Customer Care team directly through Mitul's Market verified contact channels below.",
}: SupportContactCardProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  async function handleCopyEmail() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(STORE_SUPPORT_INFO.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Ignore clipboard permission errors cleanly.
    }
  }

  return (
    <section
      aria-labelledby="contact-support-heading"
      className="rounded-[28px] border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
            <Headset className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2
            id="contact-support-heading"
            className="mt-4 text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl"
          >
            {heading}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#64748B] sm:text-base">
            {description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${STORE_SUPPORT_INFO.email}?subject=${encodeURIComponent(
                "Customer Support Request - Mitul's Market"
              )}`}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#4F46E5] px-6 py-3 text-sm font-bold text-white shadow-sm shadow-[#4F46E5]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-md"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>Contact Support</span>
            </a>

            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-[#1E293B] transition-colors hover:bg-gray-50"
            >
              <Package className="h-4 w-4 text-[#4F46E5]" aria-hidden="true" />
              <span>Check My Orders</span>
            </Link>
          </div>
        </div>

        {/* Verified Customer Support Channels */}
        <div className="grid w-full grid-cols-1 gap-3.5 sm:grid-cols-3 lg:w-auto lg:min-w-[420px] lg:grid-cols-1">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#4F46E5] shadow-xs">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#64748B]">
                  Email Support
                </p>
                <a
                  href={`mailto:${STORE_SUPPORT_INFO.email}`}
                  className="block truncate text-sm font-bold text-[#1E293B] hover:text-[#4F46E5]"
                >
                  {STORE_SUPPORT_INFO.email}
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label="Copy support email address"
              className="inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#475569] transition-colors hover:bg-gray-50 hover:text-[#1E293B]"
            >
              {copiedEmail ? (
                <>
                  <Check
                    className="h-3.5 w-3.5 text-emerald-600"
                    aria-hidden="true"
                  />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#4F46E5] shadow-xs">
              <Phone className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#64748B]">
                Customer Support Phone
              </p>
              <a
                href={STORE_SUPPORT_INFO.phoneHref}
                className="text-sm font-bold text-[#1E293B] hover:text-[#4F46E5]"
              >
                {STORE_SUPPORT_INFO.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#4F46E5] shadow-xs">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#64748B]">
                Store Location
              </p>
              <p className="text-sm font-bold text-[#1E293B]">
                {STORE_SUPPORT_INFO.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SupportContactCard;

