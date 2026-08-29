export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: UserPermission[];
  createdAt: string;
  isVerified: boolean;
  vendorProfileId?: string | number;
}

export type UserRole = 'visitor' | 'client' | 'vendor' | 'admin';

export type UserPermission = 
  | 'buy_products'
  | 'sell_products' 
  | 'manage_products'
  | 'manage_users'
  | 'manage_orders'
  | 'view_analytics'
  | 'manage_settings';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'client';
  permissions: UserPermission[];
}

export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: UserPermission) => boolean;
  hasRole: (role: UserRole) => boolean;
}