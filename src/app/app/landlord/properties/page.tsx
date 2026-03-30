import { TopBar } from "@/components/TopBar";
import { demo } from "@/lib/mockData";

export default function PropertiesPage() {
  const unitCards = demo.getUnitCards();

  const byProperty = (propertyId: string) =>
    unitCards.filter((u) => demo.units.find((x) => x.id === u.unitId)?.propertyId === propertyId);

  return (
    <div className="grid gap-6">
      <TopBar title="Properties" />

      <div className="grid gap-3 md:grid-cols-2">
        {demo.properties.map((p) => {
          const units = byProperty(p.id);
          const occupied = units.filter((u) => u.status !== "Vacant").length;
          const total = Math.max(1, units.length);
          const occupancyPct = occupied / total;

          return (
            <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg font-extrabold truncate">{p.name}</div>
                  <div className="mt-1 text-sm text-white/65">{p.address}</div>
                </div>
                <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-white/75">
                  {Math.round(occupancyPct * 100)}% occupied
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                {units.length ? (
                  units.map((u) => (
                    <div
                      key={u.unitId}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                    >
                      <div>
                        <div className="font-bold">Unit {u.label}</div>
                        <div className="text-sm text-white/60">{u.note}</div>
                      </div>
                      <div className="text-sm text-white/70">{u.status}</div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                    No units added yet.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
