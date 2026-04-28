import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

const variantStyles = {
  primary:
    "bg-gradient-to-r from-[#6D5DF6] to-[#8B79FF] text-white shadow-soft hover:brightness-105 hover:scale-[1.03] active:translate-y-px",
  secondary:
    "bg-white text-[#4c46b8] shadow-soft hover:bg-surface-muted hover:scale-[1.03] active:translate-y-px",
  ghost: "bg-transparent text-primary shadow-none hover:bg-purple-50/75 hover:scale-[1.03]"
};

function classes(variant: ButtonProps["variant"] = "primary", fullWidth?: boolean) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-200/70",
    variantStyles[variant],
    "disabled:cursor-not-allowed disabled:opacity-60",
    fullWidth ? "w-full" : ""
  ].join(" ");
}

export default function Button({ children, href, variant = "primary", fullWidth, type = "button", onClick, disabled }: ButtonProps) {
  if (href) {
    return (
      <Link href={href} className={classes(variant, fullWidth)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes(variant, fullWidth)} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
