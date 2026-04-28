"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { sidebarItems } from "@/lib/data";
import { BookingIcon, DashboardIcon, ServicesIcon, SettingsIcon, StaffIcon } from "@/components/ui/Icons";

const sidebarIconMap = {
  Dashboard: DashboardIcon,
  Services: ServicesIcon,
  Staff: StaffIcon,
  Booking: BookingIcon,
  Settings: SettingsIcon
} as const;

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <aside className="animate-fade-in-up w-full rounded-[24px] border border-[#ffffff2a] bg-gradient-to-b from-[#5648d9] to-[#6f5ce0] p-4 text-white shadow-[0_16px_28px_rgba(20,16,70,0.35)] md:w-[250px]">
      <div className="mb-3 rounded-xl bg-white/10 p-3 md:mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-purple-100">Bookly</p>
            <h2 className="mt-1 text-lg font-semibold">Dashboard</h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <nav className={`${open ? "block" : "hidden"} space-y-1 md:block`}>
        {sidebarItems.map((item) => {
          const active = pathname === item.href;
          const Icon = sidebarIconMap[item.label as keyof typeof sidebarIconMap] || DashboardIcon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition duration-200 ${
                active
                  ? "bg-[#cbc3ff] text-[#3d349d] shadow-[0_6px_14px_rgba(140,125,255,0.35)]"
                  : "text-purple-50 hover:bg-white/15 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
