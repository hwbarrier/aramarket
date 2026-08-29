import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import type { AdminProduct, AdminProductStatus } from "../types/admin";
import type { ApiResponse, PaginatedResponse } from "../types/api";

type Collection = AdminProduct[] | PaginatedResponse<AdminProduct> | ApiResponse<AdminProduct[]>;
const unwrap = (data: Collection): AdminProduct[] => Array.isArray(data) ? data : "results" in data ? data.results : data.data;

export const adminProductService = {
  async list(): Promise<AdminProduct[]> {
    return unwrap((await api.get<Collection>(endpoints.admin.products)).data);
  },
  async updateStatus(id: string, status: AdminProductStatus): Promise<AdminProduct> {
    const response = await api.patch<ApiResponse<AdminProduct> | AdminProduct>(`${endpoints.admin.products}${id}/`, { status: status.toLowerCase() });
    return "data" in response.data ? response.data.data : response.data;
  },
};
