import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useOrders } from "../hooks/useOrders";
import { useLocalization } from "../contexts/LocalizationContext";

const labels: Record<string, string> = { pending: "En attente", confirmed: "Confirmée", processing: "En préparation", shipped: "Expédiée", delivered: "Livrée", cancelled: "Annulée" };

export function OrdersPage() {
  const { orders, isLoading, error } = useOrders();
  const { formatPrice } = useLocalization();
  if (isLoading) return <div className="py-16 text-center text-muted-foreground">Chargement de vos commandes...</div>;
  if (error) return <div role="alert" className="py-16 text-center text-destructive">{error}</div>;
  return <div className="max-w-4xl mx-auto space-y-6"><div><h1 className="text-2xl font-bold">Mes commandes</h1><p className="text-muted-foreground">Retrouvez votre historique et le suivi de vos achats.</p></div>{orders.length === 0 ? <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground mb-4">Aucune commande pour le moment.</p><Button asChild><Link to="/products">Découvrir le catalogue</Link></Button></CardContent></Card> : <div className="space-y-3">{orders.map(order => <Card key={order.id}><CardHeader className="flex flex-row items-center justify-between gap-3"><div><CardTitle className="text-base">Commande {order.orderNumber}</CardTitle><p className="text-sm text-muted-foreground">{new Date(order.createdAt || order.orderDate).toLocaleDateString("fr-FR")}</p></div><span className="rounded-full bg-muted px-3 py-1 text-sm">{labels[order.status] || order.status}</span></CardHeader><CardContent className="flex items-center justify-between gap-4"><span>{order.items.length} article(s) · {formatPrice(order.total)}</span><Button variant="outline" asChild><Link to={`/account/orders/${order.id}`}>Voir le détail</Link></Button></CardContent></Card>)}</div>}</div>;
}
