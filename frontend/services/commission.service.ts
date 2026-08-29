import { api } from "../api/client";
import { Commission, calculateCommission, DEFAULT_COMMISSION_RATE } from "../types/commission";

export const commissionService = {
  calculate: calculateCommission,
  async getVendorCommissions(vendorId: string): Promise<Commission[]> {
    return (await api.get<Commission[]>(`/commissions/?vendor=${encodeURIComponent(vendorId)}`)).data;
  },
  async getTotals(): Promise<{ total: number; payout: number }> {
    return (await api.get<{ total: number; payout: number }>("/commissions/totals/")).data;
  },
  async record(vendorId: string, orderId: string, total: number, rate = DEFAULT_COMMISSION_RATE) {
    const result = calculateCommission(total, rate);
    return (await api.post<Commission>("/commissions/", { vendorId, orderId, orderTotal: total, rate, ...result })).data;
  },
};
