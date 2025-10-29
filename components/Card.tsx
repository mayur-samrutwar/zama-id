import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={
        "rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-100/60 ring-1 ring-transparent transition-shadow " +
        (className ?? "")
      }
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={"p-5 sm:p-7 " + (className ?? "")}>{children}</div>;
}

export function CardHeader({ title, description, right }: { title: string; description?: string; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-5 sm:p-7">
      <div>
        <h3 className="text-base font-semibold tracking-tight text-zinc-900">{title}</h3>
        {description ? <p className="mt-1 text-sm text-zinc-600">{description}</p> : null}
      </div>
      {right}
    </div>
  );
}


