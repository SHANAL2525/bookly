type PageHeaderProps = {
  title: string;
  description: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6 rounded-2xl border border-line-soft bg-white/80 px-6 py-5 shadow-soft backdrop-blur-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">{title}</h1>
      <p className="mt-1.5 text-sm text-ink-soft">{description}</p>
    </div>
  );
}
