export const STORE_SUPPORT_INFO = {
  brandName: "Mitul's Market",
  email: "support@mitulsmarket.com",
  phoneDisplay: "+91 88668 77692",
  phoneHref: "tel:+918866877692",
  location: "Morbi, Gujarat",
  policyLastUpdated: "November 10, 2026",
} as const;

export interface FaqActionLink {
  label: string;
  href: string;
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  actionLink?: FaqActionLink;
}

export interface HelpFaqCategory {
  id: string;
  label:
    | "Account & Login"
    | "Orders"
    | "Payments"
    | "Shipping"
    | "Returns & Refunds";
  description: string;
  items: readonly FaqEntry[];
}

export const HELP_CENTER_CATEGORIES: readonly HelpFaqCategory[] = [
  {
    id: "account-login",
    label: "Account & Login",
    description:
      "Google Sign-In flow, password guidance, and keeping delivery info accurate.",
    items: [
      {
        id: "create-account",
        question: "How do I create an account?",
        answer:
          "Mitul's Market uses Google Sign-In so you do not need to manage a separate storefront password. Select Continue with Google in the sign-in modal (accessible from Checkout or Orders) once Google OAuth credentials are connected for this store. While authentication setup is pending, your shopping cart items remain saved in your browser storage.",
      },
      {
        id: "reset-password",
        question: "How can I reset my password?",
        answer:
          "Because customer authentication is designed around Google Sign-In rather than storefront-stored passwords, there is no separate Mitul's Market password to reset. If you lose access to your sign-in credentials, please reset your password directly inside your Google Account security settings.",
      },
      {
        id: "update-account-info",
        question: "How do I update my account information?",
        answer:
          "Name and email profile details associated with Google Sign-In reflect your Google Account when authenticated. You can review or edit your delivery full name, email address, phone number, and street shipping address directly on the Checkout page before confirming an order.",
        actionLink: {
          label: "Go to Checkout",
          href: "/checkout",
        },
      },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    description:
      "Tracking parcels, cancelling eligible processing orders, and checking purchase history.",
    items: [
      {
        id: "track-order",
        question: "How can I track my order?",
        answer:
          "Go to the My Orders page from the top navigation or footer, then click View Details on your order. Each order detail view includes a 5-stage Order Tracking Timeline (Order Placed, Order Confirmed, Processing, Shipped, Delivered) along with carrier information, estimated delivery text, and a tracking number once dispatched.",
        actionLink: {
          label: "Open My Orders",
          href: "/orders",
        },
      },
      {
        id: "cancel-order",
        question: "How can I cancel an order?",
        answer:
          "Open My Orders, select View Details on the purchase you wish to cancel, and click Cancel Order followed by Confirm Cancellation. Self-service cancellation is available while an order is in Processing status. Once an order moves to Shipped or Delivered, it can no longer be cancelled online and must be handled through support or returns.",
        actionLink: {
          label: "Manage Orders",
          href: "/orders",
        },
      },
      {
        id: "find-order-history",
        question: "Where can I find my order history?",
        answer:
          "Your full purchase history lives on the My Orders page, linked in both the header navigation and the footer Quick Access column. You can filter orders by status tab (All Orders, Processing, Shipped, Delivered, Cancelled), search by product name or Order ID, filter by date window, or inspect printable order invoices. Note: When no database or login session is connected, sample demonstration orders are shown.",
        actionLink: {
          label: "View Order History",
          href: "/orders",
        },
      },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    description:
      "Supported payment options, Cash on Delivery guidance, and checking payment status.",
    items: [
      {
        id: "accepted-payment-methods",
        question: "Which payment methods are accepted?",
        answer:
          "The Mitul's Market order model supports UPI, Credit Card, Debit Card, and Cash on Delivery (COD). Live online card and UPI checkout requires a connected payment gateway backend; until payment gateway integration is enabled, checkout validates customer and shipping details without processing real charges or creating fake payment confirmations.",
      },
      {
        id: "cash-on-delivery",
        question: "Is Cash on Delivery available?",
        answer:
          "Cash on Delivery is represented as a supported order payment option in our order records, subject to final business confirmation of eligible pin codes, order value caps, and courier rules before live checkout launch. Contact support@mitulsmarket.com if you need confirmation for a specific delivery area.",
      },
      {
        id: "check-payment-status",
        question: "How can I check my payment status?",
        answer:
          "Navigate to My Orders and open View Details for any order. The payment breakdown section shows your selected Payment Method, Payment Status (such as Paid, Pending, or Cancelled), itemized subtotal, shipping charges, applied discounts, and an HTML invoice download option.",
        actionLink: {
          label: "Check Order Payments",
          href: "/orders",
        },
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping",
    description:
      "Shipping rules, address updates before dispatch, and delayed delivery assistance.",
    items: [
      {
        id: "delivery-duration",
        question: "How long does delivery take?",
        answer:
          "Our storefront highlights an indicative 2–3 Day Delivery expectation on the homepage; however, final dispatch cutoff times and region-specific transit durations depend on courier partner agreements and destination pin codes, which remain subject to business confirmation. Shipping is Free for orders strictly over ₹999 (₹99 standard fee otherwise).",
        actionLink: {
          label: "Read Shipping & Returns",
          href: "/shipping-returns",
        },
      },
      {
        id: "update-shipping-address",
        question: "How can I update my shipping address?",
        answer:
          "While placing a purchase, edit any street, city, state, postal code, or country field directly inside the Checkout shipping form. If an order has already been placed and remains in Processing status, reach out immediately via email (support@mitulsmarket.com) or phone (+91 88668 77692) with your Order ID—address changes cannot be guaranteed after courier handover.",
        actionLink: {
          label: "Edit Address at Checkout",
          href: "/checkout",
        },
      },
      {
        id: "delayed-order",
        question: "What happens if my order is delayed?",
        answer:
          "First inspect the Order Tracking Timeline and carrier tracking number inside View Details on your order in My Orders to see the latest transit checkpoint. If the shipment appears stalled beyond its indicated window, contact Mitul's Market support at support@mitulsmarket.com or +91 88668 77692 with your Order ID so we can review the status with the courier.",
      },
    ],
  },
  {
    id: "returns-refunds",
    label: "Returns & Refunds",
    description:
      "Return eligibility guidelines, filing requests, and transparent refund timelines.",
    items: [
      {
        id: "return-policy",
        question: "What is your return policy?",
        answer:
          "Storefront product pages and benefits display an Easy Returns 7-Day Policy indicator for unused items in original condition and packaging. Complete operational guidelines—including return condition checks and pending business confirmations—are detailed on our Shipping & Returns page.",
        actionLink: {
          label: "View Return Policy",
          href: "/shipping-returns",
        },
      },
      {
        id: "request-refund",
        question: "How do I request a refund?",
        answer:
          "For eligible orders cancelled while still in Processing status, any confirmed advance payment enters refund review upon cancellation. For delivered items requiring a return or defective replacement, contact support@mitulsmarket.com or call +91 88668 77692 with your Order ID, product name, and issue details.",
      },
      {
        id: "refund-duration",
        question: "How long does a refund take?",
        answer:
          "Mitul's Market does not promise a fixed number of business days for refund settlements until payment gateway processing rules and bank reversal agreements are officially configured by the business. Once approved by support and triggered via the payment processor, status updates appear on your order details record.",
      },
    ],
  },
];

export const SHIPPING_RETURNS_FAQS: readonly FaqEntry[] = [
  {
    id: "sr-free-shipping-threshold",
    question: "How is free shipping calculated in the Shopping Cart?",
    answer:
      "Based on our active storefront pricing configuration, orders with a merchandise subtotal strictly above ₹999 (for example, ₹1,000 or higher) qualify automatically for Free Shipping. Orders with a subtotal of ₹999 or less incur the configured ₹99 standard shipping fee, unless overridden by environment configuration.",
    actionLink: {
      label: "Inspect Shopping Cart",
      href: "/cart",
    },
  },
  {
    id: "sr-delivery-estimate",
    question: "Is the 2–3 day delivery timeframe guaranteed for all locations?",
    answer:
      "The 2–3 Day Delivery highlight shown in our Store Benefits is an indicative service target pending final regional SLA confirmation with courier partners. Actual transit times depend on warehouse dispatch cutoffs and your delivery pin code.",
  },
  {
    id: "sr-cancel-vs-return",
    question:
      "What is the difference between cancelling an order and returning it?",
    answer:
      "You can cancel an order directly from your order details view in My Orders only while it is still in Processing status before dispatch. Once the courier picks up the package and the status moves to Shipped or Delivered, online cancellation is locked and any post-delivery issue follows our return request review via Customer Care.",
    actionLink: {
      label: "Open My Orders",
      href: "/orders",
    },
  },
  {
    id: "sr-return-condition",
    question: "What condition must returned products be in?",
    answer:
      "Returned items should be unused, undamaged by the customer, and accompanied by original packaging, manuals, tags, accessories, and the matching Order ID / invoice summary.",
  },
  {
    id: "sr-damaged-wrong-item",
    question:
      "What should I do if I receive a damaged, defective, or incorrect product?",
    answer:
      "Email support@mitulsmarket.com or call +91 88668 77692 promptly with your Order ID and clear photos showing the item and outer packaging. Note: Specific reporting hours (such as within 48 hours of delivery) are suggested guidelines awaiting final business confirmation.",
  },
  {
    id: "sr-refund-timing",
    question: "When will a refund reflect in my bank account or UPI?",
    answer:
      "Exact refund timelines depend on payment gateway settlement cycles and your issuing bank once a refund is approved and initiated. We avoid quoting unverified fixed day counts here until live payment processor terms are configured by the business.",
  },
];
