import Button from "./Button";
import { InboxIcon } from "./Icons";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="animate-fade-in-up rounded-[22px] bg-white p-6 text-center shadow-[0_10px_24px_rgba(45,35,110,0.1)]">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#efeaff] text-[#5d51ea]">
        <InboxIcon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-[#6b7280]">{description}</p>
      {actionLabel && onAction ? (
        <div className="mt-4 flex justify-center">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  );
}
