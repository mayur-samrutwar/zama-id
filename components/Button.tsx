import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "success" | "neutral";
  size?: "sm" | "md" | "lg";
};

const variants: Record<string, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200/70",
  neutral: "bg-zinc-50 text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100",
  outline: "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-50",
  ghost: "text-zinc-900 hover:bg-zinc-100",
};

const sizes: Record<string, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export default function Button({ className, variant = "primary", size = "md", disabled, ...props }: ButtonProps) {
  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed " +
        variants[variant] +
        " " +
        sizes[size] +
        (className ? " " + className : "")
      }
      disabled={disabled}
      {...props}
    />
  );
}


