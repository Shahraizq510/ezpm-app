import Link from "next/link";

const nav = [
  { href: "/app/landlord/dashboard", label: "Dashboard" },
  { href: "/app/landlord/properties", label: "Properties" },
  { href: "/app/landlord/tenants", label: "Tenants" },
  { href: "/app/landlord/applications", label: "Applications" },
  { href: "/app/landlord/leases", label: "Leases" },
  { href: "/app/landlord/payments", label: "Payments" },
  { href: "/app/landlord/expenses", label: "Expenses" },
  { href: "/app/landlord/maintenance", label: "Maintenance" },
  { href: "/app/landlord/reports", label: "Reports" },
  { href: "/app/landlord/settings", label: "Settings" },
];

export function Sidebar({ activePath }: { activePath: string }) {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0">
      <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-4">
        <div className="flex items-center gap-3 px-2 pb-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-400 to-violet-600 text-slate-950 font-black grid place-items-center">
            EZ
          </div>
          <div className="leading-tight">
            <div className="font-extrabold">EZPM</div>
            <div className="text-xs text-white/60">Landlord Console</div>
          </div>
        </div>

        <nav className="grid gap-1">
          {nav.map((i) => {
            const active = activePath.startsWith(i.href);
            return (
              <Link
                key={i.href}
                href={i.href}
                className={
                  "rounded-xl px-3 py-2 text-sm transition " +
                  (active
                    ? "bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-white/10"
                    : "text-white/75 hover:text-white hover:bg-white/5")
                }
              >
                {i.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70">
            Demo mode • Mock data
          </div>
        </div>
      </div>
    </aside>
  );
}
