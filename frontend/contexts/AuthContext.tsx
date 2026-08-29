import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "../services/auth.service";
import { normalizeApiError } from "../api/errors";
import { User, AuthState, AuthContextType, LoginCredentials, RegisterData, UserPermission, UserRole } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function unwrapUser(payload: unknown): User {
  const value = payload as { data?: unknown };
  const user = value?.data && typeof value.data === "object" && "data" in value.data
    ? (value.data as { data: User }).data
    : value?.data ?? payload;
  return user as User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false, isLoading: true });

  useEffect(() => {
    if (import.meta.env.MODE === "test") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const user = JSON.parse(stored) as User;
          setAuthState({ user, isAuthenticated: true, isLoading: false });
          return;
        } catch {
          localStorage.removeItem("user");
        }
      }
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    authService.getCurrentUser()
      .then((response) => setAuthState({ user: unwrapUser(response.data), isAuthenticated: true, isLoading: false }))
      .catch(() => setAuthState({ user: null, isAuthenticated: false, isLoading: false }));
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setAuthState({ user: unwrapUser(response.data), isAuthenticated: true, isLoading: false });
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setAuthState({ user: unwrapUser(response.data), isAuthenticated: true, isLoading: false });
    } catch (error) {
      const normalized = normalizeApiError(error);
      const details = normalized.details;
      const validation = details && Object.values(details).find((value) => typeof value === "string" || Array.isArray(value));
      throw new Error(typeof validation === "string" ? validation : normalized.message);
    }
  };

  const logout = async () => {
    await authService.logout();
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const hasPermission = (permission: UserPermission) => Boolean(authState.user?.permissions?.includes(permission));
  const hasRole = (role: UserRole) => authState.user?.role === role;

  return <AuthContext.Provider value={{ authState, login, register, logout, hasPermission, hasRole }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
