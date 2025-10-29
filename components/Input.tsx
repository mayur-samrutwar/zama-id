import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export default function Input({ label, hint, className, ...props }: InputProps) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-medium text-zinc-800">{label}</div> : null}
      <input
        className={
          "block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none ring-0 focus:border-zinc-400 " +
          (className ?? "")
        }
        {...props}
      />
      {hint ? <div className="mt-1 text-xs text-zinc-500">{hint}</div> : null}
    </label>
  );
}


