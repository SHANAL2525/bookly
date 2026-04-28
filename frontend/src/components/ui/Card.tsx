type CardProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function Card({ title, subtitle, children }: CardProps) {
  return (
    <div className="card-hover-lift animate-fade-in-up rounded-[24px] bg-[#ffffff] p-5 shadow-[0_10px_24px_rgba(45,35,110,0.08)]">
      <div className="mb-3 space-y-1">
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        {subtitle ? <p className="text-sm text-ink-soft">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}
