"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/shared/DashboardLayout";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import EmptyState from "@/components/ui/EmptyState";
import { ApiError, api } from "@/lib/api";
import { formatLkr } from "@/lib/currency";
import { getSession } from "@/lib/session";
import { ServiceItem } from "@/lib/types";
import { PlusIcon } from "@/components/ui/Icons";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [message, setMessage] = useState("Loading services...");
  const [isOpen, setIsOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: ""
  });

  async function loadServices() {
    try {
      const data = await api.getServices();
      setServices(data);
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load services.");
    }
  }

  useEffect(() => {
    if (!getSession()?.token) {
      router.replace("/login");
      return;
    }

    loadServices();
  }, [router]);

  function resetForm() {
    setForm({ name: "", description: "", price: "", durationMinutes: "" });
    setEditingId(null);
    setFieldErrors({});
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        durationMinutes: Number(form.durationMinutes)
      };

      if (editingId) {
        await api.updateService(editingId, payload);
        setMessage("Service updated successfully.");
      } else {
        await api.createService(payload);
        setMessage("Service created successfully.");
      }

      resetForm();
      setIsOpen(false);
      await loadServices();
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(error.fieldErrors || {});
        setMessage(error.message);
      } else {
        setMessage(error instanceof Error ? error.message : "Could not save service.");
      }
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.deleteService(id);
      setMessage("Service deleted successfully.");
      await loadServices();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete service.");
    }
  }

  function openEdit(service: ServiceItem) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description,
      price: String(service.price),
      durationMinutes: String(service.durationMinutes)
    });
    setIsOpen(true);
  }

  return (
    <DashboardLayout>
      <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Services" description="Manage your service catalog." />
        <Button onClick={() => { resetForm(); setIsOpen(true); }}>
          <PlusIcon className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      <section className="rounded-[22px] border border-[#e5e0ff] bg-[#f6f4ff] p-4 shadow-[0_8px_18px_rgba(45,35,110,0.08)]">
        <Table
          headers={["Service", "Duration", "Price", "Actions"]}
          rows={services.map((service) => [
            service.name,
            `${service.durationMinutes} min`,
            formatLkr(service.price),
            <div key={`actions-${service.id}`} className="flex flex-wrap gap-2">
              <button onClick={() => openEdit(service)} className="rounded-lg bg-[#f2efff] px-3 py-1 text-xs font-semibold text-[#5d51ea]">
                Edit
              </button>
              <button onClick={() => handleDelete(service.id)} className="rounded-lg bg-[#f9f0f0] px-3 py-1 text-xs font-semibold text-[#b45353]">
                Delete
              </button>
            </div>
          ])}
        />
      </section>

      {!services.length && message ? (
        <div className="mt-4">
          <EmptyState title="No Services Yet" description={message} actionLabel="Add Service" onAction={() => { resetForm(); setIsOpen(true); }} />
        </div>
      ) : null}

      {message && services.length > 0 ? <p className="mt-4 text-sm text-primary">{message}</p> : null}

      {isOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#1f203433] p-4 backdrop-blur-[1px]">
          <form onSubmit={handleSubmit} className="animate-scale-fade w-full max-w-lg rounded-[24px] bg-white p-6 shadow-[0_20px_40px_rgba(45,35,110,0.22)]">
            <h2 className="text-xl font-semibold text-ink">{editingId ? "Edit Service" : "Add Service"}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <input className="w-full px-4 py-2.5 text-sm" placeholder="Service Name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                {fieldErrors.name ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.name}</p> : null}
              </div>
              <div>
                <input className="w-full px-4 py-2.5 text-sm" placeholder="Duration in minutes" required value={form.durationMinutes} onChange={(event) => setForm({ ...form, durationMinutes: event.target.value })} />
                {fieldErrors.durationMinutes ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.durationMinutes}</p> : null}
              </div>
              <div>
                <input className="w-full px-4 py-2.5 text-sm" placeholder="Price (LKR)" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
                {fieldErrors.price ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.price}</p> : null}
              </div>
              <div>
                <textarea className="w-full rounded-xl px-4 py-2.5 text-sm" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                {fieldErrors.description ? <p className="mt-1 text-xs text-[#b42318]">{fieldErrors.description}</p> : null}
              </div>
            </div>
            {message && !Object.keys(fieldErrors).length ? <p className="mt-3 text-sm text-[#b42318]">{message}</p> : null}
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { setIsOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit">{editingId ? "Update" : "Save"}</Button>
            </div>
          </form>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
