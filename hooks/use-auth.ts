"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  ensureAuthSessionLoaded,
  getAuthServerSnapshot,
  getAuthSnapshot,
  logoutSession,
  refreshAuthSession,
  signInWithGoogleDemo,
  subscribeAuth,
} from "@/lib/auth-client";

export function useAuth() {
  const snapshot = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getAuthServerSnapshot
  );

  useEffect(() => {
    ensureAuthSessionLoaded();
  }, []);

  const refresh = useCallback(() => {
    return refreshAuthSession();
  }, []);

  const signInGoogleDemo = useCallback(
    (options: { preset?: "aarav" | "priya"; name?: string; email?: string }) => {
      return signInWithGoogleDemo(options);
    },
    []
  );

  const logout = useCallback(() => {
    return logoutSession();
  }, []);

  return {
    authenticated: snapshot.authenticated,
    user: snapshot.user,
    capabilities: snapshot.capabilities,
    isLoading: snapshot.isLoading,
    refresh,
    signInGoogleDemo,
    logout,
  };
}
