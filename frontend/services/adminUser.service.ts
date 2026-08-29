import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import type { AdminUser } from "../types/admin";
import type { ApiResponse, PaginatedResponse } from "../types/api";

type Collection = AdminUser[] | PaginatedResponse<AdminUser> | ApiResponse<AdminUser[]>;
const unwrap = (data: Collection): AdminUser[] => Array.isArray(data) ? data : "results" in data ? data.results : data.data;

export const adminUserService = {
  async list(): Promise<AdminUser[]> {
    return unwrap((await api.get<Collection>(endpoints.admin.users)).data);
  },
  async setActive(id: string, active: boolean): Promise<AdminUser> {
    const response = await api.patch<ApiResponse<AdminUser> | AdminUser>(`${endpoints.admin.users}${id}/`, { isActive: active });
    return "data" in response.data ? response.data.data : response.data;
  },
};
