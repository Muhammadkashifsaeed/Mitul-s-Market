import type { PaymentMethod } from "./order";
import type { Product } from "./product";

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ResolvedCartItem {
  product: Product;
  quantity: number;
  lineTotal: number;
  inStock: boolean;
  atMaxStock: boolean;
}

export interface PromoCoupon {
  code: string;
  label: string;
  type: "percent" | "flat";
  value: number;
  minSubtotal: number;
  maxDiscount?: number;
  isDemo: boolean;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon: PromoCoupon | null;
  message: string;
}

export interface CartPricingSummary {
  totalItems: number;
  uniqueItems: number;
  subtotal: number;
  shippingCharges: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
  discount: number;
  taxAmount: number;
  total: number;
  appliedCoupon: PromoCoupon | null;
}

export interface CheckoutFormValues {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  deliveryNotes?: string;
  paymentMethod?: PaymentMethod;
}
