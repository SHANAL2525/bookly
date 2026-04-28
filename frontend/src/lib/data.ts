export type NavItem = {
  label: string;
  href: string;
};

export const sidebarItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Services", href: "/services" },
  { label: "Staff", href: "/staff" },
  { label: "Booking", href: "/booking" },
  { label: "Settings", href: "/settings" }
];
