import { useCallback, useEffect, useState } from "react";
import { Vendor, VendorApprovalStatus } from "../types/vendor";
import { adminService, VendorAudit } from "../services/admin.service";
export function useAdminVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [audit, setAudit] = useState<VendorAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => { setLoading(true); setVendors(await adminService.getVendors()); setAudit(await adminService.getAuditHistory()); setLoading(false); }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const setStatus = async (id: string, status: VendorApprovalStatus, reason?: string) => { await adminService.setVendorStatus(id, status, reason); await refresh(); };
  return { vendors, audit, loading, refresh, setStatus };
}
