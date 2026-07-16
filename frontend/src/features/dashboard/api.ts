import { api } from "../../api/client";
import type { DashboardStats } from "./types";

export async function getDashboard(): Promise<DashboardStats> {
  const res = await api.get("/dashboard");
  return res.data.dashboard;
}
