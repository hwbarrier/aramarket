import type { Order, OrderStatus, PaymentStatus } from "./order";
import type { Product } from "./product";
import type { User } from "./auth";
import type { Vendor, VendorApprovalStatus } from "./vendor";

export type AdminVendorStatus = Uppercase<VendorApprovalStatus>;
export type AdminProductStatus = "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";

export interface AdminVendor extends Vendor {
  ownerName: string;
  activity: string;
}

export interface AdminProduct extends Product {
  status: AdminProductStatus;
}

export interface AdminOrder extends Order {
  vendorName: string;
  customerName: string;
}

export interface AdminUser extends User {
  status: "ACTIVE" | "INACTIVE";
  lastActivity?: string;
}

export interface AdminDashboardData {
  users: number;
  activeVendors: number;
  publishedProducts: number;
  orders: number;
  revenue: number;
  commissions: number;
  recentOrders: AdminOrder[];
  pendingVendors: AdminVendor[];
  pendingProducts: AdminProduct[];
  alerts: string[];
}

export const adminOrderStatuses: Array<OrderStatus | "all"> = [
  "all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled",
];
export const adminPaymentStatuses: Array<PaymentStatus | "all"> = [
  "all", "pending", "completed", "failed", "refunded",
];
