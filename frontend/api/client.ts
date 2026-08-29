import axios from "axios";

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAccessToken(token: string | null) {
  accessToken = token;
}

function csrfToken() {
  return document.cookie.split("; ").find((entry) => entry.startsWith("csrftoken="))?.split("=")[1];
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  const csrf = csrfToken();
  if (csrf) config.headers["X-CSRFToken"] = decodeURIComponent(csrf);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (import.meta.env.DEV && error instanceof Error) {
      console.error("API request failed", error.message);
    }

    const request = error.config;
    if (error.response?.status === 401 && request && !request._retry && !request.url?.includes("/auth/refresh/")) {
      request._retry = true;
      refreshPromise ??= api.post<{ access?: string }>("/auth/refresh/").then(({ data }) => {
        accessToken = data.access ?? null;
        return accessToken;
      }).catch(() => {
        accessToken = null;
        return null;
      }).finally(() => { refreshPromise = null; });
      const token = await refreshPromise;
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
        return api(request);
      }
    }

    return Promise.reject(error);
  },
);
