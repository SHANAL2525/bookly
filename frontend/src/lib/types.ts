export type AuthResponse = {
  message: string;
  token: string;
  userId: number;
  name: string;
  email: string;
  role: string;
  businessId: number | null;
};

export type ServiceItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  businessId: number;
};

export type CreateServicePayload = {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
};

export type StaffItem = {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  availability: string;
  businessId: number;
};

export type CreateStaffPayload = {
  name: string;
  role: string;
  email: string;
  phone: string;
  availability: string;
};

export type BookingItem = {
  id: number;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  notes: string;
  serviceId: number;
  serviceName: string;
  staffId: number;
  staffName: string;
  businessId: number;
};

export type CreateBookingPayload = {
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  bookingTime: string;
  status?: string;
  notes: string;
  serviceId: number;
  staffId: number;
  businessId?: number;
};

export type SettingsItem = {
  id: number;
  businessHours: string;
  bookingBufferMinutes: number;
  cancellationPolicy: string;
  allowOnlinePayments: boolean;
  businessId: number;
};

export type UpdateSettingsPayload = {
  businessHours: string;
  bookingBufferMinutes: number;
  cancellationPolicy: string;
  allowOnlinePayments: boolean;
};

export type BusinessProfile = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  ownerUserId: number;
};

export type UpdateBusinessPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
};

export type UserSession = {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: string;
  businessId: number | null;
};
