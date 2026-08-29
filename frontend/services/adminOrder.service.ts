import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import type { AdminOrder } from "../types/admin";
import type { ApiResponse, PaginatedResponse } from "../types/api";

type Collection = AdminOrder[] | PaginatedResponse<AdminOrder> | ApiResponse<AdminOrder[]>;
const unwrap = (data: Collection): AdminOrder[] => Array.isArray(data) ? data : "results" in data ? data.results : data.data;

export const adminOrderService = {
  async list(): Promise<AdminOrder[]> {
    return unwrap((await api.get<Collection>(endpoints.admin.orders)).data);
  },
};
