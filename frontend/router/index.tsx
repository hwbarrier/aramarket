import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { ReactNode } from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { PageNotFound } from "../components/common/PageNotFound";

export interface AppRouteProps {
  home: ReactNode;
  products: ReactNode;
  product: ReactNode;
  cart: ReactNode;
  checkout: ReactNode;
  login: ReactNode;
  register: ReactNode;
  becomeVendor?: ReactNode;
  vendorDashboard: ReactNode;
  vendorProducts?: ReactNode;
  vendorProductCreate?: ReactNode;
  vendorProductEdit?: ReactNode;
  vendorInventory?: ReactNode;
  vendorOrders?: ReactNode;
  vendorOrderDetail?: ReactNode;
  vendorEarnings?: ReactNode;
  vendorSettings?: ReactNode;
  adminDashboard: ReactNode;
  adminVendors?: ReactNode;
  adminProducts?: ReactNode;
  adminOrders?: ReactNode;
  adminUsers?: ReactNode;
  adminCategories?: ReactNode;
  adminAudits?: ReactNode;
  adminSettings?: ReactNode;
  vendors: ReactNode;
  vendorStore: ReactNode;
  orders: ReactNode;
  orderDetail: ReactNode;
  additionalRoutes?: ReactNode;
}

export function AppRouter({
  home,
  products,
  product,
  cart,
  checkout,
  login,
  register,
  becomeVendor,
  vendorDashboard,
  vendorProducts,
  vendorProductCreate,
  vendorProductEdit,
  vendorInventory,
  vendorOrders,
  vendorOrderDetail,
  vendorEarnings,
  vendorSettings,
  adminDashboard,
  adminVendors,
  adminProducts,
  adminOrders,
  adminUsers,
  adminCategories,
  adminAudits,
  adminSettings,
  vendors,
  vendorStore,
  orders,
  orderDetail,
  additionalRoutes,
}: AppRouteProps) {
  return (
    <Routes>
      <Route path="/" element={home} />
      <Route path="/products" element={products} />
      <Route path="/vendors" element={vendors} />
      <Route path="/vendor/:id" element={vendorStore} />
      <Route path="/product/:id" element={product} />
      <Route path="/cart" element={cart} />
      <Route path="/checkout" element={<ProtectedRoute>{checkout}</ProtectedRoute>} />
      <Route path="/account/orders" element={<ProtectedRoute>{orders}</ProtectedRoute>} />
      <Route path="/account/orders/:id" element={<ProtectedRoute>{orderDetail}</ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute>{orders}</ProtectedRoute>} />
      <Route path="/login" element={login} />
      <Route path="/register" element={register} />
      <Route path="/become-vendor" element={becomeVendor || home} />
      <Route path="/categories" element={home} />
      <Route path="/profile" element={<ProtectedRoute>{home}</ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute>{home}</ProtectedRoute>} />
      <Route path="/messaging" element={<ProtectedRoute>{home}</ProtectedRoute>} />
      <Route path="/message-templates" element={<ProtectedRoute>{home}</ProtectedRoute>} />
      <Route path="/conversation-history" element={<ProtectedRoute>{home}</ProtectedRoute>} />
      <Route path="/vendor/dashboard" element={<ProtectedRoute role="vendor">{vendorDashboard}</ProtectedRoute>} />
      <Route path="/vendor/products" element={<ProtectedRoute role="vendor">{vendorProducts || vendorDashboard}</ProtectedRoute>} />
      <Route path="/vendor/products/create" element={<ProtectedRoute role="vendor">{vendorProductCreate || vendorProducts || vendorDashboard}</ProtectedRoute>} />
      <Route path="/vendor/products/:id/edit" element={<ProtectedRoute role="vendor">{vendorProductEdit || vendorProducts || vendorDashboard}</ProtectedRoute>} />
      <Route path="/vendor/inventory" element={<ProtectedRoute role="vendor">{vendorInventory || vendorDashboard}</ProtectedRoute>} />
      <Route path="/vendor/orders" element={<ProtectedRoute role="vendor">{vendorOrders || vendorDashboard}</ProtectedRoute>} />
      <Route path="/vendor/orders/:id" element={<ProtectedRoute role="vendor">{vendorOrderDetail || vendorOrders || vendorDashboard}</ProtectedRoute>} />
      <Route path="/vendor/earnings" element={<ProtectedRoute role="vendor">{vendorEarnings || vendorDashboard}</ProtectedRoute>} />
      <Route path="/vendor/settings" element={<ProtectedRoute role="vendor">{vendorSettings || vendorDashboard}</ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin">{adminDashboard}</ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin">{adminVendors || adminDashboard}</ProtectedRoute>} />
      <Route path="/admin/vendors" element={<ProtectedRoute role="admin">{adminVendors || adminDashboard}</ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute role="admin">{adminProducts || adminDashboard}</ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute role="admin">{adminOrders || adminDashboard}</ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin">{adminUsers || adminDashboard}</ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute role="admin">{adminCategories || adminDashboard}</ProtectedRoute>} />
      <Route path="/admin/vendor-audits/" element={<ProtectedRoute role="admin">{adminAudits || adminDashboard}</ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin">{adminSettings || adminDashboard}</ProtectedRoute>} />
      <Route path="/404" element={<PageNotFound />} />
      {additionalRoutes}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export function RouterProvider({ children }: { children: ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}
