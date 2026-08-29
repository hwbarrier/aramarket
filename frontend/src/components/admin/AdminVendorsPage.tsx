import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useAdminVendors } from "../../hooks/useAdminVendors";
import { VendorApprovalStatus } from "../../types/vendor";
import { useNotifications } from "../../contexts/NotificationContext";

export function AdminVendorsPage() {
  const { vendors, audit, loading, setStatus } = useAdminVendors();
  const { addNotification } = useNotifications();
  const action = async (id: string, status: VendorApprovalStatus) => { await setStatus(id, status, status === "rejected" ? "Non conforme" : undefined); addNotification({ userId: id, title: "Statut vendeur mis à jour", message: `Votre demande est ${status}.`, type: status === "approved" ? "success" : "warning" }); };
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold">Approbation des vendeurs</h1><p className="text-muted-foreground">Validez les boutiques avant publication.</p></div>
    <Card><CardHeader><CardTitle>Vendeurs ({vendors.length})</CardTitle></CardHeader><CardContent className="space-y-3">{loading ? <p>Chargement...</p> : vendors.map(v => <div key={v.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"><div><p className="font-medium">{v.name}</p><p className="text-sm text-muted-foreground">{v.email || v.location}</p></div><div className="flex items-center gap-2"><Badge>{v.approvalStatus || v.status || "pending"}</Badge><Button size="sm" onClick={() => action(v.id, "approved")}>Approuver</Button><Button size="sm" variant="outline" onClick={() => action(v.id, "rejected")}>Rejeter</Button><Button size="sm" variant="destructive" onClick={() => action(v.id, "suspended")}>Suspendre</Button></div></div>)}</CardContent></Card>
    <Card><CardHeader><CardTitle>Historique d'audit</CardTitle></CardHeader><CardContent>{audit.slice(0, 10).map(item => <p key={item.id} className="text-sm">{item.createdAt.slice(0, 10)} · {item.vendorId} · {item.action}</p>)}</CardContent></Card>
  </div>;
}
