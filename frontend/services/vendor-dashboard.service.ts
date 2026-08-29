import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import { Product } from "../types/product";
import { OrderStatus, VendorOrder } from "../types/order";
import { commissionService } from "./commission.service";

export interface VendorDashboardStats { productCount: number; sales: number; orderCount: number; conversionRate: number; commissionTotal: number; }
interface ApiEnvelope<T> { data?: T | { data?: T } | { results?: T } | T; }
const unwrap = <T,>(x: ApiEnvelope<T>): T => {
  const value = x.data;
  if (!value || typeof value !== "object") return value as T;
  if ("data" in value && value.data && typeof value.data !== "undefined") {
    return unwrap({ data: value.data as any }) as T;
  }
  if (Array.isArray((value as any).results)) {
    return (value as any).results as T;
  }
  if ("results" in value && (value as any).results !== undefined) {
    return (value as any).results as T;
  }
  return value as T;
};

export const vendorDashboardService = {
  async getStats(vendorId: string): Promise<VendorDashboardStats> {
    return unwrap<VendorDashboardStats>(await api.get<VendorDashboardStats>(`${endpoints.vendorDashboard}?vendor=${encodeURIComponent(vendorId)}`));
  },
  async getOrders(vendorId: string): Promise<VendorOrder[]> {
    return unwrap<VendorOrder[]>(await api.get<VendorOrder[]>(`${endpoints.orders}?vendor=${encodeURIComponent(vendorId)}`));
  },
  async getProducts(vendorId: string): Promise<Product[]> {
    return unwrap<Product[]>(await api.get<Product[]>(endpoints.vendorProducts(vendorId)));
  },
  async updateProduct(id: string, changes: Partial<Product>) {
    return unwrap<Product>(await api.patch<Product>(`${endpoints.products}${id}/`, changes));
  },
  async updateOrderStatus(id: string, status: OrderStatus) {
    return unwrap<VendorOrder>(await api.patch<VendorOrder>(`${endpoints.orders}${id}/`, { status, deliveryStatus: status }));
  },
  async updateShipment(id: string, shipment: Pick<VendorOrder, "carrier" | "trackingNumber" | "estimatedDeliveryDate">) {
    return unwrap<VendorOrder>(await api.patch<VendorOrder>(`${endpoints.orders}${id}/`, shipment));
  },
  async getCommissions(vendorId: string) { return commissionService.getVendorCommissions(vendorId); },
};
