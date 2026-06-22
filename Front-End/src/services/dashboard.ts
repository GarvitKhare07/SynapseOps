import type { DashboardMetrics } from "@/types";
import { MOCK_MODE, apiFetch, delay } from "./api";
import { mockDashboard } from "./mock-data";

export async function getDashboard(): Promise<DashboardMetrics> {
  if (MOCK_MODE) {
    await delay(300);
    return mockDashboard;
  }
  return apiFetch<DashboardMetrics>("/dashboard");
}