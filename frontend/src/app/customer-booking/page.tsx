"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { ApiError, api } from "@/lib/api";
import { getSession } from "@/lib/session";
import { ServiceItem, StaffItem } from "@/lib/types";

const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];

export default function CustomerBookingPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("Loading services...");
  const [queryBusinessId, setQueryBusinessId] = useState<number>(0);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    bookingDate: "",
    bookingTime: "",
    serviceId: "",
    staffId: "",
    notes: ""
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const fromQuery = Number(params.get("businessId") || 0);
    setQueryBusinessId(Number.isFinite(fromQuery) ? fromQuery : 0);
  }, []);

  const businessId = useMemo(() => {
    const session = getSession();
    const fromEnv = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_ID;
    return Number(queryBusinessId || fromEnv || session?.businessId || 0);
  }, [queryBusinessId]);

  useEffect(() => {
    if (!businessId) {
      setMessage("Booking link is missing a business ID.");
      return;
    }

    Promise.all([api.getPublicServices(businessId), api.getPublicStaff(businessId)])
      .then(([serviceData, staffData]) => {
        setServices(serviceData);
        setStaff(staffData);
        setMessage("");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Could not load services.");
      });
  }, [businessId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    if (!businessId) {
      setMessage("Booking link is missing a business ID.");
      return;
    }

    if (!form.serviceId || !form.staffId || !form.bookingDate || !form.bookingTime) {
      setMessage("Please complete all booking steps.");
      return;
    }

    try {
      await api.createPublicBooking({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        bookingDate: form.bookingDate,
        bookingTime: `${form.bookingTime}:00`,
        notes: form.notes,
        serviceId: Number(form.serviceId),
        staffId: Number(form.staffId),
        businessId
      });
      setMessage("Booking confirmed.");
      setForm({
        customerName: "",
        customerEmail: "",
        bookingDate: "",
        bookingTime: "",
        serviceId: "",
        staffId: "",
        notes: ""
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(error.fieldErrors || {});
        setMessage(error.message);
      } else {
        setMessage(error instanceof Error ? error.message : "Could not create booking.");
      }
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar showAuthActions={false} />
      <main className="mx-auto max-w-3xl px-4 py-4 md:px-6">
        <form onSubmit={handleSubmit} className="animate-fade-in-up rounded-[24px] border border-[#ece9ff] bg-[#f8f8ff] p-6 shadow-[0_10px_24px_rgba(45,35,110,0.1)]">
          <h1 className="text-2xl font-semibold text-ink">Book an Appointment</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Complete each step to confirm your booking.</p>

          <div className="mt-4 space-y-3">
            <div>
              <input className="w-full px-4 py-2.5 text-sm" placeholder="Your Name" required value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} />
              {fieldErrors.customerName ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.customerName}</p> : null}
            </div>
            <div>
              <input className="w-full px-4 py-2.5 text-sm" placeholder="Your Email" type="email" required value={form.customerEmail} onChange={(event) => setForm({ ...form, customerEmail: event.target.value })} />
              {fieldErrors.customerEmail ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.customerEmail}</p> : null}
            </div>

            <select className="w-full px-4 py-2.5 text-sm" value={form.serviceId} onChange={(event) => setForm({ ...form, serviceId: event.target.value })}>
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            {fieldErrors.serviceId ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.serviceId}</p> : null}

            <select className="w-full px-4 py-2.5 text-sm" value={form.staffId} onChange={(event) => setForm({ ...form, staffId: event.target.value })}>
              <option value="">Select Staff</option>
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            {fieldErrors.staffId ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.staffId}</p> : null}

            <input className="w-full px-4 py-2.5 text-sm" type="date" value={form.bookingDate} onChange={(event) => setForm({ ...form, bookingDate: event.target.value })} />
            {fieldErrors.bookingDate ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.bookingDate}</p> : null}

            <div>
              <p className="mb-2 text-sm font-medium text-ink">Select Time</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setForm({ ...form, bookingTime: slot })}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition duration-200 hover:scale-[1.03] ${
                      form.bookingTime === slot ? "bg-[#6D5DF6] text-white" : "bg-white text-[#4c46b8]"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Button type="submit" fullWidth>
              Confirm Booking
            </Button>
          </div>
          {message && !Object.keys(fieldErrors).length ? <p className="mt-3 text-sm text-primary">{message}</p> : null}
        </form>
      </main>
    </div>
  );
}
