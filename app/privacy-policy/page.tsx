import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Mail, MapPin, Phone, Shield } from "lucide-react";
import { CustomerCareHero } from "@/components/customer-care/CustomerCareHero";
import {
  PolicyLayout,
  type PolicyTocItem,
} from "@/components/customer-care/PolicyLayout";
import { STORE_SUPPORT_INFO } from "@/lib/customer-care";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy | Mitul's Market",
  description:
    "Learn how Mitul's Market collects, stores, uses, and protects your information across browsing, shopping cart, and checkout.",
  path: "/privacy-policy",
  keywords: [
    "privacy policy",
    "data protection",
    "cookies",
    "customer privacy",
  ],
});

const PRIVACY_TOC: readonly PolicyTocItem[] = [
  { id: "introduction", number: 1, title: "Introduction" },
  {
    id: "information-we-collect",
    number: 2,
    title: "Information We Collect",
  },
  { id: "personal-information", number: 3, title: "Personal Information" },
  { id: "account-information", number: 4, title: "Account Information" },
  {
    id: "order-and-payment-information",
    number: 5,
    title: "Order and Payment Information",
  },
  {
    id: "how-we-use-your-information",
    number: 6,
    title: "How We Use Your Information",
  },
  {
    id: "cookies-and-tracking-technologies",
    number: 7,
    title: "Cookies and Tracking Technologies",
  },
  { id: "third-party-services", number: 8, title: "Third-Party Services" },
  { id: "data-security", number: 9, title: "Data Security" },
  { id: "data-retention", number: 10, title: "Data Retention" },
  { id: "your-privacy-rights", number: 11, title: "Your Privacy Rights" },
  { id: "information-sharing", number: 12, title: "Information Sharing" },
  { id: "childrens-privacy", number: 13, title: "Children's Privacy" },
  { id: "policy-updates", number: 14, title: "Policy Updates" },
  { id: "contact-information", number: 15, title: "Contact Information" },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full flex-1 bg-[#F8FAFC] text-[#1E293B]">
      <CustomerCareHero
        badge="Legal & Privacy"
        breadcrumbLabel="Privacy Policy"
        title="Privacy Policy"
        subtitle="Your privacy matters to us. Learn how we collect, use, and protect your information."
        lastUpdated={STORE_SUPPORT_INFO.policyLastUpdated}
      />

      <PolicyLayout
        tocTitle="Privacy Sections"
        tocItems={PRIVACY_TOC}
        banner={
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-[22px] border border-gray-200/80 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                  Browser Cart Only
                </p>
                <p className="mt-1.5 text-sm font-bold text-[#1E293B]">
                  No Login Required to Browse
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                  Cart items persist locally on your device without collecting
                  personal contact info until checkout.
                </p>
              </div>
              <div className="rounded-[22px] border border-gray-200/80 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                  Google Sign-In Design
                </p>
                <p className="mt-1.5 text-sm font-bold text-[#1E293B]">
                  No Stored Passwords or Cards
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                  Mitul&apos;s Market never stores Google passwords or raw card
                  and CVV numbers in browser storage.
                </p>
              </div>
              <div className="rounded-[22px] border border-gray-200/80 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                  Data Usage &amp; Control
                </p>
                <p className="mt-1.5 text-sm font-bold text-[#1E293B]">
                  Zero Selling of Personal Data
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                  Information is used strictly for storefront functionality,
                  orders, and Customer Care support.
                </p>
              </div>
            </div>

            <div
              role="note"
              className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-white px-4 py-3.5 text-sm text-[#1E293B] shadow-xs sm:px-5"
            >
              <AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-[#4F46E5]"
                aria-hidden="true"
              />
              <p className="text-xs leading-relaxed text-[#475569] sm:text-sm">
                <strong className="text-[#1E293B]">
                  Transparency Notice:
                </strong>{" "}
                This Privacy Policy describes both how browser-side storefront
                features (such as your shopping cart and demo order preview
                settings) currently handle data and how account, checkout, and
                payment features will handle data once backend database, Google
                OAuth, and payment gateway integrations are enabled. Mitul&apos;s
                Market makes no unverified claims of third-party security
                certifications or regulatory audits.
              </p>
            </div>
          </div>
        }
      >
        {/* 1. Introduction */}
        <section
          id="introduction"
          aria-labelledby="heading-introduction"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-introduction"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            1. Introduction
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Welcome to Mitul&apos;s Market (&ldquo;we,&rdquo;
            &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We operate an online
            electronics and lifestyle storefront dedicated to providing curated
            products, transparent pricing, and responsive customer care.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            This Privacy Policy explains what information may be collected when
            you browse product pages, manage your shopping cart, submit checkout
            details, check order history, or contact customer support—and how
            that information is handled responsibly.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section
          id="information-we-collect"
          aria-labelledby="heading-information-we-collect"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-information-we-collect"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            2. Information We Collect
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Depending on which features you use on Mitul&apos;s Market, we may
            collect or process information across three practical categories:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#475569] sm:text-base">
            <li>
              <strong className="text-[#1E293B]">
                Information you enter directly:
              </strong>{" "}
              contact and shipping form inputs at Checkout, promo code entries,
              search queries, and support messages sent by email or phone.
            </li>
            <li>
              <strong className="text-[#1E293B]">
                Information stored locally in your browser:
              </strong>{" "}
              shopping cart item selections, quantities, applied promo codes,
              and temporary session preferences kept on your device so your cart
              survives page reloads.
            </li>
            <li>
              <strong className="text-[#1E293B]">
                Account and transaction records (when connected):
              </strong>{" "}
              identity fields returned by Google OAuth sign-in and order/payment
              status metadata stored by connected backend services.
            </li>
          </ul>
        </section>

        {/* 3. Personal Information */}
        <section
          id="personal-information"
          aria-labelledby="heading-personal-information"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-personal-information"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            3. Personal Information
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            When you prepare a purchase at Checkout or reach out to Customer
            Support, personal contact details requested may include your{" "}
            <strong className="text-[#1E293B]">Full Name</strong>,{" "}
            <strong className="text-[#1E293B]">Email Address</strong>,{" "}
            <strong className="text-[#1E293B]">Phone Number</strong>, and full{" "}
            <strong className="text-[#1E293B]">Shipping Address</strong>{" "}
            (street address, city, state/province, postal code, and country).
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            You do not need to submit personal details solely to browse the
            catalog, search products, or add items to your browser shopping
            cart.
          </p>
        </section>

        {/* 4. Account Information */}
        <section
          id="account-information"
          aria-labelledby="heading-account-information"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-account-information"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            4. Account Information
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Customer authentication on Mitul&apos;s Market is designed around
            Google Sign-In. When OAuth credentials are configured and you choose
            to sign in with Google, Google shares authorized basic profile
            identifiers (such as your name, email address, and verified customer
            ID) so your order history remains scoped strictly to your account.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Mitul&apos;s Market does not ask for or store your Google account
            password. When authentication backend credentials are not
            configured, no external Google login redirect occurs and order views
            operate strictly with clearly marked sample demonstration data.
          </p>
        </section>

        {/* 5. Order and Payment Information */}
        <section
          id="order-and-payment-information"
          aria-labelledby="heading-order-and-payment-information"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-order-and-payment-information"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            5. Order and Payment Information
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            When order placement is enabled through a connected backend database,
            order records store purchased product IDs, quantities, item prices,
            shipping fees, coupon discounts, delivery status history, tracking
            numbers, payment method selection (such as UPI, Card, or Cash on
            Delivery), and payment status labels.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Mitul&apos;s Market does not collect or store raw credit/debit card
            numbers, CVV codes, or banking PINs inside storefront browser
            storage or client forms. Card and UPI processing must occur directly
            through a dedicated, external payment gateway when enabled.
          </p>
        </section>

        {/* 6. How We Use Your Information */}
        <section
          id="how-we-use-your-information"
          aria-labelledby="heading-how-we-use-your-information"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-how-we-use-your-information"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            6. How We Use Your Information
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#475569] sm:text-base">
            <li>
              Preserve items, quantities, and promo codes inside your shopping
              cart across page navigation and reloads.
            </li>
            <li>
              Validate delivery contact details and shipping addresses before
              checkout completion.
            </li>
            <li>
              Display customer-scoped order tracking timelines, invoices, and
              order cancellation state changes in My Orders.
            </li>
            <li>
              Respond to questions, shipping inquiries, and return requests sent
              to Customer Care.
            </li>
            <li>
              Maintain core website reliability, diagnose errors, and protect
              against unauthorized order lookups or misuse.
            </li>
          </ul>
        </section>

        {/* 7. Cookies and Tracking Technologies */}
        <section
          id="cookies-and-tracking-technologies"
          aria-labelledby="heading-cookies-and-tracking-technologies"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-cookies-and-tracking-technologies"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            7. Cookies and Tracking Technologies
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            The current Mitul&apos;s Market storefront primarily relies on
            essential browser{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-[#1E293B]">
              localStorage
            </code>{" "}
            and{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-[#1E293B]">
              sessionStorage
            </code>{" "}
            keys (such as{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-[#1E293B]">
              mituls_market_cart
            </code>{" "}
            and{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-[#1E293B]">
              mituls_market_cart_coupon
            </code>
            ) strictly to power shopping cart persistence, promo code
            state, and demo state continuity on your device.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            When authentication sessions are enabled, standard HTTP session
            cookies may be set strictly for maintaining your signed-in session.
            We do not currently run third-party behavioral advertising pixels on
            this storefront. You can clear site storage or block cookies anytime
            in your browser settings.
          </p>
        </section>

        {/* 8. Third-Party Services */}
        <section
          id="third-party-services"
          aria-labelledby="heading-third-party-services"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-third-party-services"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            8. Third-Party Services
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Certain features rely on external providers or links outside
            Mitul&apos;s Market, each governed by their own privacy policies:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#475569] sm:text-base">
            <li>
              <strong className="text-[#1E293B]">Google Fonts &amp; OAuth:</strong>{" "}
              Typography loading via Next.js font optimization and optional
              customer authentication through Google Identity services.
            </li>
            <li>
              <strong className="text-[#1E293B]">
                Logistics &amp; Courier Partners (upon live fulfillment):
              </strong>{" "}
              Delivery address details shared solely to ship ordered packages.
            </li>
            <li>
              <strong className="text-[#1E293B]">
                Payment Gateways (upon live checkout integration):
              </strong>{" "}
              Authorized financial processors handling card or UPI payments.
            </li>
            <li>
              <strong className="text-[#1E293B]">Direct Support Channels:</strong>{" "}
              Contact links on our site open your device&apos;s native email or
              phone application to reach Mitul&apos;s Market Customer Care
              directly.
            </li>
          </ul>
        </section>

        {/* 9. Data Security */}
        <section
          id="data-security"
          aria-labelledby="heading-data-security"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-[#4F46E5]" aria-hidden="true" />
            <h2
              id="heading-data-security"
              className="text-xl font-bold text-[#1E293B] sm:text-2xl"
            >
              9. Data Security
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            We apply practical application-level precautions such as schema
            input validation, customer-scoped order filtering when
            authenticated, avoiding browser storage of raw financial card
            credentials, and escaping user-supplied fields in generated HTML
            invoices.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            No internet transmission or browser storage mechanism is completely
            immune to risk. Mitul&apos;s Market does not claim unverified
            independent security certifications (such as ISO 27001, SOC 2, or
            PCI-DSS audits). When deploying or integrating live credentials,
            ensure connections run over HTTPS/TLS with properly secured
            environment secrets.
          </p>
        </section>

        {/* 10. Data Retention */}
        <section
          id="data-retention"
          aria-labelledby="heading-data-retention"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-data-retention"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            10. Data Retention
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Cart items and applied promo codes stored in{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-[#1E293B]">
              localStorage
            </code>{" "}
            remain on your browser until you remove the items, clear the cart,
            or clear your browser data. Session-scoped items stored in{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-[#1E293B]">
              sessionStorage
            </code>{" "}
            (such as temporary demo order overrides) clear when your browser tab
            or session ends.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Retention periods for live server-side order and accounting records
            are subject to operational business confirmation once backend
            database storage is connected.
          </p>
        </section>

        {/* 11. Your Privacy Rights */}
        <section
          id="your-privacy-rights"
          aria-labelledby="heading-your-privacy-rights"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-your-privacy-rights"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            11. Your Privacy Rights
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            You control data stored directly in your browser and can remove cart
            entries individually in{" "}
            <Link
              href="/cart"
              className="font-semibold text-[#4F46E5] hover:underline"
            >
              Shopping Cart
            </Link>{" "}
            or clear site data via browser settings at any time. For any data
            held in backend customer or support records, you may contact us to
            request access, correction, or deletion of personal contact
            information, subject to verification and lawful record-keeping
            requirements.
          </p>
        </section>

        {/* 12. Information Sharing */}
        <section
          id="information-sharing"
          aria-labelledby="heading-information-sharing"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-information-sharing"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            12. Information Sharing
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            We do not sell your personal contact or shopping details to data
            brokers or unrelated marketers. When live commerce fulfillment is
            active, relevant shipping, order, or payment details are shared
            strictly on an as-needed basis with delivery carriers, payment
            processors, or authorities when required by applicable legal
            processes.
          </p>
        </section>

        {/* 13. Children's Privacy */}
        <section
          id="childrens-privacy"
          aria-labelledby="heading-childrens-privacy"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-childrens-privacy"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            13. Children&apos;s Privacy
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Mitul&apos;s Market is intended for general adult shoppers and is
            not directed toward children. We do not knowingly collect personal
            contact or shipping information from minors without parental or
            guardian involvement. If you believe a child has submitted personal
            contact details to our support channels, contact us so we can review
            and remove that information promptly.
          </p>
        </section>

        {/* 14. Policy Updates */}
        <section
          id="policy-updates"
          aria-labelledby="heading-policy-updates"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-policy-updates"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            14. Policy Updates
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            We may revise this Privacy Policy as new technical capabilities—such
            as backend databases, live Google OAuth sign-in, or payment gateway
            integrations—are activated or as store practices evolve. Whenever we
            update this document, we update the{" "}
            <strong className="text-[#1E293B]">Last Updated</strong> date shown
            at the top of this page.
          </p>
        </section>

        {/* 15. Contact Information */}
        <section
          id="contact-information"
          aria-labelledby="heading-contact-information"
          className="scroll-mt-32 md:scroll-mt-28 rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2
            id="heading-contact-information"
            className="text-xl font-bold text-[#1E293B] sm:text-2xl"
          >
            15. Contact Information
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            If you have privacy questions or data requests regarding Mitul&apos;s
            Market, please contact us using our verified store details:
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

