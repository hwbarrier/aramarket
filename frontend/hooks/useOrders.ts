import { useCallback, useEffect, useState } from "react";
import { orderService } from "../services/order.service";
import { Order } from "../types/order";

export function useOrders(orderId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [order, setOrder] = useState<Order>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      if (orderId) setOrder(await orderService.getOrder(orderId));
      else setOrders(await orderService.getOrders());
    } catch {
      setError("Impossible de charger les commandes.");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const cancelOrder = async (id: string) => {
    const cancelled = await orderService.cancelOrder(id);
    if (cancelled) {
      setOrder(cancelled);
      setOrders(current => current.map(item => item.id === id ? cancelled : item));
    }
  };

  return { orders, order, isLoading, error, refresh, cancelOrder };
}
