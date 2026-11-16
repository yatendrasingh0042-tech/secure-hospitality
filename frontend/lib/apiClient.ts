/**
 * Centralized Secure Hospitality API Client
 * Manages base URL, JWT authorization headers, status handling (401, 403, 404, 422, 500), and response parsing.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500);

  try {
    const res = await fetch(url, {
      credentials: "include",
      signal: options.signal || controller.signal,
      ...options,
      headers,
    });
    clearTimeout(timeoutId);

    let data: any = {};
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json().catch(() => ({}));
    }

    if (!res.ok) {
      // 401 Token Expiration / Invalid Session
      if (res.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      }

      const errorMessage =
        data.message ||
        (Array.isArray(data.errors) ? data.errors.join(". ") : null) ||
        (res.status === 401
          ? "Session expired. Please log in again."
          : res.status === 403
          ? "Access denied. You do not have permission."
          : res.status === 404
          ? "Unable to complete request. The requested endpoint or resource was not found."
          : res.status === 422 || res.status === 400
          ? "Validation error. Please check your inputs."
          : "An unexpected server error occurred.");

      throw new ApiError(res.status, errorMessage, data);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      500,
      `Network error: Unable to connect to backend server at ${API_BASE_URL}. Please ensure the backend server is running and accessible.`
    );
  }
}
