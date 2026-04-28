import Button from "./Button";

type ModalProps = {
  title: string;
  description: string;
};

export default function Modal({ title, description }: ModalProps) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-soft">
      <div className="mb-4">
        <p className="text-lg font-semibold text-ink">{title}</p>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary">Cancel</Button>
        <Button>Confirm</Button>
      </div>
    </div>
  );
}
