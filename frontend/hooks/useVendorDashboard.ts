import { useCallback, useEffect, useState } from "react";
import { Product } from "../types/product";
import { OrderStatus, VendorOrder } from "../types/order";
import { vendorDashboardService } from "../services/vendor-dashboard.service";
import type { VendorDashboardStats } from "../services/vendor-dashboard.service";
import { useNotifications } from "../contexts/NotificationContext";

export function useVendorDashboard(vendorId?: string) {
  const id = vendorId || "";
  const { addNotification } = useNotifications();
  const [stats, setStats] = useState<VendorDashboardStats | null>(null);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [s, o, p] = await Promise.all([vendorDashboardService.getStats(id), vendorDashboardService.getOrders(id), vendorDashboardService.getProducts(id)]);
    setStats(s); setOrders(o); setProducts(p); setLoading(false);
  }, [id]);
  useEffect(() => { refresh(); }, [refresh]);
  const updateProduct = async (productId: string, changes: Partial<Product>) => { await vendorDashboardService.updateProduct(productId, changes); await refresh(); };
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => { await vendorDashboardService.updateOrderStatus(orderId, status); addNotification({ userId: id, title: "Commande mise à jour", message: `La commande ${orderId} est maintenant ${status}.`, type: "info" }); await refresh(); };
  const updateShipment = async (orderId: string, shipment: { carrier: string; trackingNumber: string; estimatedDeliveryDate?: string }) => {
    const order = orders.find(item => item.id === orderId);
    await vendorDashboardService.updateShipment(orderId, shipment);
    if (order?.userId) addNotification({ userId: order.userId, title: "Commande expédiée", message: `Votre commande ${orderId} est suivie par ${shipment.carrier} (${shipment.trackingNumber}).`, type: "info" });
    await refresh();
  };
  return { stats: stats || {}, orders: orders || [], products: products || [], loading, refresh, updateProduct, updateOrderStatus, updateShipment };
}
