import { NextResponse } from "next/server";
import type { ApiResponse, HealthCheckPayload } from "@/types";

export async function GET() {
  const payload: ApiResponse<HealthCheckPayload> = {
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV ?? "development",
    },
  };

  return NextResponse.json(payload, { status: 200 });
}

