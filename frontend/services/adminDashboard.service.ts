import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import type { AdminDashboardData } from "../types/admin";

export const adminDashboardService = {
  async getOverview(): Promise<AdminDashboardData> {
    const response = await api.get<AdminDashboardData>(endpoints.admin.dashboard);
    return response.data;
  },
};
