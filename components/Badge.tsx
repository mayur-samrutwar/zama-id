type BadgeProps = {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
};

const toneStyles: Record<string, string> = {
  neutral: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  success: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-100 text-amber-800 ring-amber-200",
  danger: "bg-red-100 text-red-700 ring-red-200",
};

export default function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span className={"inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 " + toneStyles[tone]}>
      {children}
    </span>
  );
}


