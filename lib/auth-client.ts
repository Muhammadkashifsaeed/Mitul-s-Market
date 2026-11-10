import { apiClient, normalizeApiError } from "@/lib/axios";
import { addItemToCart, emitCartNotification } from "@/lib/cart";
import { getProductById } from "@/lib/products";
import type {
  ApiResponse,
  AuthCapabilities,
  AuthSessionState,
  AuthUser,
  ProductActionIntent,
  WishlistApiPayload,
} from "@/types";

export const PENDING_PRODUCT_STORAGE_KEY =
  "mituls_market_pending_product_action";

export const GOOGLE_DEMO_ACCOUNTS = [
  {
    preset: "aarav" as const,
    name: "Aarav Patel",
    email: "aarav.patel@mitulsmarket.com",
    badge: "5 Orders & Wishlist",
  },
  {
    preset: "priya" as const,
    name: "Priya Sharma",
    email: "priya.sharma@mitulsmarket.com",
    badge: "Saved Wishlist",
  },
] as const;

export const DEFAULT_AUTH_CAPABILITIES: AuthCapabilities = {
  databaseConfigured: true,
  authSecretConfigured: true,
  credentialsAuthConfigured: true,
  googleOAuthConfigured: Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID),
  googleDemoMode: !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  passwordResetConfigured: true,
  paymentConfigured: true,
  configuredPaymentMethods: [
    "UPI",
    "Credit Card",
    "Debit Card",
    "Cash on Delivery",
  ],
};

export interface ClientAuthSnapshot extends AuthSessionState {
  isLoading: boolean;
}

const SERVER_AUTH_SNAPSHOT: ClientAuthSnapshot = {
  authenticated: false,
  user: null,
  capabilities: DEFAULT_AUTH_CAPABILITIES,
  isLoading: true,
};

let currentAuthSnapshot: ClientAuthSnapshot = SERVER_AUTH_SNAPSHOT;
let authRequestInFlight: Promise<ClientAuthSnapshot> | null = null;
let authHasFetched = false;
const authListeners = new Set<() => void>();

function notifyAuthListeners(): void {
  authListeners.forEach((listener) => listener());
}

export function subscribeAuth(listener: () => void): () => void {
  authListeners.add(listener);
  return () => {
    authListeners.delete(listener);
  };
}

export function getAuthSnapshot(): ClientAuthSnapshot {
  return currentAuthSnapshot;
}

export function getAuthServerSnapshot(): ClientAuthSnapshot {
  return SERVER_AUTH_SNAPSHOT;
}

export async function refreshAuthSession(): Promise<ClientAuthSnapshot> {
  if (typeof window === "undefined") {
    return SERVER_AUTH_SNAPSHOT;
  }

  if (authRequestInFlight) {
    return authRequestInFlight;
  }

  authRequestInFlight = (async () => {
    try {
      const response =
        await apiClient.get<ApiResponse<AuthSessionState>>("/auth/session");
      if (response.data.success && response.data.data) {
        currentAuthSnapshot = {
          ...response.data.data,
          isLoading: false,
        };
      } else {
        currentAuthSnapshot = {
          ...SERVER_AUTH_SNAPSHOT,
          isLoading: false,
        };
      }
    } catch {
      currentAuthSnapshot = {
        ...SERVER_AUTH_SNAPSHOT,
        isLoading: false,
      };
    } finally {
      authHasFetched = true;
      authRequestInFlight = null;
      notifyAuthListeners();
    }

    if (currentAuthSnapshot.authenticated) {
      await refreshWishlistState();
      await consumePendingProductAction();
    } else {
      clearWishlistSnapshot();
    }

    return currentAuthSnapshot;
  })();

  return authRequestInFlight;
}

export function ensureAuthSessionLoaded(): void {
  if (typeof window === "undefined") return;
  if (!authHasFetched && !authRequestInFlight) {
    void refreshAuthSession();
  }
}

export async function signInWithGoogleDemo(options: {
  preset?: "aarav" | "priya";
  name?: string;
  email?: string;
}): Promise<{ ok: true; user: AuthUser } | { ok: false; message: string }> {
  try {
    const response = await apiClient.post<
      ApiResponse<{ authenticated: boolean; user: AuthUser }>
    >("/auth/google-demo", options);

    if (response.data.success && response.data.data?.user) {
      currentAuthSnapshot = {
        authenticated: true,
        user: response.data.data.user,
        capabilities: currentAuthSnapshot.capabilities,
        isLoading: false,
      };
      authHasFetched = true;
      notifyAuthListeners();
      await refreshWishlistState();
      return {
        ok: true,
        user: response.data.data.user,
      };
    }

    return {
      ok: false,
      message: "Unable to complete Google sign-in right now.",
    };
  } catch (error) {
    return {
      ok: false,
      message: normalizeApiError(error).message,
    };
  }
}

export async function logoutSession(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    await apiClient.delete("/auth/session");
    currentAuthSnapshot = {
      authenticated: false,
      user: null,
      capabilities: currentAuthSnapshot.capabilities,
      isLoading: false,
    };
    authHasFetched = true;
    clearWishlistSnapshot();
    notifyAuthListeners();
    return {
      ok: true,
      message: "Signed out successfully.",
    };
  } catch (error) {
    return {
      ok: false,
      message: normalizeApiError(error).message,
    };
  }
}

export interface ClientWishlistSnapshot {
  backendConfigured: boolean;
  authenticated: boolean;
  productIds: string[];
  isLoading: boolean;
}

const SERVER_WISHLIST_SNAPSHOT: ClientWishlistSnapshot = {
  backendConfigured: true,
  authenticated: false,
  productIds: [],
  isLoading: true,
};

let currentWishlistSnapshot: ClientWishlistSnapshot = SERVER_WISHLIST_SNAPSHOT;
let wishlistRequestInFlight: Promise<ClientWishlistSnapshot> | null = null;
let wishlistHasFetched = false;
const wishlistListeners = new Set<() => void>();

function notifyWishlistListeners(): void {
  wishlistListeners.forEach((listener) => listener());
}

function clearWishlistSnapshot(): void {
  currentWishlistSnapshot = {
    backendConfigured: true,
    authenticated: false,
    productIds: [],
    isLoading: false,
  };
  wishlistHasFetched = true;
  notifyWishlistListeners();
}

export function subscribeWishlist(listener: () => void): () => void {
  wishlistListeners.add(listener);
  return () => {
    wishlistListeners.delete(listener);
  };
}

export function getWishlistSnapshot(): ClientWishlistSnapshot {
  return currentWishlistSnapshot;
}

export function getWishlistServerSnapshot(): ClientWishlistSnapshot {
  return SERVER_WISHLIST_SNAPSHOT;
}

export async function refreshWishlistState(): Promise<ClientWishlistSnapshot> {
  if (typeof window === "undefined") {
    return SERVER_WISHLIST_SNAPSHOT;
  }

  if (wishlistRequestInFlight) {
    return wishlistRequestInFlight;
  }

  wishlistRequestInFlight = (async () => {
    try {
      const response =
        await apiClient.get<ApiResponse<WishlistApiPayload>>("/wishlist");
      if (response.data.success && response.data.data) {
        currentWishlistSnapshot = {
          ...response.data.data,
          isLoading: false,
        };
      } else {
        currentWishlistSnapshot = {
          ...SERVER_WISHLIST_SNAPSHOT,
          isLoading: false,
        };
      }
    } catch {
      currentWishlistSnapshot = {
        ...SERVER_WISHLIST_SNAPSHOT,
        isLoading: false,
      };
    } finally {
      wishlistHasFetched = true;
      wishlistRequestInFlight = null;
      notifyWishlistListeners();
    }

    return currentWishlistSnapshot;
  })();

  return wishlistRequestInFlight;
}

export function ensureWishlistLoaded(): void {
  if (typeof window === "undefined") return;
  if (!wishlistHasFetched && !wishlistRequestInFlight) {
    void refreshWishlistState();
  }
}

export function savePendingProductAction(params: {
  productId: string;
  productName: string;
  price: number;
  intent: ProductActionIntent;
}): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      PENDING_PRODUCT_STORAGE_KEY,
      JSON.stringify({
        ...params,
        savedAt: new Date().toISOString(),
      })
    );
  } catch {
    // Ignore restricted storage errors.
  }
}

export function clearPendingProductAction(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(PENDING_PRODUCT_STORAGE_KEY);
  } catch {
    // Ignore restricted storage errors.
  }
}

export async function consumePendingProductAction(): Promise<void> {
  if (typeof window === "undefined" || !currentAuthSnapshot.authenticated) {
    return;
  }

  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(PENDING_PRODUCT_STORAGE_KEY);
    if (!raw) return;
    window.sessionStorage.removeItem(PENDING_PRODUCT_STORAGE_KEY);
  } catch {
    return;
  }

  try {
    const parsed = JSON.parse(raw) as {
      productId?: string;
      intent?: ProductActionIntent;
    };
    if (!parsed.productId) return;
    const product = getProductById(parsed.productId);
    if (!product) return;

    if (parsed.intent === "wishlist") {
      const result = await ensureProductWishlisted(product.id);
      if (result.ok) {
        emitCartNotification({
          type: "success",
          title: "Saved to Wishlist",
          message: `${product.name} was added to your wishlist.`,
          productId: product.id,
          productImage: product.image,
        });
      }
      return;
    }

    if (parsed.intent === "add") {
      addItemToCart(product.id, 1);
    }
  } catch {
    // Ignore malformed payload.
  }
}

export async function ensureProductWishlisted(productId: string): Promise<{
  ok: boolean;
  wishlisted: boolean;
  message: string;
}> {
  if (!currentAuthSnapshot.authenticated) {
    return {
      ok: false,
      wishlisted: false,
      message: "Sign in to save items to your wishlist.",
    };
  }

  try {
    const response = await apiClient.post<ApiResponse<WishlistApiPayload>>(
      "/wishlist",
      { productId }
    );
    const updatedIds = response.data.data?.productIds ?? [
      ...new Set([...currentWishlistSnapshot.productIds, productId]),
    ];
    currentWishlistSnapshot = {
      backendConfigured: true,
      authenticated: true,
      productIds: updatedIds,
      isLoading: false,
    };
    wishlistHasFetched = true;
    notifyWishlistListeners();
    return {
      ok: true,
      wishlisted: true,
      message: "Saved to your wishlist.",
    };
  } catch (error) {
    return {
      ok: false,
      wishlisted: currentWishlistSnapshot.productIds.includes(productId),
      message: normalizeApiError(error).message,
    };
  }
}

export async function toggleWishlistProduct(productId: string): Promise<{
  ok: boolean;
  reason?: "unauthenticated" | "unconfigured" | "error";
  wishlisted: boolean;
  message: string;
}> {
  if (!currentAuthSnapshot.authenticated) {
    return {
      ok: false,
      reason: "unauthenticated",
      wishlisted: false,
      message: "Sign in to save items to your wishlist.",
    };
  }

  const currentlyWishlisted =
    currentWishlistSnapshot.productIds.includes(productId);

  try {
    if (currentlyWishlisted) {
      const response = await apiClient.delete<ApiResponse<WishlistApiPayload>>(
        `/wishlist?productId=${encodeURIComponent(productId)}`
      );
      const updatedIds =
        response.data.data?.productIds ??
        currentWishlistSnapshot.productIds.filter((id) => id !== productId);
      currentWishlistSnapshot = {
        backendConfigured: true,
        authenticated: true,
        productIds: updatedIds,
        isLoading: false,
      };
      wishlistHasFetched = true;
      notifyWishlistListeners();
      return {
        ok: true,
        wishlisted: false,
        message: "Removed from your wishlist.",
      };
    }

    const response = await apiClient.post<ApiResponse<WishlistApiPayload>>(
      "/wishlist",
      { productId }
    );
    const updatedIds = response.data.data?.productIds ?? [
      ...currentWishlistSnapshot.productIds,
      productId,
    ];
    currentWishlistSnapshot = {
      backendConfigured: true,
      authenticated: true,
      productIds: updatedIds,
      isLoading: false,
    };
    wishlistHasFetched = true;
    notifyWishlistListeners();
    return {
      ok: true,
      wishlisted: true,
      message: "Saved to your wishlist.",
    };
  } catch (error) {
    const normalized = normalizeApiError(error);
    return {
      ok: false,
      reason: normalized.status === 401 ? "unauthenticated" : "error",
      wishlisted: currentlyWishlisted,
      message: normalized.message,
    };
  }
}
