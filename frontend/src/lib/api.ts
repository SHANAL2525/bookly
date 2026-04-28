import {
  AuthResponse,
  BookingItem,
  BusinessProfile,
  CreateBookingPayload,
  CreateServicePayload,
  CreateStaffPayload,
  ServiceItem,
  SettingsItem,
  StaffItem,
  UpdateBusinessPayload,
  UpdateSettingsPayload
} from "./types";
import { clearSession, getToken } from "./session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export class ApiError extends Error {
  fieldErrors?: Record<string, string>;

  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.fieldErrors = fieldErrors;
  }
}

function buildErrorMessage(status: number, fallback: string) {
  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action.";
  }

  return fallback;
}

function extractErrorMessage(error: any) {
  if (error?.errors && typeof error.errors === "object") {
    const firstFieldError = Object.values(error.errors).find(
      (value) => typeof value === "string" && value.trim().length > 0
    );

    if (typeof firstFieldError === "string") {
      return firstFieldError;
    }
  }

  if (typeof error?.message === "string" && error.message.trim().length > 0) {
    return error.message;
  }

  return "Request failed.";
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);
  const token = getToken();

  if (!(options?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      cache: "no-store"
    });
  } catch {
    throw new Error("Unable to reach the server. Please check that the backend is running.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed." }));
    const message = buildErrorMessage(response.status, extractErrorMessage(error));

    if (response.status === 401) {
      clearSession();
    }

    throw new ApiError(message, error?.errors);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  login(email: string, password: string) {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  },

  register(payload: { name: string; email: string; password: string; role: string; businessName: string }) {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  getBusinessProfile() {
    return request<BusinessProfile>("/businesses/me");
  },

  updateBusinessProfile(payload: UpdateBusinessPayload) {
    return request<BusinessProfile>("/businesses/me", {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },

  getServices() {
    return request<ServiceItem[]>("/services");
  },

  createService(service: CreateServicePayload) {
    return request<ServiceItem>("/services", {
      method: "POST",
      body: JSON.stringify(service)
    });
  },

  updateService(id: number, service: CreateServicePayload) {
    return request<ServiceItem>(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(service)
    });
  },

  deleteService(id: number) {
    return request<{ message: string }>(`/services/${id}`, {
      method: "DELETE"
    });
  },

  getStaff() {
    return request<StaffItem[]>("/staff");
  },

  createStaff(staff: CreateStaffPayload) {
    return request<StaffItem>("/staff", {
      method: "POST",
      body: JSON.stringify(staff)
    });
  },

  deleteStaff(id: number) {
    return request<{ message: string }>(`/staff/${id}`, {
      method: "DELETE"
    });
  },

  getBookings() {
    return request<BookingItem[]>("/bookings");
  },

  createBooking(booking: CreateBookingPayload) {
    return request<BookingItem>("/bookings", {
      method: "POST",
      body: JSON.stringify(booking)
    });
  },

  deleteBooking(id: number) {
    return request<{ message: string }>(`/bookings/${id}`, {
      method: "DELETE"
    });
  },

  getSettings() {
    return request<SettingsItem>("/settings/me");
  },

  updateSettings(settings: UpdateSettingsPayload) {
    return request<SettingsItem>("/settings/me", {
      method: "PUT",
      body: JSON.stringify(settings)
    });
  },

  getPublicServices(businessId: number) {
    return request<ServiceItem[]>(`/public/services?businessId=${businessId}`);
  },

  getPublicStaff(businessId: number) {
    return request<StaffItem[]>(`/public/staff?businessId=${businessId}`);
  },

  createPublicBooking(booking: CreateBookingPayload) {
    return request<BookingItem>("/public/bookings", {
      method: "POST",
      body: JSON.stringify(booking)
    });
  }
};
