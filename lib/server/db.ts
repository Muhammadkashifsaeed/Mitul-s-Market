import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  TAX_RATE_PERCENT,
  computeCouponDiscount,
  findDemoCoupon,
} from "@/lib/cart";
import { allProducts, getProductById } from "@/lib/products";
import { resolveWritableDataDir } from "@/lib/server/data-dir";
import type {
  AuthUser,
  DeliveryAddress,
  Order,
  OrderItem,
  PaymentMethod,
  PaymentStatus,
} from "@/types";

export interface StoredUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  passwordSalt?: string;
  provider: "credentials" | "google";
  avatarUrl?: string;
  resetTokenHash?: string;
  resetTokenExpiresAt?: number;
  createdAt: string;
}

interface StoreData {
  users: StoredUserRecord[];
  orders: Order[];
  wishlists: Record<string, string[]>;
  nextOrderSeq: number;
}

export const SEED_GOOGLE_USERS = {
  aarav: {
    id: "customer-aarav-001",
    name: "Aarav Patel",
    email: "aarav.patel@mitulsmarket.com",
  },
  priya: {
    id: "customer-priya-002",
    name: "Priya Sharma",
    email: "priya.sharma@mitulsmarket.com",
  },
} as const;

let writeQueue: Promise<unknown> = Promise.resolve();
let memoryStoreFallback: StoreData | null = null;

function getStoreFilePath(): string {
  return path.join(resolveWritableDataDir(), "store.json");
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function makeOrderItem(productId: string, quantity: number): OrderItem {
  const product =
    getProductById(productId) ??
    allProducts[0];
  return {
    productId: product.id,
    name: product.name,
    category: product.category,
    image: product.image,
    unitPrice: product.price,
    quantity,
    lineTotal: product.price * quantity,
  };
}

function createSeedStore(): StoreData {
  const saltAarav = crypto.randomBytes(16).toString("hex");
  const saltPriya = crypto.randomBytes(16).toString("hex");

  const aaravCustomer = {
    id: SEED_GOOGLE_USERS.aarav.id,
    name: SEED_GOOGLE_USERS.aarav.name,
    email: SEED_GOOGLE_USERS.aarav.email,
    phone: "+91 98765 43210",
  };

  const aaravAddress: DeliveryAddress = {
    fullName: "Aarav Patel",
    street: "402 Titanium Heights, Ravapar Road",
    city: "Morbi",
    state: "Gujarat",
    postalCode: "363641",
    country: "India",
  };

  const order1Items = [
    makeOrderItem("mechanical-gaming-keyboard", 1),
    makeOrderItem("wireless-ergonomic-mouse", 1),
  ];
  const order2Items = [
    makeOrderItem("premium-wireless-headphones", 1),
    makeOrderItem("true-wireless-earbuds-pro", 1),
  ];
  const order3Items = [
    makeOrderItem("smart-fitness-watch", 1),
    makeOrderItem("running-shoes", 1),
  ];
  const order4Items = [makeOrderItem("minimalist-backpack", 2)];
  const order5Items = [makeOrderItem("urban-cotton-bomber-jacket", 1)];

  const sum = (items: readonly OrderItem[]) =>
    items.reduce((acc, item) => acc + item.lineTotal, 0);

  return {
    nextOrderSeq: 1051,
    users: [
      {
        id: SEED_GOOGLE_USERS.aarav.id,
        name: SEED_GOOGLE_USERS.aarav.name,
        email: SEED_GOOGLE_USERS.aarav.email,
        passwordSalt: saltAarav,
        passwordHash: hashPassword("Demo@1234", saltAarav),
        provider: "google",
        createdAt: "2026-09-10T09:00:00.000Z",
      },
      {
        id: SEED_GOOGLE_USERS.priya.id,
        name: SEED_GOOGLE_USERS.priya.name,
        email: SEED_GOOGLE_USERS.priya.email,
        passwordSalt: saltPriya,
        passwordHash: hashPassword("Demo@1234", saltPriya),
        provider: "google",
        createdAt: "2026-10-01T10:30:00.000Z",
      },
    ],
    orders: [
      {
        id: "MM-2026-1048",
        customerId: SEED_GOOGLE_USERS.aarav.id,
        isDemo: false,
        orderDate: "2026-11-08T10:30:00.000Z",
        status: "Processing",
        customer: { ...aaravCustomer },
        shippingAddress: { ...aaravAddress },
        items: order1Items,
        subtotal: sum(order1Items),
        shippingCharges: 0,
        discount: 250,
        total: sum(order1Items) - 250,
        paymentMethod: "UPI",
        paymentStatus: "Paid",
        carrierName: "BlueDart Express",
        estimatedDelivery: "Nov 13, 2026",
        statusHistory: {
          placedAt: "2026-11-08T10:30:00.000Z",
          confirmedAt: "2026-11-08T10:42:00.000Z",
          processingAt: "2026-11-08T16:10:00.000Z",
        },
      },
      {
        id: "MM-2026-1045",
        customerId: SEED_GOOGLE_USERS.aarav.id,
        isDemo: false,
        orderDate: "2026-11-05T14:15:00.000Z",
        status: "Shipped",
        customer: { ...aaravCustomer },
        shippingAddress: { ...aaravAddress },
        items: order2Items,
        subtotal: sum(order2Items),
        shippingCharges: 0,
        discount: 500,
        total: sum(order2Items) - 500,
        paymentMethod: "Credit Card",
        paymentStatus: "Paid",
        carrierName: "Delhivery Air",
        trackingNumber: "DLV-8841209",
        estimatedDelivery: "Nov 11, 2026",
        statusHistory: {
          placedAt: "2026-11-05T14:15:00.000Z",
          confirmedAt: "2026-11-05T14:25:00.000Z",
          processingAt: "2026-11-06T09:00:00.000Z",
          shippedAt: "2026-11-07T18:40:00.000Z",
        },
      },
      {
        id: "MM-2026-1039",
        customerId: SEED_GOOGLE_USERS.aarav.id,
        isDemo: false,
        orderDate: "2026-10-28T09:45:00.000Z",
        status: "Delivered",
        customer: { ...aaravCustomer },
        shippingAddress: { ...aaravAddress },
        items: order3Items,
        subtotal: sum(order3Items),
        shippingCharges: 99,
        discount: 300,
        total: sum(order3Items) + 99 - 300,
        paymentMethod: "Debit Card",
        paymentStatus: "Paid",
        carrierName: "BlueDart Express",
        trackingNumber: "BD-5519402",
        estimatedDelivery: "Nov 1, 2026",
        statusHistory: {
          placedAt: "2026-10-28T09:45:00.000Z",
          confirmedAt: "2026-10-28T10:00:00.000Z",
          processingAt: "2026-10-28T15:30:00.000Z",
          shippedAt: "2026-10-29T11:20:00.000Z",
          deliveredAt: "2026-11-01T13:05:00.000Z",
        },
      },
      {
        id: "MM-2026-1031",
        customerId: SEED_GOOGLE_USERS.aarav.id,
        isDemo: false,
        orderDate: "2026-10-16T16:20:00.000Z",
        status: "Delivered",
        customer: { ...aaravCustomer },
        shippingAddress: { ...aaravAddress },
        items: order4Items,
        subtotal: sum(order4Items),
        shippingCharges: 0,
        discount: 0,
        total: sum(order4Items),
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Paid",
        carrierName: "Ecom Express",
        trackingNumber: "EC-3920148",
        estimatedDelivery: "Oct 20, 2026",
        statusHistory: {
          placedAt: "2026-10-16T16:20:00.000Z",
          confirmedAt: "2026-10-16T16:35:00.000Z",
          processingAt: "2026-10-17T08:50:00.000Z",
          shippedAt: "2026-10-18T10:15:00.000Z",
          deliveredAt: "2026-10-20T17:10:00.000Z",
        },
      },
      {
        id: "MM-2026-1024",
        customerId: SEED_GOOGLE_USERS.aarav.id,
        isDemo: false,
        orderDate: "2026-09-22T11:10:00.000Z",
        status: "Cancelled",
        customer: { ...aaravCustomer },
        shippingAddress: { ...aaravAddress },
        items: order5Items,
        subtotal: sum(order5Items),
        shippingCharges: 0,
        discount: 200,
        total: sum(order5Items) - 200,
        paymentMethod: "UPI",
        paymentStatus: "Cancelled",
        statusHistory: {
          placedAt: "2026-09-22T11:10:00.000Z",
          confirmedAt: "2026-09-22T11:20:00.000Z",
          cancelledAt: "2026-09-22T15:05:00.000Z",
        },
      },
    ],
    wishlists: {
      [SEED_GOOGLE_USERS.aarav.id]: [
        "premium-wireless-headphones",
        "mechanical-gaming-keyboard",
      ],
      [SEED_GOOGLE_USERS.priya.id]: ["smart-fitness-watch"],
    },
  };
}

function readStoreSync(): StoreData {
  const storeFile = getStoreFilePath();

  try {
    if (!fs.existsSync(storeFile)) {
      const initial = memoryStoreFallback ?? createSeedStore();
      memoryStoreFallback = initial;
      fs.writeFileSync(storeFile, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }

    const raw = fs.readFileSync(storeFile, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    if (
      parsed &&
      Array.isArray(parsed.users) &&
      Array.isArray(parsed.orders) &&
      parsed.wishlists &&
      typeof parsed.wishlists === "object"
    ) {
      const normalized: StoreData = {
        users: parsed.users,
        orders: parsed.orders,
        wishlists: parsed.wishlists,
        nextOrderSeq:
          typeof parsed.nextOrderSeq === "number" ? parsed.nextOrderSeq : 1051,
      };
      memoryStoreFallback = normalized;
      return normalized;
    }
  } catch {
    if (memoryStoreFallback) {
      return memoryStoreFallback;
    }
  }

  const seeded = createSeedStore();
  memoryStoreFallback = seeded;
  try {
    fs.writeFileSync(storeFile, JSON.stringify(seeded, null, 2), "utf8");
  } catch {
    // Keep operating cleanly with memoryStoreFallback when disk is unavailable.
  }
  return seeded;
}

function writeStoreSync(store: StoreData): void {
  memoryStoreFallback = store;
  const storeFile = getStoreFilePath();
  const json = JSON.stringify(store, null, 2);
  const tmpFile = `${storeFile}.${process.pid}.${Date.now()}.tmp`;
  try {
    fs.writeFileSync(tmpFile, json, "utf8");
    fs.renameSync(tmpFile, storeFile);
  } catch {
    try {
      fs.writeFileSync(storeFile, json, "utf8");
    } catch {
      // Ignore read-only storage errors after preserving memoryStoreFallback.
    }
    try {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    } catch {}
  }
}

async function withStoreLock<T>(
  operation: (store: StoreData) => Promise<{ result: T; dirty: boolean }> | { result: T; dirty: boolean }
): Promise<T> {
  const next = writeQueue.then(async () => {
    const store = readStoreSync();
    const { result, dirty } = await operation(store);
    if (dirty) {
      writeStoreSync(store);
    }
    return result;
  });
  writeQueue = next.catch(() => {});
  return next;
}

export function toPublicAuthUser(record: StoredUserRecord): AuthUser {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    avatarUrl: record.avatarUrl,
    provider: record.provider,
  };
}

export async function findUserByEmail(
  email: string
): Promise<StoredUserRecord | null> {
  const normalized = email.trim().toLowerCase();
  return withStoreLock((store) => ({
    dirty: false,
    result:
      store.users.find((u) => u.email.toLowerCase() === normalized) ?? null,
  }));
}

export async function findUserById(
  id: string
): Promise<StoredUserRecord | null> {
  return withStoreLock((store) => ({
    dirty: false,
    result: store.users.find((u) => u.id === id) ?? null,
  }));
}

export function verifyPassword(
  user: StoredUserRecord,
  plainPassword: string
): boolean {
  if (!user.passwordHash || !user.passwordSalt) return false;
  const computedHex = hashPassword(plainPassword, user.passwordSalt);
  const a = Buffer.from(computedHex, "hex");
  const b = Buffer.from(user.passwordHash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function createCredentialsUser(params: {
  name: string;
  email: string;
  password: string;
}): Promise<
  | { ok: true; user: AuthUser; record: StoredUserRecord }
  | { ok: false; message: string }
> {
  const normalizedEmail = params.email.trim().toLowerCase();
  return withStoreLock<
    | { ok: true; user: AuthUser; record: StoredUserRecord }
    | { ok: false; message: string }
  >((store) => {
    const exists = store.users.some(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (exists) {
      return {
        dirty: false,
        result: {
          ok: false as const,
          message: "An account with this email already exists.",
        },
      };
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const newRecord: StoredUserRecord = {
      id: `customer-${crypto.randomUUID().slice(0, 8)}`,
      name: params.name.trim(),
      email: normalizedEmail,
      passwordSalt: salt,
      passwordHash: hashPassword(params.password, salt),
      provider: "credentials",
      createdAt: new Date().toISOString(),
    };
    store.users.push(newRecord);
    if (!store.wishlists[newRecord.id]) {
      store.wishlists[newRecord.id] = [];
    }

    return {
      dirty: true,
      result: {
        ok: true as const,
        user: toPublicAuthUser(newRecord),
        record: newRecord,
      },
    };
  });
}

export async function upsertGoogleDemoUser(params: {
  preset?: "aarav" | "priya";
  name?: string;
  email?: string;
  avatarUrl?: string;
}): Promise<AuthUser> {
  return withStoreLock((store) => {
    const targetEmail =
      params.preset === "priya"
        ? SEED_GOOGLE_USERS.priya.email
        : params.preset === "aarav"
          ? SEED_GOOGLE_USERS.aarav.email
          : (params.email?.trim().toLowerCase() || SEED_GOOGLE_USERS.aarav.email);

    const existing = store.users.find(
      (u) => u.email.toLowerCase() === targetEmail
    );
    if (existing) {
      let modified = false;
      if (params.name?.trim() && existing.name !== params.name.trim()) {
        existing.name = params.name.trim();
        modified = true;
      }
      if (params.avatarUrl?.trim() && existing.avatarUrl !== params.avatarUrl.trim()) {
        existing.avatarUrl = params.avatarUrl.trim();
        modified = true;
      }
      return { dirty: modified, result: toPublicAuthUser(existing) };
    }

    const defaultName =
      params.name?.trim() ||
      targetEmail.split("@")[0].replace(/[._-]+/g, " ");
    const googleIdHash = crypto
      .createHash("sha256")
      .update(targetEmail)
      .digest("hex")
      .slice(0, 10);
    const created: StoredUserRecord = {
      id: `google-${googleIdHash}`,
      name: defaultName.replace(/\b\w/g, (ch) => ch.toUpperCase()),
      email: targetEmail,
      ...(params.avatarUrl?.trim() ? { avatarUrl: params.avatarUrl.trim() } : {}),
      provider: "google",
      createdAt: new Date().toISOString(),
    };
    store.users.push(created);
    if (!store.wishlists[created.id]) {
      store.wishlists[created.id] = [];
    }
    return { dirty: true, result: toPublicAuthUser(created) };
  });
}

export async function upsertUserRecordInStore(
  record: StoredUserRecord
): Promise<void> {
  const normalized = record.email.trim().toLowerCase();
  return withStoreLock((store) => {
    const idx = store.users.findIndex(
      (u) => u.email.toLowerCase() === normalized
    );
    if (idx >= 0) {
      store.users[idx] = { ...store.users[idx], ...record };
    } else {
      store.users.push(record);
    }
    return { dirty: true, result: undefined };
  });
}

export async function issuePasswordResetCode(
  email: string
): Promise<{
  found: boolean;
  resetCode?: string;
  resetTokenHash?: string;
  resetTokenExpiresAt?: number;
  email: string;
}> {
  const normalized = email.trim().toLowerCase();
  return withStoreLock<{
    found: boolean;
    resetCode?: string;
    resetTokenHash?: string;
    resetTokenExpiresAt?: number;
    email: string;
  }>((store) => {
    const user = store.users.find(
      (u) => u.email.toLowerCase() === normalized
    );
    if (!user) {
      return { dirty: false, result: { found: false, email: normalized } };
    }

    const rawCode = String(crypto.randomInt(100000, 1000000));
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(rawCode)
      .digest("hex");
    const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000;
    user.resetTokenHash = resetTokenHash;
    user.resetTokenExpiresAt = resetTokenExpiresAt;

    return {
      dirty: true,
      result: {
        found: true,
        resetCode: rawCode,
        resetTokenHash,
        resetTokenExpiresAt,
        email: user.email,
      },
    };
  });
}

export async function completePasswordReset(params: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<{ ok: boolean; message: string; record?: StoredUserRecord }> {
  const normalized = params.email.trim().toLowerCase();
  const codeHash = crypto
    .createHash("sha256")
    .update(params.code.trim())
    .digest("hex");

  return withStoreLock<{ ok: boolean; message: string; record?: StoredUserRecord }>((store) => {
    const user = store.users.find(
      (u) => u.email.toLowerCase() === normalized
    );
    if (
      !user ||
      !user.resetTokenHash ||
      !user.resetTokenExpiresAt ||
      user.resetTokenExpiresAt < Date.now() ||
      user.resetTokenHash !== codeHash
    ) {
      return {
        dirty: false,
        result: {
          ok: false,
          message: "Verification code is invalid or expired.",
        },
      };
    }

    const salt = crypto.randomBytes(16).toString("hex");
    user.passwordSalt = salt;
    user.passwordHash = hashPassword(params.newPassword, salt);
    delete user.resetTokenHash;
    delete user.resetTokenExpiresAt;

    return {
      dirty: true,
      result: {
        ok: true,
        message: "Password updated successfully. You can now sign in.",
        record: { ...user },
      },
    };
  });
}

export async function getOrdersForCustomer(customerId: string): Promise<Order[]> {
  return withStoreLock((store) => ({
    dirty: false,
    result: store.orders
      .filter((order) => order.customerId === customerId)
      .sort(
        (a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      ),
  }));
}

export async function getOrderByIdForCustomer(
  orderId: string,
  customerId: string
): Promise<Order | null> {
  const target = orderId.trim().toLowerCase();
  return withStoreLock((store) => ({
    dirty: false,
    result:
      store.orders.find(
        (o) => o.id.toLowerCase() === target && o.customerId === customerId
      ) ?? null,
  }));
}

export async function createOrderInStore(params: {
  user: AuthUser;
  fullName: string;
  email: string;
  phone: string;
  shippingAddress: DeliveryAddress;
  deliveryNotes?: string;
  items: { productId: string; quantity: number }[];
  couponCode?: string;
  paymentMethod: PaymentMethod;
  minSeqHint?: number;
}): Promise<{ ok: true; order: Order } | { ok: false; message: string }> {
  return withStoreLock<{ ok: true; order: Order } | { ok: false; message: string }>((store) => {
    const resolvedItems: OrderItem[] = [];
    for (const reqItem of params.items) {
      const product = getProductById(reqItem.productId);
      if (!product || product.stock <= 0) {
        return {
          dirty: false,
          result: {
            ok: false as const,
            message: `Product "${reqItem.productId}" is unavailable.`,
          },
        };
      }
      const qty = Math.min(
        product.stock,
        Math.max(1, Math.floor(reqItem.quantity))
      );
      resolvedItems.push({
        productId: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        unitPrice: product.price,
        quantity: qty,
        lineTotal: product.price * qty,
      });
    }

    if (resolvedItems.length === 0) {
      return {
        dirty: false,
        result: {
          ok: false as const,
          message: "Your shopping cart is empty.",
        },
      };
    }

    const subtotal = resolvedItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const shippingCharges =
      subtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    const coupon = params.couponCode
      ? findDemoCoupon(params.couponCode)
      : null;
    const discount = computeCouponDiscount(coupon, subtotal);
    const discounted = Math.max(0, subtotal - discount);
    const taxAmount =
      TAX_RATE_PERCENT > 0
        ? Math.round((discounted * TAX_RATE_PERCENT) / 100)
        : 0;
    const total = Math.max(0, subtotal + shippingCharges - discount + taxAmount);

    if (params.minSeqHint && store.nextOrderSeq < params.minSeqHint) {
      store.nextOrderSeq = params.minSeqHint;
    }
    const seq = store.nextOrderSeq++;
    const nowIso = new Date().toISOString();
    const estDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
    const estFormatted = estDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const paymentStatus: PaymentStatus =
      params.paymentMethod === "Cash on Delivery"
        ? "Pending on Delivery"
        : "Paid";

    const newOrder: Order = {
      id: `MM-2026-${seq}`,
      customerId: params.user.id,
      isDemo: false,
      orderDate: nowIso,
      status: "Processing",
      customer: {
        id: params.user.id,
        name: params.fullName,
        email: params.email,
        phone: params.phone,
      },
      shippingAddress: { ...params.shippingAddress },
      ...(params.deliveryNotes?.trim()
        ? { deliveryNotes: params.deliveryNotes.trim() }
        : {}),
      items: resolvedItems,
      subtotal,
      shippingCharges,
      discount,
      total,
      paymentMethod: params.paymentMethod,
      paymentStatus,
      carrierName: "BlueDart Express",
      estimatedDelivery: estFormatted,
      statusHistory: {
        placedAt: nowIso,
        confirmedAt: nowIso,
        processingAt: nowIso,
      },
    };

    store.orders.unshift(newOrder);
    return {
      dirty: true,
      result: {
        ok: true as const,
        order: newOrder,
      },
    };
  });
}

export async function cancelOrderInStore(
  orderId: string,
  customerId: string
): Promise<{ ok: true; order: Order } | { ok: false; status: number; message: string }> {
  const target = orderId.trim().toLowerCase();
  return withStoreLock<{ ok: true; order: Order } | { ok: false; status: number; message: string }>((store) => {
    const order = store.orders.find(
      (o) => o.id.toLowerCase() === target && o.customerId === customerId
    );
    if (!order) {
      return {
        dirty: false,
        result: {
          ok: false as const,
          status: 404,
          message: `Order "${orderId}" was not found for your account.`,
        },
      };
    }

    if (order.status !== "Processing") {
      return {
        dirty: false,
        result: {
          ok: false as const,
          status: 400,
          message: `Order ${order.id} is already "${order.status}" and cannot be cancelled.`,
        },
      };
    }

    order.status = "Cancelled";
    order.paymentStatus = "Cancelled";
    order.statusHistory = {
      ...order.statusHistory,
      cancelledAt: new Date().toISOString(),
    };

    return {
      dirty: true,
      result: {
        ok: true as const,
        order,
      },
    };
  });
}

export async function getWishlistForUser(userId: string): Promise<string[]> {
  return withStoreLock((store) => ({
    dirty: false,
    result: [...(store.wishlists[userId] ?? [])],
  }));
}

export async function addWishlistForUser(
  userId: string,
  productId: string,
  seedProductIds?: string[]
): Promise<string[]> {
  return withStoreLock((store) => {
    const existing = Array.from(
      new Set([...(seedProductIds ?? []), ...(store.wishlists[userId] ?? [])])
    );
    if (existing.includes(productId)) {
      store.wishlists[userId] = existing;
      return { dirty: true, result: [...existing] };
    }
    const updated = [...existing, productId];
    store.wishlists[userId] = updated;
    return { dirty: true, result: updated };
  });
}

export async function removeWishlistForUser(
  userId: string,
  productId: string,
  seedProductIds?: string[]
): Promise<string[]> {
  return withStoreLock((store) => {
    const existing = Array.from(
      new Set([...(seedProductIds ?? []), ...(store.wishlists[userId] ?? [])])
    );
    const updated = existing.filter((id) => id !== productId);
    store.wishlists[userId] = updated;
    return { dirty: true, result: updated };
  });
}
