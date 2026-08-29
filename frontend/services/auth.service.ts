import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import { ApiResponse } from "../types/api";
import { LoginCredentials, RegisterData, User } from "../types/auth";
import { setAccessToken } from "../api/client";
import { supabase } from "../lib/supabase";

async function exchangeSupabaseSessionForBackend() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session?.access_token) {
    return null;
  }

  const response = await api.post<ApiResponse<User> & { access?: string }>(endpoints.auth.supabaseLogin, {
    access_token: session.access_token,
  });

  if (response.data.access) setAccessToken(response.data.access);
  return response;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (!error && session?.access_token) {
        return await exchangeSupabaseSessionForBackend();
      }
    } catch {
      // Fall back to Django login when Supabase is unavailable or the user is not in Supabase.
    }

    await api.get(endpoints.auth.csrf);
    const response = await api.post<ApiResponse<User> & { access?: string }>(endpoints.auth.login, credentials);
    if (response.data.access) setAccessToken(response.data.access);
    return response;
  },
  async register(data: RegisterData) {
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            role: data.role,
            permissions: data.permissions,
          },
        },
      });

      if (!error && signUpData.session?.access_token) {
        return await exchangeSupabaseSessionForBackend();
      }
    } catch {
      // Fall back to Django register when Supabase is unavailable or confirms the user externally.
    }

    await api.get(endpoints.auth.csrf);
    const response = await api.post<ApiResponse<User> & { access?: string }>(endpoints.auth.register, data);
    if (response.data.access) setAccessToken(response.data.access);
    return response;
  },
  async logout() {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore Supabase sign-out failures and continue with backend logout.
    }

    try {
      return await api.post<void>(endpoints.auth.logout);
    } finally {
      setAccessToken(null);
    }
  },
  async getCurrentUser() {
    await api.get(endpoints.auth.csrf);
    return api.get<ApiResponse<User>>(endpoints.auth.currentUser);
  },
};
