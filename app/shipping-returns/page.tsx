import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  MapPin,
  Package,
  PackageCheck,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Truck,
} from "lucide-react";
import { CustomerCareHero } from "@/components/customer-care/CustomerCareHero";
import { FaqAccordion } from "@/components/customer-care/FaqAccordion";
import { SupportContactCard } from "@/components/customer-care/SupportContactCard";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from "@/lib/cart";
import { SHIPPING_RETURNS_FAQS } from "@/lib/customer-care";
import { createPageMetadata } from "@/lib/seo";
import { formatCurrency } from "@/utils/format";

export const metadata: Metadata = createPageMetadata({
  title: "Shipping & Returns | Mitul's Market",
  description:
    "Review Mitul's Market shipping charges, free shipping threshold over ₹999, delivery process, return eligibility, and refund guidelines.",
  path: "/shipping-returns",
  keywords: [
    "shipping policy",
    "free delivery",
    "returns",
    "refund policy",
    "delivery tracking",
  ],
});

const DELIVERY_PROCESS_STEPS = [
  {
    step: 1,
    title: "Order Placed",
    description:
      "Your cart items and delivery address are recorded at checkout and an Order ID is assigned.",
    icon: ClipboardList,
  },
  {
    step: 2,
    title: "Order Confirmed",
    description:
      "Order items, stock availability, and payment status are verified before fulfillment begins.",
    icon: CheckCircle2,
  },
  {
    step: 3,
    title: "Order Processed",
    description:
      "Products pass quality inspection and are securely packed for courier dispatch.",
    icon: Package,
  },
  {
    step: 4,
    title: "Order Shipped",
    description:
      "Parcel is handed to the shipping partner and tracking details appear in My Orders.",
    icon: Truck,
  },
  {
    step: 5,
    title: "Order Delivered",
    description:
      "Shipment arrives at your delivery address and marks the completion of your order.",
    icon: PackageCheck,
  },
] as const;

export default function ShippingReturnsPage() {
  const formattedThreshold = formatCurrency(FREE_SHIPPING_THRESHOLD);
  const formattedShippingFee = formatCurrency(STANDARD_SHIPPING_FEE);

  return (
    <main className="w-full flex-1 bg-[#F8FAFC] text-[#1E293B]">
      <CustomerCareHero
        badge="Logistics & Policies"
        breadcrumbLabel="Shipping & Returns"
        title="Shipping & Returns"
        subtitle="Everything you need to know about delivery, shipping, and returns."
      />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Key Shipping & Returns Highlights + Quick In-Page Jumps */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[22px] border border-gray-200/80 bg-white p-5 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Free Delivery
              </p>
              <p className="mt-1.5 text-xl font-bold text-emerald-700">
                Over {formattedThreshold}
              </p>
              <p className="mt-1 text-xs text-[#64748B]">
                Active cart shipping threshold
              </p>
            </div>
            <div className="rounded-[22px] border border-gray-200/80 bg-white p-5 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Standard Fee
              </p>
              <p className="mt-1.5 text-xl font-bold text-[#1E293B]">
                {formattedShippingFee}
              </p>
              <p className="mt-1 text-xs text-[#64748B]">
                Orders of {formattedThreshold} or less
              </p>
            </div>
            <div className="rounded-[22px] border border-gray-200/80 bg-white p-5 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Delivery Window
              </p>
              <p className="mt-1.5 text-xl font-bold text-[#4F46E5]">
                2–3 Days
              </p>
              <p className="mt-1 text-xs text-amber-800">
                Suggested target (pending SLA confirmation)
              </p>
            </div>
            <div className="rounded-[22px] border border-gray-200/80 bg-white p-5 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Easy Returns Tag
              </p>
              <p className="mt-1.5 text-xl font-bold text-[#1E293B]">
                7-Day Policy
              </p>
              <p className="mt-1 text-xs text-amber-800">
                Terms subject to business confirmation
              </p>
            </div>
          </div>

          <nav
            aria-label="Shipping and returns sections"
            className="flex flex-wrap items-center gap-2"
          >
            {[
              { label: "Shipping Information", href: "#shipping-info-heading" },
              { label: "Delivery Process", href: "#delivery-process-heading" },
              { label: "Return Policy", href: "#return-policy-heading" },
              { label: "Refund Policy", href: "#refund-policy-heading" },
              { label: "FAQs", href: "#sr-faq-heading" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-[#475569] transition-colors hover:border-[#4F46E5] hover:text-[#4F46E5] sm:text-sm"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Honest Store Configuration vs Pending Confirmation Banner */}
        <div
          role="note"
          className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-4 text-sm text-amber-900 sm:px-5"
        >
          <AlertCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
            aria-hidden="true"
          />
          <div>
            <p className="font-bold">
              Active Storefront Configuration vs. Suggested Policies
            </p>
            <p className="mt-1 text-xs leading-relaxed text-amber-800 sm:text-sm">
              Free shipping strictly above {formattedThreshold} and the{" "}
              {formattedShippingFee} standard shipping fee reflect Mitul&apos;s
              Market&apos;s active cart pricing configuration. Courier SLA
              commitments, warehouse processing cutoffs, return pickup charges,
              and banking refund settlement timelines are marked below as{" "}
              <span className="font-semibold">
                Suggested / Pending Business Confirmation
              </span>{" "}
              rather than guaranteed operational terms.
            </p>
          </div>
        </div>

        {/* A. Shipping Information */}
        <section aria-labelledby="shipping-info-heading">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] sm:text-sm">
              SECTION A &bull; SHIPPING INFORMATION
            </p>
            <h2
              id="shipping-info-heading"
              className="mt-1 scroll-mt-36 text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl md:scroll-mt-32"
            >
              Shipping &amp; Delivery Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* 1. Available Shipping Services */}
            <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                  <Truck className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800">
                  Pending Carrier Activation
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#1E293B]">
                Available Shipping Services
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                Standard Domestic Delivery is planned through established
                courier partners (reflected in demo order records as BlueDart,
                Delhivery, and Ecom Express). Final active carrier availability
                depends on business onboarding and destination pin codes.
              </p>
            </div>

            {/* 2. Order Processing Time */}
            <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800">
                  Suggested Guideline
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#1E293B]">
                Order Processing Time
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                Suggested fulfillment target: 1–2 business days for order
                verification, quality inspection, and secure packing prior to
                dispatch (pending final business confirmation of daily dispatch
                cutoffs and weekend schedules).
              </p>
            </div>

            {/* 3. Estimated Delivery Times */}
            <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800">
                  Suggested Guideline
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#1E293B]">
                Estimated Delivery Times
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                Storefront highlights indicate{" "}
                <strong className="text-[#1E293B]">2–3 Day Delivery</strong>.
                Actual transit speed varies across metro hubs and remote pin
                codes; fixed delivery guarantees remain pending business
                confirmation with logistics partners.
              </p>
            </div>

            {/* 4. Shipping Charges */}
            <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                  <CreditCard className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                  Active Store Rule
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#1E293B]">
                Shipping Charges
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                Orders with a cart merchandise subtotal of{" "}
                <strong className="text-[#1E293B]">
                  {formattedThreshold} or less
                </strong>{" "}
                incur a configured flat standard shipping charge of{" "}
                <strong className="text-[#4F46E5]">
                  {formattedShippingFee}
                </strong>
                . Shipping fees are shown clearly in your Order Summary prior to
                checkout.
              </p>
            </div>

            {/* 5. Free Shipping Eligibility */}
            <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                  Active Store Rule
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#1E293B]">
                Free Shipping Eligibility
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                All orders with a cart subtotal strictly{" "}
                <strong className="text-[#1E293B]">
                  over {formattedThreshold}
                </strong>{" "}
                automatically qualify for{" "}
                <strong className="text-emerald-700">Free Shipping</strong>. The{" "}
                <Link href="/cart" className="font-semibold text-[#4F46E5] hover:underline">
                  Shopping Cart
                </Link>{" "}
                shows how much remains to unlock free delivery.
              </p>
            </div>

            {/* 6. Order Tracking Instructions */}
            <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                  <PackageCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-[#4F46E5]">
                  Self-Service
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#1E293B]">
                Order Tracking Instructions
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                Visit{" "}
                <Link
                  href="/orders"
                  className="font-semibold text-[#4F46E5] hover:underline"
                >
                  My Orders
                </Link>{" "}
                and click <strong className="text-[#1E293B]">View Details</strong>{" "}
                on your order card to inspect the live 5-step tracking timeline,
                carrier name, estimated delivery date, and tracking ID once
                shipped.
              </p>
            </div>
          </div>
        </section>

        {/* B. Visual Delivery Process Timeline */}
        <section
          aria-labelledby="delivery-process-heading"
          className="rounded-[28px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 lg:p-10"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] sm:text-sm">
              SECTION B &bull; STEP-BY-STEP TIMELINE
            </p>
            <h2
              id="delivery-process-heading"
              className="mt-1 scroll-mt-36 text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl md:scroll-mt-32"
            >
              Delivery Process
            </h2>
            <p className="mt-2 text-sm text-[#64748B] sm:text-base">
              Every Mitul&apos;s Market purchase progresses through five
              transparent stages tracked inside your order details view.
            </p>
          </div>

          <ol className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-4">
            {DELIVERY_PROCESS_STEPS.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === DELIVERY_PROCESS_STEPS.length - 1;

              return (
                <li
                  key={item.step}
                  className="relative flex items-start gap-4 lg:flex-col lg:items-start"
                >
                  {/* Vertical connector on mobile/tablet */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="absolute left-6 top-12 bottom-[-24px] w-0.5 bg-indigo-100 lg:hidden"
                    />
                  )}

                  {/* Horizontal connector on desktop */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="hidden lg:block absolute left-14 right-0 top-6 h-0.5 bg-indigo-100"
                    />
                  )}

                  {/* Node badge */}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#4F46E5] text-white shadow-sm shadow-[#4F46E5]/25">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#1E293B] text-[10px] font-bold text-white">
                      {item.step}
                    </span>
                  </div>

                  <div className="lg:mt-4 lg:pr-2">
                    <h3 className="text-base font-bold text-[#1E293B]">
                      {item.step}. {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#64748B] sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* C. Return Policy */}
        <section aria-labelledby="return-policy-heading">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] sm:text-sm">
              SECTION C &bull; RETURN POLICY
            </p>
            <h2
              id="return-policy-heading"
              className="mt-1 scroll-mt-36 text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl md:scroll-mt-32"
            >
              Returns &amp; Eligibility Guidelines
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                  <RotateCcw className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-[#1E293B]">
                  1. Return Eligibility &amp; Window
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                Our storefront displays a{" "}
                <strong className="text-[#1E293B]">7-Day Policy</strong> for
                Easy Returns. Return requests apply to eligible delivered orders
                showing manufacturing defects, shipping damage, or wrong items
                sent. Exact return acceptance windows by category remain subject
                to final business confirmation.
              </p>
            </div>

            <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                  <ClipboardList className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-[#1E293B]">
                  2. Return Request Process
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                Before dispatch, eligible{" "}
                <strong className="text-[#1E293B]">Processing</strong> orders can
                be cancelled directly inside{" "}
                <Link
                  href="/orders"
                  className="font-semibold text-[#4F46E5] hover:underline"
                >
                  My Orders
                </Link>
                . After delivery, send your Order ID, item name, reason for
                return, and photos (for damaged or incorrect goods) to{" "}
                <a
                  href="mailto:support@mitulsmarket.com"
                  className="font-semibold text-[#4F46E5] hover:underline"
                >
                  support@mitulsmarket.com
                </a>{" "}
                or call{" "}
                <a
                  href="tel:+918866877692"
                  className="font-semibold text-[#1E293B] hover:text-[#4F46E5]"
                >
                  +91 88668 77692
                </a>
                .
              </p>
            </div>

            <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                  <PackageCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-[#1E293B]">
                  3. Product Condition Requirements
                </h3>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#475569]">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <span>
                    Product must be unused, unworn, unwashed, and free of
                    customer-inflicted physical damage or scratches.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <span>
                    Original manufacturer box, price tags, warranty cards, and
                    all included accessories/cables must remain intact.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <span>
                    Order ID or invoice reference from your Mitul&apos;s Market
                    purchase must be included with the request.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <ShieldAlert className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-bold text-[#1E293B]">
                    4. Non-Returnable Products &amp; Return Shipping
                  </h3>
                </div>
                <span className="w-fit shrink-0 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800">
                  Pending Confirmation
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                <strong className="text-[#1E293B]">
                  Non-Returnable Products:
                </strong>{" "}
                Suggested exclusions (subject to business confirmation) cover
                opened personal-care or audio in-ear accessories with broken
                hygiene seals, customized items, and goods damaged after
                delivery due to improper use.
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-[#475569]">
                <strong className="text-[#1E293B]">
                  Return Shipping Responsibilities:
                </strong>{" "}
                For verified defective or wrongly dispatched items, reverse
                pickup is suggested at no cost to the customer; preference-based
                return pickup fees remain subject to final business policy.
              </p>
            </div>
          </div>
        </section>

        {/* D. Refund Policy */}
        <section
          aria-labelledby="refund-policy-heading"
          className="rounded-[28px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 lg:p-10"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] sm:text-sm">
                SECTION D &bull; REFUND POLICY
              </p>
              <h2
                id="refund-policy-heading"
                className="mt-1 scroll-mt-36 text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl md:scroll-mt-32"
              >
                How Refunds Are Reviewed &amp; Processed
              </h2>
            </div>

            <span className="w-fit shrink-0 rounded-full bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-800">
              Refund settlement days depend on configured payment gateway
            </span>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5">
              <div className="flex items-center gap-2.5">
                <RefreshCw
                  className="h-4 w-4 text-[#4F46E5]"
                  aria-hidden="true"
                />
                <h3 className="text-base font-bold text-[#1E293B]">
                  1. Refund Request Process
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                Refunds apply when an order paid online is cancelled prior to
                shipment in My Orders or when a delivered item passes approved
                return inspection through Customer Support.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5">
              <div className="flex items-center gap-2.5">
                <CheckCircle2
                  className="h-4 w-4 text-[#4F46E5]"
                  aria-hidden="true"
                />
                <h3 className="text-base font-bold text-[#1E293B]">
                  2. Refund Approval
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                Approved pre-shipment cancellations qualify immediately upon
                status confirmation. Returned parcels require warehouse quality
                verification confirming product condition before refund
                authorization.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5">
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-[#4F46E5]" aria-hidden="true" />
                <h3 className="text-base font-bold text-[#1E293B]">
                  3. Refund Processing
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                Once authorized, the refund instruction is submitted through the
                store&apos;s payment processor. We do not promise fixed
                settlement day counts until live payment gateway rules are
                finalized by the business.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5">
              <div className="flex items-center gap-2.5">
                <Package
                  className="h-4 w-4 text-[#4F46E5]"
                  aria-hidden="true"
                />
                <h3 className="text-base font-bold text-[#1E293B]">
                  4. Refund Status Tracking
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                View real-time order and payment status labels (such as
                Cancelled or Pending) in{" "}
                <Link
                  href="/orders"
                  className="font-semibold text-[#4F46E5] hover:underline"
                >
                  My Orders
                </Link>
                , or email{" "}
                <a
                  href="mailto:support@mitulsmarket.com"
                  className="font-semibold text-[#4F46E5] hover:underline"
                >
                  support@mitulsmarket.com
                </a>{" "}
                with your Order ID for reference details.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <CreditCard
                  className="h-4 w-4 text-[#4F46E5]"
                  aria-hidden="true"
                />
                <h3 className="text-base font-bold text-[#1E293B]">
                  5. Payment Reversal Process
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                For prepaid orders (UPI, Credit Card, or Debit Card), approved
                refunds are designed to reverse back to the original source
                payment instrument. For eligible Cash on Delivery (COD) orders,
                any approved refund requires a verified payout method confirmed
                with Customer Support once COD settlement procedures are
                finalized.
              </p>
            </div>
          </div>
        </section>

        {/* E. Shipping & Returns FAQs (Expandable Accordion) */}
        <section aria-labelledby="sr-faq-heading">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] sm:text-sm">
              SECTION E &bull; FREQUENTLY ASKED QUESTIONS
            </p>
            <h2
              id="sr-faq-heading"
              className="mt-1 scroll-mt-36 text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl md:scroll-mt-32"
            >
              Shipping &amp; Returns FAQs
            </h2>
          </div>

          <FaqAccordion
            items={SHIPPING_RETURNS_FAQS}
            defaultOpenIds={["sr-free-shipping-threshold"]}
            accordionGroupLabel="Shipping and Returns FAQs"
          />
        </section>

        <SupportContactCard
          heading="Questions About a Shipment or Return?"
          description="Keep your Order ID handy from My Orders and reach our team by email or phone."
        />
      </div>
    </main>
  );
}

