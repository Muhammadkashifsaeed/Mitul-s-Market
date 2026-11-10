import type { PaymentMethod } from "./order";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: "credentials" | "google";
}

export interface AuthCapabilities {
  databaseConfigured: boolean;
  authSecretConfigured: boolean;
  credentialsAuthConfigured: boolean;
  googleOAuthConfigured: boolean;
  googleDemoMode: boolean;
  passwordResetConfigured: boolean;
  paymentConfigured: boolean;
  configuredPaymentMethods: PaymentMethod[];
}

export interface AuthSessionState {
  authenticated: boolean;
  user: AuthUser | null;
  capabilities: AuthCapabilities;
}

export interface WishlistApiPayload {
  backendConfigured: boolean;
  authenticated: boolean;
  productIds: string[];
}
