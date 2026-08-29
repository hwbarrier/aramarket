import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: UserRole;
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { authState } = useAuth();
  const location = useLocation();

  if (authState.isLoading) {
    return <LoadingScreen />;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && authState.user?.role !== role) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
}
