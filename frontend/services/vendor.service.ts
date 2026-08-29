import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import { ApiResponse, PaginatedResponse } from "../types/api";
import { Vendor } from "../types/vendor";
import { Product } from "../types/product";

export const vendorService = {
  async getVendors() {
    return api.get<PaginatedResponse<Vendor> | ApiResponse<Vendor[]>>(endpoints.vendors);
  },
  async getPublicVendors(): Promise<Vendor[]> {
    const response = await this.getVendors();
    const payload = response.data;
    const vendors = payload?.results ?? payload?.data ?? [];
    return vendors.filter((v: Vendor) => (v.approvalStatus ?? (v.status === "active" ? "approved" : v.status)) === "approved");
  },
  async getVendor(id: string) {
    return api.get<ApiResponse<Vendor> | Vendor>(`${endpoints.vendors}${id}/`);
  },
  async getVendorProducts(id: string) {
    return api.get<PaginatedResponse<Product> | ApiResponse<Product[]>>(endpoints.vendorProducts(id));
  },
};
