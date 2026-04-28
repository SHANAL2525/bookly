type IconProps = {
  className?: string;
};

function wrap(path: React.ReactNode, className?: string) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className || "h-4 w-4"}>
      {path}
    </svg>
  );
}

export function DashboardIcon({ className }: IconProps) {
  return wrap(
    <>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="5" rx="2" />
      <rect x="13" y="10" width="8" height="11" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
    </>,
    className
  );
}

export function ServicesIcon({ className }: IconProps) {
  return wrap(
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </>,
    className
  );
}

export function StaffIcon({ className }: IconProps) {
  return wrap(
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M4 19c0-3 2.2-5 5-5s5 2 5 5" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M14.5 19c.2-2 1.6-3.6 3.5-4" />
    </>,
    className
  );
}

export function BookingIcon({ className }: IconProps) {
  return wrap(
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>,
    className
  );
}

export function SettingsIcon({ className }: IconProps) {
  return wrap(
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.5 1.5 0 0 1-2.1 2.1l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V19a1.5 1.5 0 0 1-3 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.5 1.5 0 0 1-2.1-2.1l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H5a1.5 1.5 0 0 1 0-3h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.5 1.5 0 1 1 2.1-2.1l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V5a1.5 1.5 0 0 1 3 0v.2a1 1 0 0 0 .6.9h.1a1 1 0 0 0 1.1-.2l.1-.1a1.5 1.5 0 1 1 2.1 2.1l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6H19a1.5 1.5 0 0 1 0 3h-.2a1 1 0 0 0-.9.6z" />
    </>,
    className
  );
}

export function PlusIcon({ className }: IconProps) {
  return wrap(
    <>
      <path d="M12 5v14M5 12h14" />
    </>,
    className
  );
}

export function InboxIcon({ className }: IconProps) {
  return wrap(
    <>
      <path d="M4 4h16v12H4z" />
      <path d="M4 14h4l2 3h4l2-3h4" />
    </>,
    className
  );
}
