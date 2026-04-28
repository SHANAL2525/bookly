"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, getSession } from "@/lib/session";

type NavbarProps = {
  showAuthActions?: boolean;
};

export default function Navbar({ showAuthActions = true }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    setUsername(session?.name || null);
  }, [pathname]);

  function handleLogout() {
    clearSession();
    setUsername(null);
    router.push("/login");
  }

  return (
    <header className="mx-auto w-full max-w-7xl px-4 pt-4 md:px-6">
      <div className="animate-fade-in-up flex h-14 items-center justify-between rounded-[20px] border border-[#ece9ff] bg-white px-3 shadow-[0_8px_20px_rgba(45,35,110,0.08)] md:px-6">
        <Link href="/" className="text-lg font-semibold text-[#1f2937]">
          Bookly
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[#4b5563] md:flex">
          <Link className="transition hover:text-primary" href="/#features">
            Features
          </Link>
          <Link className="transition hover:text-primary" href="/#pricing">
            Pricing
          </Link>
          <Link className="transition hover:text-primary" href="/#contact">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {!showAuthActions ? null : username ? (
            <>
              <span className="rounded-lg bg-[#f3f0ff] px-2.5 py-1.5 text-xs font-semibold text-[#4c46b8] md:px-3 md:text-sm">{username}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-purple-50 md:px-3 md:text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-purple-50 md:px-3 md:text-sm" href="/login">
                Login
              </Link>
              <Link
                className="rounded-xl bg-gradient-to-r from-[#6D5DF6] to-[#8B79FF] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-95 md:px-4 md:py-2 md:text-sm"
                href="/register"
              >
                Register Business
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
