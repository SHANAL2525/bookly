"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/shared/DashboardLayout";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import EmptyState from "@/components/ui/EmptyState";
import { ApiError, api } from "@/lib/api";
import { getSession } from "@/lib/session";
import { BookingItem, ServiceItem, StaffItem } from "@/lib/types";
import { PlusIcon } from "@/components/ui/Icons";

export default function BookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [message, setMessage] = useState("Loading bookings...");
  const [isOpen, setIsOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [filters, setFilters] = useState({
    serviceId: "",
    staffId: "",
    status: ""
  });
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    bookingDate: "",
    bookingTime: "",
    serviceId: "",
    staffId: "",
    notes: ""
  });

  async function loadData() {
    try {
      const [bookingData, serviceData, staffData] = await Promise.all([
        api.getBookings(),
        api.getServices(),
        api.getStaff()
      ]);
      setBookings(bookingData);
      setServices(serviceData);
      setStaff(staffData);
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load bookings.");
    }
  }

  useEffect(() => {
    if (!getSession()?.token) {
      router.replace("/login");
      return;
    }

    loadData();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    if (!form.serviceId || !form.staffId) {
      setMessage("Please choose both a service and a staff member.");
      return;
    }

    try {
      await api.createBooking({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        bookingDate: form.bookingDate,
        bookingTime: `${form.bookingTime}:00`,
        notes: form.notes,
        serviceId: Number(form.serviceId),
        staffId: Number(form.staffId)
      });
      setForm({
        customerName: "",
        customerEmail: "",
        bookingDate: "",
        bookingTime: "",
        serviceId: "",
        staffId: "",
        notes: ""
      });
      setMessage("Booking created successfully.");
      setIsOpen(false);
      await loadData();
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(error.fieldErrors || {});
        setMessage(error.message);
      } else {
        setMessage(error instanceof Error ? error.message : "Could not create booking.");
      }
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.deleteBooking(id);
      setMessage("Booking deleted successfully.");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete booking.");
    }
  }

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const matchesService = !filters.serviceId || String(booking.serviceId) === filters.serviceId;
        const matchesStaff = !filters.staffId || String(booking.staffId) === filters.staffId;
        const matchesStatus = !filters.status || booking.status === filters.status;
        return matchesService && matchesStaff && matchesStatus;
      }),
    [bookings, filters]
  );

  return (
    <DashboardLayout>
      <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Bookings" description="Track and manage appointments." />
        <Button onClick={() => { setFieldErrors({}); setIsOpen(true); }}>
          <PlusIcon className="h-4 w-4" />
          New Booking
        </Button>
      </div>

      <section className="mb-4 rounded-[22px] border border-[#e5e0ff] bg-[#f6f4ff] p-4 shadow-[0_8px_18px_rgba(45,35,110,0.08)]">
        <div className="grid gap-3 md:grid-cols-5">
          <select value={filters.serviceId} onChange={(event) => setFilters({ ...filters, serviceId: event.target.value })} className="px-3 py-2 text-sm">
            <option value="">Service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          <select value={filters.staffId} onChange={(event) => setFilters({ ...filters, staffId: event.target.value })} className="px-3 py-2 text-sm">
            <option value="">Staff</option>
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="px-3 py-2 text-sm">
            <option value="">Status</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <Button onClick={() => setFilters({ ...filters })}>Filter</Button>
          <Button variant="secondary" onClick={() => setFilters({ serviceId: "", staffId: "", status: "" })}>
            Reset
          </Button>
        </div>
      </section>

      <section className="rounded-[22px] border border-[#e5e0ff] bg-[#f6f4ff] p-4 shadow-[0_8px_18px_rgba(45,35,110,0.08)]">
        <Table
          headers={["Customer", "Service", "Staff", "Date", "Time", "Status", "Actions"]}
          rows={filteredBookings.map((booking) => [
            booking.customerName,
            booking.serviceName,
            booking.staffName,
            booking.bookingDate,
            booking.bookingTime.slice(0, 5),
            booking.status,
            <div key={`actions-${booking.id}`} className="flex flex-wrap gap-2">
              <button onClick={() => handleDelete(booking.id)} className="rounded-lg bg-[#f9f0f0] px-3 py-1 text-xs font-semibold text-[#b45353]">
                Delete
              </button>
            </div>
          ])}
        />
      </section>

      {!filteredBookings.length && message ? (
        <div className="mt-4">
          <EmptyState title="No Bookings Found" description={message} actionLabel="New Booking" onAction={() => setIsOpen(true)} />
        </div>
      ) : null}

      {message && filteredBookings.length > 0 ? <p className="mt-4 text-sm text-primary">{message}</p> : null}

      {isOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#1f203433] p-4 backdrop-blur-[1px]">
          <form onSubmit={handleSubmit} className="animate-scale-fade w-full max-w-lg rounded-[24px] bg-white p-6 shadow-[0_20px_40px_rgba(45,35,110,0.22)]">
            <h2 className="text-xl font-semibold text-ink">New Booking</h2>
            <div className="mt-4 space-y-3">
              <div>
                <input className="w-full px-4 py-2.5 text-sm" placeholder="Customer" required value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} />
                {fieldErrors.customerName ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.customerName}</p> : null}
              </div>
              <div>
                <input className="w-full px-4 py-2.5 text-sm" placeholder="Email" type="email" required value={form.customerEmail} onChange={(event) => setForm({ ...form, customerEmail: event.target.value })} />
                {fieldErrors.customerEmail ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.customerEmail}</p> : null}
              </div>
              <div>
                <input className="w-full px-4 py-2.5 text-sm" type="date" required value={form.bookingDate} onChange={(event) => setForm({ ...form, bookingDate: event.target.value })} />
                {fieldErrors.bookingDate ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.bookingDate}</p> : null}
              </div>
              <div>
                <input className="w-full px-4 py-2.5 text-sm" type="time" required value={form.bookingTime} onChange={(event) => setForm({ ...form, bookingTime: event.target.value })} />
                {fieldErrors.bookingTime ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.bookingTime}</p> : null}
              </div>
              <div>
              <select className="w-full px-4 py-2.5 text-sm" required value={form.serviceId} onChange={(event) => setForm({ ...form, serviceId: event.target.value })}>
                <option value="">Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              {fieldErrors.serviceId ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.serviceId}</p> : null}
              </div>
              <div>
              <select className="w-full px-4 py-2.5 text-sm" required value={form.staffId} onChange={(event) => setForm({ ...form, staffId: event.target.value })}>
                <option value="">Staff</option>
                {staff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              {fieldErrors.staffId ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.staffId}</p> : null}
              </div>
              <textarea className="w-full rounded-xl px-4 py-2.5 text-sm" placeholder="Notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            </div>
            {message && !Object.keys(fieldErrors).length ? <p className="mt-3 text-sm text-[#b42318]">{message}</p> : null}
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
