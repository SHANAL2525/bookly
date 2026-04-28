"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/shared/DashboardLayout";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import EmptyState from "@/components/ui/EmptyState";
import { ApiError, api } from "@/lib/api";
import { getSession } from "@/lib/session";
import { StaffItem } from "@/lib/types";
import { PlusIcon } from "@/components/ui/Icons";

export default function StaffPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [message, setMessage] = useState("Loading staff...");
  const [isOpen, setIsOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    availability: ""
  });

  async function loadStaff() {
    try {
      const data = await api.getStaff();
      setStaff(data);
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load staff.");
    }
  }

  useEffect(() => {
    if (!getSession()?.token) {
      router.replace("/login");
      return;
    }

    loadStaff();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    try {
      await api.createStaff(form);
      setForm({ name: "", role: "", email: "", phone: "", availability: "" });
      setMessage("Staff member created successfully.");
      setIsOpen(false);
      await loadStaff();
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(error.fieldErrors || {});
        setMessage(error.message);
      } else {
        setMessage(error instanceof Error ? error.message : "Could not create staff member.");
      }
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.deleteStaff(id);
      setMessage("Staff member deleted successfully.");
      await loadStaff();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete staff member.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Staff" description="Manage team members and assignments." />
        <Button onClick={() => { setFieldErrors({}); setIsOpen(true); }}>
          <PlusIcon className="h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <section className="rounded-[22px] border border-[#e5e0ff] bg-[#f6f4ff] p-4 shadow-[0_8px_18px_rgba(45,35,110,0.08)]">
        <Table
          headers={["Staff", "Role", "Availability", "Actions"]}
          rows={staff.map((member) => [
            member.name,
            member.role,
            member.availability,
            <div key={`actions-${member.id}`} className="flex flex-wrap gap-2">
              <button onClick={() => handleDelete(member.id)} className="rounded-lg bg-[#f9f0f0] px-3 py-1 text-xs font-semibold text-[#b45353]">
                Delete
              </button>
            </div>
          ])}
        />
      </section>

      {!staff.length && message ? (
        <div className="mt-4">
          <EmptyState title="No Staff Added Yet" description={message} actionLabel="Add Staff" onAction={() => setIsOpen(true)} />
        </div>
      ) : null}

      {message && staff.length > 0 ? <p className="mt-4 text-sm text-primary">{message}</p> : null}

      {isOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#1f203433] p-4 backdrop-blur-[1px]">
          <form onSubmit={handleSubmit} className="animate-scale-fade w-full max-w-lg rounded-[24px] bg-white p-6 shadow-[0_20px_40px_rgba(45,35,110,0.22)]">
            <h2 className="text-xl font-semibold text-ink">Add Staff</h2>
            <div className="mt-4 space-y-3">
              <div>
                <input className="w-full px-4 py-2.5 text-sm" placeholder="Name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                {fieldErrors.name ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.name}</p> : null}
              </div>
              <div>
                <input className="w-full px-4 py-2.5 text-sm" placeholder="Role" required value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} />
                {fieldErrors.role ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.role}</p> : null}
              </div>
              <div>
                <input className="w-full px-4 py-2.5 text-sm" placeholder="Email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                {fieldErrors.email ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.email}</p> : null}
              </div>
              <div>
                <input className="w-full px-4 py-2.5 text-sm" placeholder="Phone" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
                {fieldErrors.phone ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.phone}</p> : null}
              </div>
              <div>
                <input className="w-full px-4 py-2.5 text-sm" placeholder="Availability" required value={form.availability} onChange={(event) => setForm({ ...form, availability: event.target.value })} />
                {fieldErrors.availability ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.availability}</p> : null}
              </div>
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
