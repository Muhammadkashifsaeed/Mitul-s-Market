import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, FileText, Mail, MapPin, Phone } from "lucide-react";
import { CustomerCareHero } from "@/components/customer-care/CustomerCareHero";
import {
  PolicyLayout,
  type PolicyTocItem,
} from "@/components/customer-care/PolicyLayout";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from "@/lib/cart";
import { STORE_SUPPORT_INFO } from "@/lib/customer-care";
import { createPageMetadata } from "@/lib/seo";
import { formatCurrency } from "@/utils/format";

export const metadata: Metadata = createPageMetadata({
  title: "Terms & Conditions | Mitul's Market",
  description:
    "Review the website usage terms, product pricing guidelines, order handling, and customer policies for Mitul's Market.",
  path: "/terms-conditions",
  keywords: [
    "terms and conditions",
    "terms of use",
    "store policy",
    "order terms",
  ],
});

const TERMS_TOC: readonly PolicyTocItem[] = [
  { id: "acceptance-of-terms", number: 1, title: "Acceptance of Terms" },
  {
    id: "website-use-eligibility",
    number: 2,
    title: "Website Use & Eligibility",
  },
  { id: "accounts-and-login", number: 3, title: "Accounts & Google Sign-In" },
  {
    id: "products-and-availability",
    number: 4,
    title: "Products, Descriptions & Stock",
  },
  {
    id: "pricing-and-promotions",
    number: 5,
    title: "Pricing, Shipping Fees & Promo Codes",
  },
  {
    id: "orders-and-payments",
    number: 6,
    title: "Orders & Payment Integration Notice",
  },
  {
    id: "cancellations-and-returns",
    number: 7,
    title: "Delivery, Cancellations & Returns",
  },
  {
    id: "intellectual-property",
    number: 8,
    title: "Intellectual Property",
  },
  {
    id: "prohibited-conduct",
    number: 9,
    title: "Prohibited Conduct",
  },
  {
    id: "limitation-and-disclaimers",
    number: 10,
    title: "Service Disclaimers & Liability",
  },
  {
    id: "changes-and-review",
    number: 11,
    title: "Changes to These Terms",
  },
  { id: "contact-details", number: 12, title: "Contact Information" },
] as const;

export default function TermsConditionsPage() {
  const formattedThreshold = formatCurrency(FREE_SHIPPING_THRESHOLD);
  const formattedShippingFee = formatCurrency(STANDARD_SHIPPING_FEE);

  return (
    <main className="w-full flex-1 bg-[#F8FAFC] text-[#1E293B]">
      <CustomerCareHero
        badge="Legal & Store Terms"
        breadcrumbLabel="Terms & Conditions"
        title="Terms & Conditions"
        subtitle="Understand the terms, storefront guidelines, and service conditions that apply when browsing or shopping at Mitul's Market."
        lastUpdated={STORE_SUPPORT_INFO.policyLastUpdated}
      />

      <PolicyLayout
        tocTitle="Terms Sections"
        tocItems={TERMS_TOC}
        banner={
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-[22px] border border-gray-200/80 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                  Pricing &amp; Delivery Rules
                </p>
                <p className="mt-1.5 text-sm font-bold text-[#1E293B]">
                  Free Over {formattedThreshold}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                  INR catalog pricing with {formattedShippingFee} standard
                  delivery at or below {formattedThreshold}.
                </p>
              </div>
              <div className="rounded-[22px] border border-gray-200/80 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                  Order Controls
                </p>
                <p className="mt-1.5 text-sm font-bold text-[#1E293B]">
                  Pre-Shipment Cancellations
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                  Eligible orders in Processing status can be cancelled directly
                  inside My Orders.
                </p>
              </div>
              <div className="rounded-[22px] border border-gray-200/80 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                  Catalog Accuracy
                </p>
                <p className="mt-1.5 text-sm font-bold text-[#1E293B]">
                  Stock-Enforced Quantities
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                  Cart quantities validate against live tracked product stock
                  levels across the storefront.
                </p>
              </div>
            </div>

            <div
              role="note"
              className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3.5 text-sm text-amber-900 sm:px-5"
            >
              <AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                aria-hidden="true"
              />
              <p className="text-xs leading-relaxed text-amber-800 sm:text-sm">
                <strong className="text-amber-900">
                  Storefront &amp; Business Confirmation Notice:
                </strong>{" "}
                These Terms &amp; Conditions accurately describe active storefront
                functionality (catalog stock limits, cart pricing rules, pre-shipment
                cancellation behavior, and current demo order / OAuth readiness).
                Formal commercial terms, governing jurisdiction, and payment
                settlement terms remain subject to final business &amp; legal
                confirmation before accepting live payments.
              </p>
            </div>
          </div>
        }
      >
        {/* 1. Acceptance of Terms */}
        <section
          id="acceptance-of-terms"
          aria-labelledby="heading-acceptance"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="h-5 w-5 text-[#4F46E5]" aria-hidden="true" />
            <h2
              id="heading-acceptance"
              className="text-xl font-bold text-[#1E293B] sm:text-2xl"
            >
              1. Acceptance of Terms
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            By accessing or using the Mitul&apos;s Market website, browsing our
            catalog, adding products to your cart, or interacting with our
            Customer Care pages, you agree to follow these Terms &amp;
            Conditions along with our{" "}
            <Link
              href="/privacy-policy"
              className="font-semibold text-[#4F46E5] hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/shipping-returns"
              className="font-semibold text-[#4F46E5] hover:underline"
            >
              Shipping &amp; Returns
            </Link>{" "}
            policies.
          </p>
        </section>

        {/* 2. Website Use & Eligibility */}
        <section
          id="website-use-eligibility"
          aria-labelledby="heading-eligibility"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-eligibility"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            2. Website Use &amp; Eligibility
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            You may use Mitul&apos;s Market solely for lawful personal browsing
            and shopping purposes. Anyone submitting checkout contact or delivery
            details represents that they are legally permitted to place orders
            or act with appropriate guardian consent and that provided contact
            and shipping details are accurate.
          </p>
        </section>

        {/* 3. Accounts & Google Sign-In */}
        <section
          id="accounts-and-login"
          aria-labelledby="heading-accounts"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-accounts"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            3. Accounts &amp; Google Sign-In
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            When authentication is enabled, customer sign-in operates through
            Google OAuth so customer orders are scoped strictly to the signed-in
            customer profile. You are responsible for maintaining the security of
            your Google Account credentials used to access the storefront.
          </p>
        </section>

        {/* 4. Products, Descriptions & Stock */}
        <section
          id="products-and-availability"
          aria-labelledby="heading-products"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-products"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            4. Products, Descriptions &amp; Stock
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Each catalog product displays its category, price, rating summary,
            product description, and tracked inventory quantity. Adding items to
            your cart or adjusting quantities checks available stock limits; we
            reserve the right to update stock availability, correct catalog
            inaccuracies, or discontinue items without prior notice.
          </p>
        </section>

        {/* 5. Pricing, Shipping Fees & Promo Codes */}
        <section
          id="pricing-and-promotions"
          aria-labelledby="heading-pricing"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-pricing"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            5. Pricing, Shipping Fees &amp; Promo Codes
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            All catalog prices are displayed in Indian Rupees (INR). Under our
            active storefront pricing configuration, orders strictly over{" "}
            <strong className="text-[#1E293B]">{formattedThreshold}</strong>{" "}
            receive Free Shipping, while orders at or below{" "}
            <strong className="text-[#1E293B]">{formattedThreshold}</strong>{" "}
            incur a{" "}
            <strong className="text-[#1E293B]">{formattedShippingFee}</strong>{" "}
            standard shipping fee.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Promotional codes (such as demo codes currently configured in the
            storefront for testing cart calculations) apply strictly when the
            cart meets minimum subtotal conditions and may be modified or ended
            before live production promotions launch.
          </p>
        </section>

        {/* 6. Orders & Payment Integration Notice */}
        <section
          id="orders-and-payments"
          aria-labelledby="heading-orders-payments"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-orders-payments"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            6. Orders &amp; Payment Integration Notice
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Live order placement and financial payment processing require active
            backend order database, authentication, and payment gateway
            integrations. Until those integrations are enabled, sample order
            records displayed on{" "}
            <Link
              href="/orders"
              className="font-semibold text-[#4F46E5] hover:underline"
            >
              My Orders
            </Link>{" "}
            are demonstration fixtures only, and form validation on{" "}
            <Link
              href="/checkout"
              className="font-semibold text-[#4F46E5] hover:underline"
            >
              Checkout
            </Link>{" "}
            does not trigger real payments or shipments.
          </p>
        </section>

        {/* 7. Delivery, Cancellations & Returns */}
        <section
          id="cancellations-and-returns"
          aria-labelledby="heading-cancellations"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-cancellations"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            7. Delivery, Cancellations &amp; Returns
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Pre-shipment cancellation on eligible{" "}
            <strong className="text-[#1E293B]">Processing</strong> orders is
            available from the order detail view in My Orders. Shipping fees,
            indicative delivery targets, return eligibility guidelines, and
            refund review practices are governed by our{" "}
            <Link
              href="/shipping-returns"
              className="font-semibold text-[#4F46E5] hover:underline"
            >
              Shipping &amp; Returns Policy
            </Link>
            .
          </p>
        </section>

        {/* 8. Intellectual Property */}
        <section
          id="intellectual-property"
          aria-labelledby="heading-ip"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-ip"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            8. Intellectual Property
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            The Mitul&apos;s Market name, site design, layout components, custom
            product copy, and storefront assets displayed on this website belong
            to Mitul&apos;s Market or their respective licensors. You may not
            copy, scrape, or republish storefront branding or content for
            competing commercial use without permission.
          </p>
        </section>

        {/* 9. Prohibited Conduct */}
        <section
          id="prohibited-conduct"
          aria-labelledby="heading-prohibited"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-prohibited"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            9. Prohibited Conduct
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#475569] sm:text-base">
            <li>
              Attempting to access another customer&apos;s order history or
              bypassing authentication/ownership protections.
            </li>
            <li>
              Automating abusive traffic, scraping, or interfering with API
              endpoints, cart state, or inventory behavior.
            </li>
            <li>
              Submitting misleading contact details, false support claims, or
              fraudulent payment/cancellation requests.
            </li>
          </ul>
        </section>

        {/* 10. Service Disclaimers & Liability */}
        <section
          id="limitation-and-disclaimers"
          aria-labelledby="heading-liability"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-liability"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            10. Service Disclaimers &amp; Liability
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            The storefront is provided on an &ldquo;as-available&rdquo; basis.
            While we strive to keep product details, stock counts, and policy
            pages accurate, Mitul&apos;s Market cannot guarantee uninterrupted
            service or zero typographical errors and reserves the right to pause
            or correct transactions impacted by obvious technical errors, subject
            to applicable law and pending final legal counsel confirmation.
          </p>
        </section>

        {/* 11. Changes to These Terms */}
        <section
          id="changes-and-review"
          aria-labelledby="heading-changes"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-changes"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            11. Changes to These Terms
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            We may revise these Terms &amp; Conditions as live payment
            gateways, courier integrations, or business policies are finalized.
            Updates become effective upon posting with the revised{" "}
            <strong className="text-[#1E293B]">Last Updated</strong> date at the
            top of this page.
          </p>
        </section>

        {/* 12. Contact Information */}
        <section
          id="contact-details"
          aria-labelledby="heading-terms-contact"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-terms-contact"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            12. Contact Information
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            For questions regarding these Terms &amp; Conditions, reach out via
            our verified Customer Care channels:
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-4">
              <Mail className="h-5 w-5 shrink-0 text-[#4F46E5]" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#64748B]">Email</p>
                <a
                  href={`mailto:${STORE_SUPPORT_INFO.email}`}
                  className="block truncate text-sm font-bold text-[#1E293B] hover:text-[#4F46E5]"
                >
                  {STORE_SUPPORT_INFO.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-4">
              <Phone className="h-5 w-5 shrink-0 text-[#4F46E5]" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#64748B]">Phone</p>
                <a
                  href={STORE_SUPPORT_INFO.phoneHref}
                  className="text-sm font-bold text-[#1E293B] hover:text-[#4F46E5]"
                >
                  {STORE_SUPPORT_INFO.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-4">
              <MapPin className="h-5 w-5 shrink-0 text-[#4F46E5]" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#64748B]">Location</p>
                <p className="text-sm font-bold text-[#1E293B]">
                  {STORE_SUPPORT_INFO.location}
                </p>
              </div>
            </div>
          </div>
        </section>
      </PolicyLayout>
    </main>
  );
}

