import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { useOrders } from "../hooks/useOrders";
import { useLocalization } from "../contexts/LocalizationContext";

const labels: Record<string, string> = { pending: "En attente", confirmed: "Confirmée", processing: "En préparation", shipped: "Expédiée", delivered: "Livrée", cancelled: "Annulée" };
export function OrderDetailPage({ orderId }: { orderId: string }) {
  const { order, isLoading, error, cancelOrder } = useOrders(orderId);
  const { formatPrice } = useLocalization();
  if (isLoading) return <div className="py-16 text-center text-muted-foreground">Chargement de la commande...</div>;
  if (error || !order) return <div role="alert" className="py-16 text-center text-destructive">{error || "Commande introuvable."}</div>;
  return <div className="max-w-3xl mx-auto space-y-6"><Button variant="ghost" asChild><Link to="/account/orders"><ArrowLeft className="mr-2 h-4 w-4" />Mes commandes</Link></Button><div><h1 className="text-2xl font-bold">Commande {order.orderNumber}</h1><p className="text-muted-foreground">{labels[order.status] || order.status}</p></div><Card><CardHeader><CardTitle>Articles</CardTitle></CardHeader><CardContent className="space-y-3">{order.items.map(item => <div key={item.id} className="flex justify-between gap-4 text-sm"><span>{item.productName} x{item.quantity}</span><span>{formatPrice(item.total)}</span></div>)}<Separator /><div className="flex justify-between font-semibold"><span>Total</span><span>{formatPrice(order.total)}</span></div></CardContent></Card>{order.vendors?.map(vendorOrder => <Card key={vendorOrder.id}><CardHeader><CardTitle>{vendorOrder.vendorName}</CardTitle></CardHeader><CardContent className="space-y-2"><p>Statut : {labels[vendorOrder.deliveryStatus || vendorOrder.status] || vendorOrder.status}</p>{vendorOrder.carrier && <p>Transporteur : {vendorOrder.carrier}</p>}{vendorOrder.trackingNumber && <p>Numéro de suivi : <strong>{vendorOrder.trackingNumber}</strong></p>}{vendorOrder.estimatedDeliveryDate && <p>Livraison estimée : {new Date(vendorOrder.estimatedDeliveryDate).toLocaleDateString("fr-FR")}</p>}</CardContent></Card>)}{order.customer && <Card><CardHeader><CardTitle>Adresse de livraison</CardTitle></CardHeader><CardContent><p>{order.customer.name}</p><p>{order.customer.address}, {order.customer.city}</p><p>{order.customer.phone}</p></CardContent></Card>}{order.status !== "cancelled" && order.status !== "delivered" && <Button variant="outline" onClick={() => void cancelOrder(order.id)}>Annuler la commande</Button>}</div>;
}
