"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ApiError, api } from "@/lib/api";
import { saveSession } from "@/lib/session";
import Navbar from "@/components/layout/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setFieldErrors({});

    try {
      const response = await api.login(email, password);
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
        setMessage(error instanceof Error ? error.message : "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#6D5DF6] to-[#C7B8FF] px-4 pb-7 md:px-6 md:pb-8">
      <Navbar />

      <main className="mx-auto mt-2 flex w-full max-w-6xl items-center justify-center">
        <section className="animate-fade-in-up w-full rounded-3xl border border-white/45 bg-[#f7f4ff] p-3.5 shadow-[0_20px_42px_rgba(40,25,130,0.18)] md:p-5 lg:p-6">
          <div className="grid items-stretch gap-4 md:grid-cols-2 md:gap-5">
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="flex h-full flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-soft md:p-7"
            >
              <p className="text-sm font-semibold text-[#1f2937]">Bookly</p>
              <h1 className="mt-1.5 text-3xl font-bold leading-tight text-[#111827] md:text-[34px]">Welcome Back</h1>
              <p className="mt-1.5 text-sm text-[#64748b]">Log in to your account</p>

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
                <input
                  className="w-[340px] max-w-full rounded-xl border border-[#dfd9ff] bg-[#f6f3ff] px-4 py-2.5 text-sm"
                  placeholder="Email"
                  type="email"
                  name="bookly-login-email"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFieldErrors((current) => {
                      if (!current.email) {
                        return current;
                      }
                      const next = { ...current };
                      delete next.email;
                      return next;
                    });
                  }}
                />
                {fieldErrors.email ? <p className="w-[340px] max-w-full text-left text-xs text-[#b42318]">{fieldErrors.email}</p> : null}
                <input
                  className="w-[340px] max-w-full rounded-xl border border-[#dfd9ff] bg-[#f6f3ff] px-4 py-2.5 text-sm"
                  placeholder="Password"
                  type="password"
                  name="bookly-login-password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFieldErrors((current) => {
                      if (!current.password) {
                        return current;
                      }
                      const next = { ...current };
                      delete next.password;
                      return next;
                    });
                  }}
                />
                {fieldErrors.password ? <p className="w-[340px] max-w-full text-left text-xs text-[#b42318]">{fieldErrors.password}</p> : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-[340px] max-w-full rounded-xl bg-gradient-to-r from-[#6D5DF6] to-[#7E6CFF] px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:scale-[1.03] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>

              {message && !Object.keys(fieldErrors).length ? <p className="mt-4 w-[340px] max-w-full text-center text-sm text-[#b42318]">{message}</p> : null}
            </form>

            <div className="rounded-2xl bg-[#ede7ff] p-2.5 md:p-3">
              <Image
                src="/login-preview.png"
                alt="Bookly login preview"
                width={760}
                height={620}
                priority
                className="h-full max-h-[430px] w-full rounded-xl object-cover md:max-h-[470px]"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
