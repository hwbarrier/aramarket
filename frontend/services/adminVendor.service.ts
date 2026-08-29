import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import type { AdminVendor } from "../types/admin";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type { VendorApprovalStatus } from "../types/vendor";

type Collection = AdminVendor[] | PaginatedResponse<AdminVendor> | ApiResponse<AdminVendor[]>;
const unwrap = (data: Collection): AdminVendor[] => Array.isArray(data) ? data : "results" in data ? data.results : data.data;

export const adminVendorService = {
  async list(): Promise<AdminVendor[]> {
    return unwrap((await api.get<Collection>(endpoints.admin.vendors)).data);
  },
  async updateStatus(id: string, status: VendorApprovalStatus): Promise<AdminVendor> {
    const response = await api.patch<ApiResponse<AdminVendor> | AdminVendor>(`${endpoints.admin.vendors}${id}/`, { approvalStatus: status });
    return "data" in response.data ? response.data.data : response.data;
  },
};
