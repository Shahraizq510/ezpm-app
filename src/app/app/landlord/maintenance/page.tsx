import { TopBar } from "@/components/TopBar";

export default function MaintenancePage() {
  return (
    <div className="grid gap-6">
      <TopBar title="Maintenance" />
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
        <div className="text-base font-extrabold">Maintenance tickets (demo)</div>
        <div className="mt-2 text-sm text-white/65">
          Issue • Unit • Status • Priority. Simple ticket workflow.
        </div>
      </div>
    </div>
  );
}
