"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ApiError, api } from "@/lib/api";
import { saveSession } from "@/lib/session";
import Navbar from "@/components/layout/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    businessName: "",
    password: ""
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setFieldErrors({});

    try {
      const response = await api.register({
        ...form,
        role: "BUSINESS_OWNER"
      });

      saveSession({
        token: response.token,
        userId: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
        businessId: response.businessId
      });

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(error.fieldErrors || {});
        setMessage(error.message);
      } else {
        setMessage(error instanceof Error ? error.message : "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 pb-7 md:px-6 md:pb-8">
      <Navbar />
      <main className="mx-auto mt-2 flex w-full max-w-6xl items-center justify-center">
        <section className="animate-fade-in-up w-full rounded-3xl border border-white/45 bg-[#f7f4ff] p-3.5 shadow-[0_20px_42px_rgba(40,25,130,0.18)] md:p-5 lg:p-6">
          <div className="grid items-stretch gap-4 md:grid-cols-2 md:gap-5">
            <form onSubmit={handleSubmit} autoComplete="off" className="flex h-full flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-soft md:p-7">
              <p className="text-sm font-semibold text-[#1f2937]">Bookly</p>
              <h1 className="mt-1.5 text-3xl font-bold leading-tight text-[#111827] md:text-[34px]">Create Account</h1>
              <p className="mt-1.5 text-sm text-[#64748b]">Register your business account</p>
              <div className="mt-5 flex w-full flex-col items-center space-y-3.5">
                <input
                  type="text"
                  name="bookly-fake-username"
                  autoComplete="username"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="hidden"
                />
                <input
                  type="password"
                  name="bookly-fake-password"
                  autoComplete="current-password"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="hidden"
                />
                <div className="w-[340px] max-w-full">
                  <input
                    className="w-full rounded-xl border border-[#dfd9ff] bg-[#f6f3ff] px-4 py-2.5 text-sm"
                    placeholder="Business Name"
                    name="bookly-business-name"
                    autoComplete="off"
                    required
                    value={form.businessName}
                    onChange={(event) => updateField("businessName", event.target.value)}
                  />
                  {fieldErrors.businessName ? <p className="mt-1 text-left text-xs text-[#b42318]">{fieldErrors.businessName}</p> : null}
                </div>
                <div className="w-[340px] max-w-full">
                  <input
                    className="w-full rounded-xl border border-[#dfd9ff] bg-[#f6f3ff] px-4 py-2.5 text-sm"
                    placeholder="Owner Name"
                    name="bookly-owner-name"
                    autoComplete="off"
                    required
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                  />
                  {fieldErrors.name ? <p className="mt-1 text-left text-xs text-[#b42318]">{fieldErrors.name}</p> : null}
                </div>
                <div className="w-[340px] max-w-full">
                  <input
                    className="w-full rounded-xl border border-[#dfd9ff] bg-[#f6f3ff] px-4 py-2.5 text-sm"
                    placeholder="Email"
                    type="email"
                    name="bookly-register-email"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                  />
                  {fieldErrors.email ? <p className="mt-1 text-left text-xs text-[#b42318]">{fieldErrors.email}</p> : null}
                </div>
                <div className="w-[340px] max-w-full">
                  <input
                    className="w-full rounded-xl border border-[#dfd9ff] bg-[#f6f3ff] px-4 py-2.5 text-sm"
                    placeholder="Password"
                    type="password"
                    name="bookly-register-password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                  />
                  {fieldErrors.password ? <p className="mt-1 text-left text-xs text-[#b42318]">{fieldErrors.password}</p> : null}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-[340px] max-w-full rounded-xl bg-gradient-to-r from-[#6D5DF6] to-[#7E6CFF] px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:scale-[1.03] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
              {message && !Object.keys(fieldErrors).length ? <p className="mt-4 w-[340px] max-w-full text-center text-sm text-[#b42318]">{message}</p> : null}
            </form>
            <div className="rounded-2xl bg-[#ede7ff] p-2.5 md:p-3">
              <Image src="/login-preview.png" alt="Bookly register preview" width={760} height={620} priority className="h-full max-h-[430px] w-full rounded-xl object-cover md:max-h-[470px]" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
