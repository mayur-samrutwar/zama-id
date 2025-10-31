import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import WalletButton from "./WalletButton";

type AppLayoutProps = {
  children: ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: "⧉" },
  { href: "/app/attestations", label: "Mine", icon: "○" },
  { href: "/app/requests", label: "Incoming", icon: "○" },
  { href: "/app/verify", label: "Verify", icon: "○" },
  { href: "/app/profile", label: "Settings", icon: "○" },
];

function NavLink({ href, label, icon, isActive }: NavItem & { isActive: boolean }) {
  return (
    <Link
      href={href}
      className={
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors " +
        (isActive
          ? "bg-zinc-100 text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900")
      }
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/app" className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight text-zinc-900">Zama ID</span>
            </Link>
            <div className="hidden md:flex">
              <input
                type="text"
                placeholder="Search attestations, requests..."
                className="w-[28rem] rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <WalletButton />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r border-zinc-200 bg-white overflow-y-auto">
          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                isActive={router.pathname === item.href || (item.href !== "/app" && router.pathname.startsWith(item.href))}
              />
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white">
          <div className="mx-auto max-w-7xl px-8 py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

