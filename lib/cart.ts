import { DEMO_COUPONS } from "@/lib/demo-coupons";
import { getProductById } from "@/lib/products";
import type {
  CartItem,
  CartPricingSummary,
  CouponValidationResult,
  PromoCoupon,
  ResolvedCartItem,
} from "@/types";
import { formatCurrency } from "@/utils/format";

export const CART_STORAGE_KEY = "mituls_market_cart";
export const CART_COUPON_STORAGE_KEY = "mituls_market_cart_coupon";

const parsedThreshold = Number(
  process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD
);
export const FREE_SHIPPING_THRESHOLD =
  Number.isFinite(parsedThreshold) && parsedThreshold >= 0
    ? parsedThreshold
    : 999;

const parsedShippingFee = Number(
  process.env.NEXT_PUBLIC_STANDARD_SHIPPING_FEE
);
export const STANDARD_SHIPPING_FEE =
  Number.isFinite(parsedShippingFee) && parsedShippingFee >= 0
    ? parsedShippingFee
    : 99;

const parsedTaxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE_PERCENT);
export const TAX_RATE_PERCENT =
  Number.isFinite(parsedTaxRate) && parsedTaxRate >= 0 ? parsedTaxRate : 0;

export interface AddToCartResult {
  added: boolean;
  quantityAdded: number;
  itemQuantity: number;
  atMaxStock: boolean;
  message: string;
}

export interface CartNotification {
  id: number;
  type: "success" | "warning";
  title: string;
  message: string;
  productId?: string;
  productImage?: string;
}

const cartListeners = new Set<() => void>();
const couponListeners = new Set<() => void>();
const notificationListeners = new Set<() => void>();

let currentNotification: CartNotification | null = null;
let notificationTimeoutId: ReturnType<typeof setTimeout> | null = null;
let notificationCounter = 0;

function notifyCartListeners(): void {
  cartListeners.forEach((listener) => listener());
}

function notifyCouponListeners(): void {
  couponListeners.forEach((listener) => listener());
}

function notifyToastListeners(): void {
  notificationListeners.forEach((listener) => listener());
}

export function subscribeCart(listener: () => void): () => void {
  cartListeners.add(listener);
  if (typeof window === "undefined") {
    return () => {
      cartListeners.delete(listener);
    };
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === CART_STORAGE_KEY || event.key === null) {
      listener();
    }
  }

  window.addEventListener("storage", handleStorage);
  return () => {
    cartListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function subscribeCartCoupon(listener: () => void): () => void {
  couponListeners.add(listener);
  if (typeof window === "undefined") {
    return () => {
      couponListeners.delete(listener);
    };
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === CART_COUPON_STORAGE_KEY || event.key === null) {
      listener();
    }
  }

  window.addEventListener("storage", handleStorage);
  return () => {
    couponListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function subscribeCartNotification(listener: () => void): () => void {
  notificationListeners.add(listener);
  return () => {
    notificationListeners.delete(listener);
  };
}

export function getCartSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function getCartServerSnapshot(): string {
  return "[]";
}

export function getCartCouponSnapshot(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(CART_COUPON_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function getCartCouponServerSnapshot(): string {
  return "";
}

export function getCartNotificationSnapshot(): CartNotification | null {
  return currentNotification;
}

export function getCartNotificationServerSnapshot(): CartNotification | null {
  return null;
}

export function emitCartNotification(
  notification: Omit<CartNotification, "id">
): void {
  if (typeof window === "undefined") return;

  if (notificationTimeoutId !== null) {
    clearTimeout(notificationTimeoutId);
    notificationTimeoutId = null;
  }

  notificationCounter += 1;
  currentNotification = {
    ...notification,
    id: notificationCounter,
  };
  notifyToastListeners();

  notificationTimeoutId = setTimeout(() => {
    currentNotification = null;
    notificationTimeoutId = null;
    notifyToastListeners();
  }, 4000);
}

export function dismissCartNotification(): void {
  if (notificationTimeoutId !== null) {
    clearTimeout(notificationTimeoutId);
    notificationTimeoutId = null;
  }
  currentNotification = null;
  notifyToastListeners();
}

export function parseCartSnapshot(rawSnapshot: string): CartItem[] {
  try {
    const parsed = JSON.parse(rawSnapshot) as unknown;
    if (!Array.isArray(parsed)) return [];

    const mergedByProductId = new Map<string, number>();

    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue;
      const candidate = entry as Partial<CartItem>;
      if (typeof candidate.productId !== "string") continue;

      const product = getProductById(candidate.productId);
      if (!product) continue;

      const rawQty =
        typeof candidate.quantity === "number" &&
        Number.isFinite(candidate.quantity)
          ? Math.floor(candidate.quantity)
          : 1;
      const sanitizedQty = Math.max(1, rawQty);
      const prevQty = mergedByProductId.get(product.id) ?? 0;
      const maxAllowed = product.stock > 0 ? product.stock : 1;
      const clampedQty = Math.min(maxAllowed, prevQty + sanitizedQty);

      mergedByProductId.set(product.id, clampedQty);
    }

    return Array.from(mergedByProductId.entries()).map(
      ([productId, quantity]) => ({ productId, quantity })
    );
  } catch {
    return [];
  }
}

export function readCartItems(): CartItem[] {
  return parseCartSnapshot(getCartSnapshot());
}

function writeCartItems(items: readonly CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota / restricted context errors.
  }
  notifyCartListeners();
}

export function writeCartCouponCode(code: string): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      window.localStorage.removeItem(CART_COUPON_STORAGE_KEY);
    } else {
      window.localStorage.setItem(CART_COUPON_STORAGE_KEY, trimmed);
    }
  } catch {
    // Ignore storage errors.
  }
  notifyCouponListeners();
}

export function addItemToCart(
  productId: string,
  requestedQuantity = 1
): AddToCartResult {
  const product = getProductById(productId);
  if (!product) {
    return {
      added: false,
      quantityAdded: 0,
      itemQuantity: 0,
      atMaxStock: false,
      message: "Product was not found in the catalog.",
    };
  }

  if (product.stock <= 0) {
    emitCartNotification({
      type: "warning",
      title: "Out of stock",
      message: `${product.name} is currently unavailable.`,
      productId: product.id,
      productImage: product.image,
    });
    return {
      added: false,
      quantityAdded: 0,
      itemQuantity: 0,
      atMaxStock: true,
      message: `${product.name} is currently out of stock.`,
    };
  }

  const safeRequestedQty = Math.max(1, Math.floor(requestedQuantity));
  const currentItems = readCartItems();
  const existingItem = currentItems.find((item) => item.productId === productId);
  const existingQty = existingItem?.quantity ?? 0;

  if (existingQty >= product.stock) {
    const message = `Maximum available stock (${product.stock}) for ${product.name} is already in your cart.`;
    emitCartNotification({
      type: "warning",
      title: "Stock limit reached",
      message,
      productId: product.id,
      productImage: product.image,
    });
    return {
      added: false,
      quantityAdded: 0,
      itemQuantity: existingQty,
      atMaxStock: true,
      message,
    };
  }

  const nextQuantity = Math.min(product.stock, existingQty + safeRequestedQty);
  const quantityAdded = nextQuantity - existingQty;

  const nextItems = existingItem
    ? currentItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: nextQuantity }
          : item
      )
    : [...currentItems, { productId, quantity: nextQuantity }];

  writeCartItems(nextItems);

  const atMaxStock = nextQuantity >= product.stock;
  const message =
    quantityAdded < safeRequestedQty
      ? `Added ${quantityAdded} of ${product.name} (max stock ${product.stock} reached).`
      : existingQty > 0
        ? `Updated ${product.name} quantity to ${nextQuantity}.`
        : `${product.name} added to your shopping cart.`;

  emitCartNotification({
    type: "success",
    title: "Added to Cart",
    message,
    productId: product.id,
    productImage: product.image,
  });

  return {
    added: true,
    quantityAdded,
    itemQuantity: nextQuantity,
    atMaxStock,
    message,
  };
}

export function updateCartItemQuantity(
  productId: string,
  nextQuantity: number
): boolean {
  const product = getProductById(productId);
  if (!product || product.stock <= 0) return false;

  const clampedQty = Math.min(
    product.stock,
    Math.max(1, Math.floor(nextQuantity))
  );

  const currentItems = readCartItems();
  const exists = currentItems.some((item) => item.productId === productId);
  if (!exists) return false;

  const nextItems = currentItems.map((item) =>
    item.productId === productId ? { ...item, quantity: clampedQty } : item
  );
  writeCartItems(nextItems);
  return true;
}

export function removeCartItem(productId: string): void {
  const currentItems = readCartItems();
  const nextItems = currentItems.filter((item) => item.productId !== productId);
  writeCartItems(nextItems);
  if (nextItems.length === 0) {
    writeCartCouponCode("");
  }
}

export function clearCart(): void {
  writeCartItems([]);
  writeCartCouponCode("");
}

export function resolveCartItems(items: readonly CartItem[]): ResolvedCartItem[] {
  const resolved: ResolvedCartItem[] = [];

  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) continue;

    const inStock = product.stock > 0;
    const clampedQty = inStock
      ? Math.min(product.stock, Math.max(1, item.quantity))
      : item.quantity;

    resolved.push({
      product,
      quantity: clampedQty,
      lineTotal: product.price * clampedQty,
      inStock,
      atMaxStock: !inStock || clampedQty >= product.stock,
    });
  }

  return resolved;
}

export function findDemoCoupon(code: string): PromoCoupon | null {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  return DEMO_COUPONS.find((coupon) => coupon.code === normalized) ?? null;
}

export function validatePromoCode(
  rawCode: string,
  subtotal: number
): CouponValidationResult {
  const normalized = rawCode.trim().toUpperCase();
  if (!normalized) {
    return {
      valid: false,
      coupon: null,
      message: "Please enter a promo code.",
    };
  }

  if (subtotal <= 0) {
    return {
      valid: false,
      coupon: null,
      message: "Add products to your cart before applying a promo code.",
    };
  }

  const coupon = findDemoCoupon(normalized);
  if (!coupon) {
    return {
      valid: false,
      coupon: null,
      message: `"${normalized}" is not a valid promo code.`,
    };
  }

  if (subtotal < coupon.minSubtotal) {
    return {
      valid: false,
      coupon: null,
      message: `Promo ${coupon.code} requires a minimum subtotal of ${formatCurrency(coupon.minSubtotal)}.`,
    };
  }

  return {
    valid: true,
    coupon,
    message: `Promo code ${coupon.code} applied (${coupon.label}).`,
  };
}

export function computeCouponDiscount(
  coupon: PromoCoupon | null,
  subtotal: number
): number {
  if (!coupon || subtotal <= 0 || subtotal < coupon.minSubtotal) {
    return 0;
  }

  if (coupon.type === "flat") {
    return Math.min(subtotal, coupon.value);
  }

  const rawDiscount = Math.round((subtotal * coupon.value) / 100);
  const capped =
    typeof coupon.maxDiscount === "number"
      ? Math.min(rawDiscount, coupon.maxDiscount)
      : rawDiscount;

  return Math.min(subtotal, Math.max(0, capped));
}

export interface ComputedCartSummary extends CartPricingSummary {
  couponRequirementNote: string | null;
}

export function computeCartPricing(
  resolvedItems: readonly ResolvedCartItem[],
  appliedCouponCode: string
): ComputedCartSummary {
  const totalItems = resolvedItems.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueItems = resolvedItems.length;
  const subtotal = resolvedItems.reduce((sum, item) => sum + item.lineTotal, 0);

  const qualifiesForFreeShipping = subtotal > FREE_SHIPPING_THRESHOLD;
  const shippingCharges =
    subtotal <= 0 ? 0 : qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const amountToFreeShipping =
    subtotal <= 0 || qualifiesForFreeShipping
      ? 0
      : FREE_SHIPPING_THRESHOLD - subtotal + 1;

  const coupon = findDemoCoupon(appliedCouponCode);
  const discount = computeCouponDiscount(coupon, subtotal);
  const couponRequirementNote =
    coupon && subtotal > 0 && subtotal < coupon.minSubtotal
      ? `Promo ${coupon.code} requires at least ${formatCurrency(coupon.minSubtotal)} subtotal.`
      : null;

  const discountedMerchandiseTotal = Math.max(0, subtotal - discount);
  const taxAmount =
    TAX_RATE_PERCENT > 0
      ? Math.round((discountedMerchandiseTotal * TAX_RATE_PERCENT) / 100)
      : 0;

  const total = Math.max(
    0,
    subtotal + shippingCharges - discount + taxAmount
  );

  return {
    totalItems,
    uniqueItems,
    subtotal,
    shippingCharges,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountToFreeShipping,
    discount,
    taxAmount,
    total,
    appliedCoupon: coupon,
    couponRequirementNote,
  };
}

