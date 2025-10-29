import Link from "next/link";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
    >
      {label}
    </Link>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-zinc-900" />
              <span className="text-base font-semibold tracking-tight">Zama ID</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <NavLink href="/dashboard" label="Dashboard" />
              <NavLink href="/attestations" label="Attestations" />
              <NavLink href="/requests" label="Requests" />
              <NavLink href="/verify" label="Verify" />
              <NavLink href="/profile" label="Profile" />
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href="/verify"
                className="inline-flex items-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Verify
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <footer className="border-t border-zinc-200 py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-sm text-zinc-500">
          © {new Date().getFullYear()} Zama ID
        </div>
      </footer>
    </div>
  );
}


