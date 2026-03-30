import { TopBar } from "@/components/TopBar";
import { demo } from "@/lib/mockData";
import { money } from "@/lib/ui";

export default function TenantsPage() {
  const tenants = demo.units
    .filter((u) => u.tenantName)
    .map((u) => ({
      name: u.tenantName!,
      unit: u.label,
      rent: u.rent,
      status: u.status,
    }));

  return (
    <div className="grid gap-6">
      <TopBar title="Tenants" />

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Tenant list</div>
          <div className="mt-1 text-base font-extrabold">People + units</div>
        </div>

        <div className="divide-y divide-white/10">
          <div className="grid grid-cols-4 gap-3 px-5 py-3 text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
            <div>Name</div>
            <div>Unit</div>
            <div>Rent</div>
            <div>Status</div>
          </div>

          {tenants.map((t) => (
            <div key={t.name + t.unit} className="grid grid-cols-4 gap-3 px-5 py-3">
              <div className="font-semibold">{t.name}</div>
              <div className="text-white/75">{t.unit}</div>
              <div className="text-white/75">{money(t.rent)}</div>
              <div className="text-white/75">{t.status}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-white/65">
        Next: tenant profile pages with lease info, payment history, documents, and maintenance requests.
      </div>
    </div>
  );
}
