import { TopBar } from "@/components/TopBar";
import { demo } from "@/lib/mockData";
import { money, pct } from "@/lib/ui";

export default function PropertiesPage() {
  return (
    <div className="grid gap-6">
      <TopBar title="Properties" />

      <div className="grid gap-3 md:grid-cols-2">
        {demo.properties.map((p) => (
          <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg font-extrabold truncate">{p.name}</div>
                <div className="mt-1 text-sm text-white/65">{p.address}</div>
              </div>
              <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-white/75">
                {pct(p.occupancyPct)} occupied
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Units</div>
                <div className="mt-1 text-base font-extrabold">{p.units}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Total rent</div>
                <div className="mt-1 text-base font-extrabold">{money(p.totalRent)}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Status</div>
                <div className="mt-1 text-base font-extrabold">Healthy</div>
              </div>
            </div>

            <div className="mt-4 text-sm text-white/65">
              Click-through details coming next (units list, tenants, payments).
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
