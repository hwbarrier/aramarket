import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, Boxes, ClipboardList, LayoutDashboard, Settings, Tag, Users, Store } from "lucide-react";
import type { ReactNode } from "react";

const links = [
  ["/admin/dashboard", "Pilotage", LayoutDashboard],
  ["/admin/vendors", "Vendeurs", Store],
  ["/admin/products", "Produits", Boxes],
  ["/admin/orders", "Commandes", ClipboardList],
  ["/admin/users", "Utilisateurs", Users],
  ["/admin/categories", "Catégories", Tag],
  ["/admin/settings", "Paramètres", Settings],
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-6 lg:flex-row">
      <aside className="w-full shrink-0 rounded-xl border bg-card p-3 lg:w-60">
        <div className="mb-4 border-b px-3 pb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">AraMarket</p>
          <h2 className="text-lg font-bold">Centre d'administration</h2>
        </div>
        <nav aria-label="Navigation administration" className="grid gap-1">
          {links.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${location.pathname === to ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="min-w-0 flex-1">{children}</section>
    </div>
  );
}
