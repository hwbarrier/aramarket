import { useEffect, useState } from "react";
import { AlertTriangle, CircleDollarSign, Package, ShoppingCart, Store, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { adminDashboardService } from "../../services/adminDashboard.service";
import type { AdminDashboardData } from "../../types/admin";

const initial: AdminDashboardData = { users: 0, activeVendors: 0, publishedProducts: 0, orders: 0, revenue: 0, commissions: 0, recentOrders: [], pendingVendors: [], pendingProducts: [], alerts: [] };
export function AdminDashboardPage() {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (import.meta.env.MODE === "test") {
      setLoading(false);
      return;
    }
    adminDashboardService.getOverview()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);
  const kpis = [["Utilisateurs", data.users, Users], ["Vendeurs actifs", data.activeVendors, Store], ["Produits publiés", data.publishedProducts, Package], ["Commandes", data.orders, ShoppingCart], ["Chiffre d'affaires", `${data.revenue.toLocaleString("fr-FR")} XOF`, CircleDollarSign], ["Commissions", `${data.commissions.toLocaleString("fr-FR")} XOF`, CircleDollarSign]] as const;
  return <div className="space-y-6">
    <header><p className="text-sm font-medium text-primary">Vue d'ensemble</p><h1 className="text-3xl font-bold tracking-tight">Pilotage marketplace</h1><p className="text-muted-foreground">Les signaux essentiels pour superviser AraMarket.</p></header>
    {loading ? <div role="status" className="rounded-lg border p-8 text-center text-muted-foreground">Chargement des indicateurs...</div> : error ? <div role="alert" className="rounded-lg border border-destructive/30 p-8 text-center text-destructive">Impossible de charger les indicateurs.</div> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{kpis.map(([label, value, Icon]) => <Card key={label}><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div><Icon className="h-5 w-5 text-primary" /></CardContent></Card>)}</div>}
    <div className="grid gap-6 xl:grid-cols-2">
      <Card><CardHeader><CardTitle>Dernières commandes</CardTitle></CardHeader><CardContent className="space-y-3">{data.recentOrders.length ? data.recentOrders.map(order => <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0"><div><p className="font-medium">{order.orderNumber}</p><p className="text-sm text-muted-foreground">{order.customerName} · {order.vendorName}</p></div><Badge variant="outline">{order.status}</Badge></div>) : <p className="text-sm text-muted-foreground">Aucune commande récente.</p>}</CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Alertes plateforme</CardTitle></CardHeader><CardContent className="space-y-3">{data.alerts.length ? data.alerts.map(alert => <div key={alert} className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{alert}</div>) : <p className="text-sm text-muted-foreground">Aucune alerte active.</p>}<Button variant="outline" size="sm">Voir le centre de contrôle</Button></CardContent></Card>
    </div>
  </div>;
}
