"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/shared/DashboardLayout";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { getSession } from "@/lib/session";
import { BookingItem, ServiceItem, StaffItem } from "@/lib/types";
import { BookingIcon, ServicesIcon, StaffIcon } from "@/components/ui/Icons";

export default function DashboardPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [message, setMessage] = useState("Loading dashboard...");
  const [shareMessage, setShareMessage] = useState("");
  const session = getSession();

  useEffect(() => {
    if (!session?.token) {
      router.replace("/login");
      return;
    }

    Promise.all([api.getServices(), api.getStaff(), api.getBookings()])
      .then(([servicesData, staffData, bookingsData]) => {
        setServices(servicesData);
        setStaff(staffData);
        setBookings(bookingsData);
        setMessage("");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Could not load dashboard.");
      });
  }, [router, session?.token]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayBookings = bookings.filter((booking) => booking.bookingDate === today);
  const bookingLink = useMemo(() => {
    if (!session?.businessId) {
      return "";
    }

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    return `${baseUrl}/customer-booking?businessId=${session.businessId}`;
  }, [session?.businessId]);

  const stats = [
    { label: "Today's Bookings", value: String(todayBookings.length), icon: BookingIcon },
    { label: "Total Services", value: String(services.length), icon: ServicesIcon },
    { label: "Active Staff", value: String(staff.length), icon: StaffIcon }
  ];

  async function handleCopyBookingLink() {
    if (!bookingLink) {
      setShareMessage("Booking link is unavailable for this account.");
      return;
    }

    try {
      await navigator.clipboard.writeText(bookingLink);
      setShareMessage("Booking link copied. Send it to your clients.");
    } catch {
      setShareMessage("Could not copy the booking link. Copy it manually below.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <PageHeader title="Dashboard" description={`Welcome, ${session?.name || "Bookly User"}!`} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label} title={item.label}>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-semibold text-ink">{item.value}</p>
              <item.icon className="h-5 w-5 text-[#5d51ea]" />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <Card title="Client Booking Link" subtitle="Send this link to clients so they can book online.">
          <div className="space-y-3">
            <input readOnly value={bookingLink} className="w-full rounded-xl border border-[#dfd9ff] bg-[#f6f3ff] px-4 py-2.5 text-sm text-[#374151]" />
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={handleCopyBookingLink} disabled={!bookingLink}>
                Copy Link
              </Button>
              <Button type="button" variant="secondary" href={bookingLink || "/customer-booking"}>
                Open Booking Page
              </Button>
            </div>
            {shareMessage ? <p className="text-sm text-primary">{shareMessage}</p> : null}
          </div>
        </Card>
      </div>

      {message ? (
        <div className="mt-4">
          <EmptyState title="Dashboard Unavailable" description={message} />
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-[22px] border border-[#e5e0ff] bg-[#f6f4ff] p-4 shadow-[0_8px_18px_rgba(45,35,110,0.08)]">
          <h2 className="mb-3 text-lg font-semibold text-ink">Recent Bookings</h2>
          <Table
            headers={["Customer", "Service", "Date", "Time", "Status"]}
            rows={bookings.slice(0, 6).map((booking) => [
              booking.customerName,
              booking.serviceName,
              booking.bookingDate,
              booking.bookingTime.slice(0, 5),
              booking.status
            ])}
          />
        </section>

        <Card title="Today's Schedule" subtitle={`${todayBookings.length} appointments`}>
          <div className="space-y-2">
            {todayBookings.length ? (
              todayBookings.slice(0, 6).map((booking) => (
                <div key={booking.id} className="rounded-xl bg-[#f2efff] px-3 py-2 text-sm">
                  <p className="font-medium text-ink">{booking.customerName}</p>
                  <p className="text-xs text-[#6b7280]">
                    {booking.bookingTime.slice(0, 5)} | {booking.staffName}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#6b7280]">No appointments scheduled for today.</p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
