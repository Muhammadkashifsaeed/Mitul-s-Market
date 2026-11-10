import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { publicEnv } from "@/lib/env";
import type { ApiError } from "@/types";

export const apiClient = axios.create({
  baseURL: publicEnv.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Hook point for future auth token injection or correlation headers.
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(normalizeApiError(error));
  }
);

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const data = error.response?.data as
      | { message?: string; code?: string; details?: Record<string, string[]> }
      | undefined;

    return {
      status,
      message:
        data?.message ?? error.message ?? "An unexpected network error occurred.",
      code: data?.code ?? error.code,
      details: data?.details,
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message,
    };
  }

  return {
    status: 500,
    message: "An unexpected error occurred.",
  };
}

