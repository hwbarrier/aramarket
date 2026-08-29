import { useLocation } from "react-router-dom";
import { AdminShell } from "./AdminShell";
import { AdminDashboardPage } from "./AdminDashboardPage";
import { AdminVendorsPage, AdminProductsPage, AdminOrdersPage, AdminUsersPage, AdminAuditsPage } from "./AdminCollectionPages";
import { CategoryManagement } from "../../components/admin/CategoryManagement";

export function AdminCenter() {
  const { pathname } = useLocation();
  const content = pathname === "/admin/vendors" ? <AdminVendorsPage />
    : pathname === "/admin/products" ? <AdminProductsPage />
      : pathname === "/admin/orders" ? <AdminOrdersPage />
        : pathname === "/admin/users" ? <AdminUsersPage />
          : pathname === "/admin/categories" ? <CategoryManagement />
                  : pathname === "/admin/vendor-audits/" ? <AdminAuditsPage />
            : pathname === "/admin/settings" ? <div className="rounded-xl border bg-card p-6"><h1 className="text-2xl font-bold">Paramètres plateforme</h1><p className="mt-2 text-muted-foreground">Les réglages globaux seront reliés aux endpoints Django dans le Sprint 10.</p></div>
              : <AdminDashboardPage />;
  return <AdminShell>{content}</AdminShell>;
}
