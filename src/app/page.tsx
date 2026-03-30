import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70">
        EZPM App • demo build
      </div>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
        Welcome — choose a demo.
      </h1>
      <p className="mt-3 text-white/70 leading-relaxed">
        This repo contains the landlord “mission control” demo UI (mock data). Backend wiring comes later.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/app/landlord/dashboard"
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/15 to-violet-500/15 p-5 hover:from-blue-500/20 hover:to-violet-500/20"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-white/55 font-semibold">Landlord</div>
          <div className="mt-1 text-xl font-extrabold">Open Landlord Dashboard</div>
          <div className="mt-2 text-sm text-white/70">
            KPIs • Units & Status • Activity • Quick Actions
          </div>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-white/55 font-semibold">Tenant</div>
          <div className="mt-1 text-xl font-extrabold">Tenant app</div>
          <div className="mt-2 text-sm text-white/70">
            Coming next (demo flow for payments + lease info).
          </div>
        </div>
      </div>

      <div className="mt-10 text-sm text-white/60">
        Tip: for the pitch, go straight to{" "}
        <span className="font-semibold text-white/80">/app/landlord/dashboard</span>.
      </div>
    </div>
  );
}
