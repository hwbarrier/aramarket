import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import { ApiResponse, PaginatedResponse } from "../types/api";
import { Order, OrderItem, VendorOrder } from "../types/order";

type CreateOrderInput = Omit<Order, "id" | "createdAt" | "status">;

type OrderResponse = ApiResponse<Order> | Order;
type OrdersResponse = PaginatedResponse<Order> | ApiResponse<Order[]>;

export function calculateVendorSuborders(items: OrderItem[]): VendorOrder[] {
  const groups = new Map<string, VendorOrder>();
  items.forEach(item => {
    const vendorId = item.vendorId || "unknown";
    const current = groups.get(vendorId);
    if (current) {
      current.items.push(item);
      current.subtotal += item.total;
      return;
    }
    groups.set(vendorId, {
      id: `vendor-order-${vendorId}`,
      vendorId,
      vendorName: item.vendorName || "Boutique",
      items: [item],
      status: "pending",
      deliveryStatus: "pending",
      subtotal: item.total,
    });
  });
  return Array.from(groups.values());
}

function unwrap<T>(response: T | { data: T }): T {
  return response && typeof response === "object" && "data" in response ? response.data : response as T;
}

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const response = await api.get<OrdersResponse>(endpoints.orders);
    const payload = unwrap(response.data);
    return Array.isArray(payload) ? payload : payload.results ?? [];
  },

  async getOrder(id: string): Promise<Order | undefined> {
    const response = await api.get<OrderResponse>(`${endpoints.orders}${id}/`);
    return unwrap(response.data) as Order;
  },

  async createOrder(order: CreateOrderInput): Promise<Order> {
    const response = await api.post<OrderResponse>(endpoints.orders, order);
    return unwrap(response.data) as Order;
  },

  async cancelOrder(id: string): Promise<Order | undefined> {
    const response = await api.post<OrderResponse>(`${endpoints.orders}${id}/cancel/`, {});
    return unwrap(response.data) as Order;
  },
};
