"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/shared/DashboardLayout";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { api } from "@/lib/api";
import { getSession } from "@/lib/session";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: ""
  });
  const [form, setForm] = useState({
    businessHours: "",
    bookingBufferMinutes: "10",
    cancellationPolicy: "",
    allowOnlinePayments: false
  });
  const [message, setMessage] = useState("Loading settings...");

  useEffect(() => {
    if (!getSession()?.token) {
      router.replace("/login");
      return;
    }

    Promise.all([api.getBusinessProfile(), api.getSettings()])
      .then(([business, settings]) => {
        setProfile({
          name: business.name || "",
          email: business.email || "",
          phone: business.phone || "",
          address: business.address || "",
          description: business.description || ""
        });
        setForm({
          businessHours: settings.businessHours || "",
          bookingBufferMinutes: String(settings.bookingBufferMinutes || 10),
          cancellationPolicy: settings.cancellationPolicy || "",
          allowOnlinePayments: Boolean(settings.allowOnlinePayments)
        });
        setMessage("");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Could not load settings.");
      });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await Promise.all([
        api.updateBusinessProfile(profile),
        api.updateSettings({
          businessHours: form.businessHours,
          bookingBufferMinutes: Number(form.bookingBufferMinutes),
          cancellationPolicy: form.cancellationPolicy,
          allowOnlinePayments: form.allowOnlinePayments
        })
      ]);
      setMessage("Settings saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save settings.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <PageHeader title="Settings" description="Profile and business preferences." />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <section className="animate-fade-in-up rounded-[22px] border border-[#e5e0ff] bg-[#f6f4ff] p-4 shadow-[0_8px_18px_rgba(45,35,110,0.08)]">
          <Card title="Profile Info" subtitle="Business profile">
            <div className="grid gap-3 md:grid-cols-2">
              <input className="w-full px-4 py-2.5 text-sm" placeholder="Business Name" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
              <input className="w-full px-4 py-2.5 text-sm" placeholder="Business Email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} />
              <input className="w-full px-4 py-2.5 text-sm" placeholder="Phone" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} />
              <input className="w-full px-4 py-2.5 text-sm" placeholder="Address" value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} />
              <textarea className="w-full rounded-xl px-4 py-2.5 text-sm md:col-span-2" placeholder="Business description" value={profile.description} onChange={(event) => setProfile({ ...profile, description: event.target.value })} />
            </div>
          </Card>
        </section>

        <section className="animate-fade-in-up rounded-[22px] border border-[#e5e0ff] bg-[#f6f4ff] p-4 shadow-[0_8px_18px_rgba(45,35,110,0.08)]">
          <Card title="Business Info" subtitle="General business settings">
            <div className="grid gap-3 md:grid-cols-2">
              <input className="w-full px-4 py-2.5 text-sm" placeholder="Business hours" value={form.businessHours} onChange={(event) => setForm({ ...form, businessHours: event.target.value })} />
              <input className="w-full px-4 py-2.5 text-sm" placeholder="Booking buffer (minutes)" value={form.bookingBufferMinutes} onChange={(event) => setForm({ ...form, bookingBufferMinutes: event.target.value })} />
              <input className="w-full px-4 py-2.5 text-sm md:col-span-2" placeholder="Cancellation policy" value={form.cancellationPolicy} onChange={(event) => setForm({ ...form, cancellationPolicy: event.target.value })} />
            </div>
            <label className="mt-3 flex items-center gap-3 text-sm text-[#6b7280]">
              <input type="checkbox" checked={form.allowOnlinePayments} onChange={(event) => setForm({ ...form, allowOnlinePayments: event.target.checked })} />
              Allow online payments
            </label>
          </Card>
        </section>

        <Button type="submit">Save</Button>
      </form>

      {message ? <p className="mt-4 text-sm text-primary">{message}</p> : null}
    </DashboardLayout>
  );
}
