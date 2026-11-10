export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface HealthCheckPayload {
  status: "ok";
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
}

