export interface CommissionRule {
  id: string;
  scope: "global" | "vendor" | "category";
  targetId?: string;
  rate: number;
  appliesTo?: "order_subtotal" | "order_total";
  effectiveFrom?: string;
  effectiveUntil?: string;
  active: boolean;
}

export interface Commission {
  id: string;
  vendorId: string;
  orderId: string;
  orderTotal: number;
  rate: number;
  amount: number;
  vendorPayout: number;
  createdAt: string;
}

export const DEFAULT_COMMISSION_RATE = 0.1;

export function calculateCommission(total: number, rate = DEFAULT_COMMISSION_RATE) {
  const amount = Math.round(total * rate * 100) / 100;
  return { amount, vendorPayout: Math.round((total - amount) * 100) / 100 };
}
