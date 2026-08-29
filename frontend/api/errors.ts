import axios from "axios";

export interface ApiError {
  message: string;
  status?: number;
  details?: Record<string, unknown>;
  isNetworkError?: boolean;
}

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const details = error.response?.data;
    const message = typeof details?.message === "string"
      ? details.message
      : error.code === "ERR_NETWORK"
        ? "Impossible de contacter le serveur."
        : error.response?.status && error.response.status >= 500
          ? "Une erreur est survenue."
          : error.message;
    return {
      message,
      status: error.response?.status,
      details: typeof details === "object" && details !== null ? details as Record<string, unknown> : undefined,
      isNetworkError: !error.response,
    };
  }

  return {
    message: error instanceof Error ? error.message : "Une erreur inattendue est survenue",
  };
}
