import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { LayoutDashboard, ShieldCheck, Inbox, Search, User, Search as SearchIcon, Building2, Users, FileCheck, PlusCircle } from "lucide-react";
import WalletButton from "./WalletButton";

type AppLayoutProps = {
  children: ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/attestations", label: "Attestations", icon: ShieldCheck },
  { href: "/app/requests", label: "Requests", icon: Inbox },
  { href: "/app/verify", label: "Verify", icon: Search },
  { href: "/app/profile", label: "Profile", icon: User },
];

const companyNavItems: NavItem[] = [
  { href: "/app/company", label: "Company", icon: Building2 },
  { href: "/app/company/issue", label: "Issue Attestation", icon: PlusCircle },
  { href: "/app/company/issued", label: "Issued Attestations", icon: FileCheck },
  { href: "/app/company/whitelist", label: "Whitelist", icon: Users },
];

function NavLink({ href, label, icon: Icon, isActive }: NavItem & { isActive: boolean }) {
  return (
    <Link
      href={href}
      className={
        "flex items-center gap-4 rounded-lg px-4 py-3 text-base font-medium transition-colors " +
        (isActive
          ? "bg-zinc-100 text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900")
      }
    >
      <Icon className="h-5 w-5" />
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
            <div className="hidden md:flex relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search attestations, requests..."
                className="w-[28rem] rounded-full border border-zinc-200 bg-white pl-11 pr-5 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-400 focus:outline-none"
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
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-72 border-r border-zinc-200 bg-white overflow-y-auto">
          <nav className="p-6 space-y-3">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                isActive={router.pathname === item.href || (item.href !== "/app" && router.pathname.startsWith(item.href + "/"))}
              />
            ))}
            <div className="pt-6 mt-6 border-t border-zinc-200">
              <div className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Organization</div>
              {companyNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  isActive={
                    router.pathname === item.href || 
                    (item.href !== "/app/company" && item.href !== "/app" && router.pathname.startsWith(item.href + "/"))
                  }
                />
              ))}
            </div>
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

