import { TopBar } from "@/components/TopBar";

export default function LeasesPage() {
  return (
    <div className="grid gap-6">
      <TopBar title="Leases" />
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
        <div className="text-base font-extrabold">Lease hub (demo)</div>
        <div className="mt-2 text-sm text-white/65">
          Active leases • expiring soon • create new lease (template-based).
        </div>
      </div>
    </div>
  );
}
