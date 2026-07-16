import { type InputHTMLAttributes } from "react";

interface Props
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Checkbox({
  label,
  ...props
}: Props) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        className="h-4 w-4 accent-[var(--accent)]"
        {...props}
      />

      <span className="text-sm text-ink">
        {label}
      </span>
    </label>
  );
}
