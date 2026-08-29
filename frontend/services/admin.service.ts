import { api } from "../api/client";
import { Vendor, VendorApprovalStatus } from "../types/vendor";
import { commissionService } from "./commission.service";
import { ApiResponse } from "../types/api";

export interface VendorAudit { id: string; vendorId: string; vendorName?: string; action: VendorApprovalStatus; reason?: string; createdAt: string; }
export const adminService = {
  async getVendors(): Promise<Vendor[]> { const r = await api.get<ApiResponse<Vendor[]> | Vendor[]>("/admin/vendors/"); const payload = r.data; return Array.isArray(payload) ? payload : payload.data; },
  async setVendorStatus(vendorId: string, status: VendorApprovalStatus, reason?: string): Promise<Vendor> {
    const r = await api.patch<ApiResponse<Vendor> | Vendor>(`/admin/vendors/${vendorId}/`, { approvalStatus: status, reason });
    const payload = r.data;
    return "data" in payload ? payload.data as Vendor : payload as Vendor;
  },
  async getAuditHistory() { const response = await api.get<ApiResponse<VendorAudit[]> | VendorAudit[]>("/admin/vendor-audits/"); const payload = response.data; return Array.isArray(payload) ? payload : payload.data; },
  getCommissionTotals: () => commissionService.getTotals(),
};
