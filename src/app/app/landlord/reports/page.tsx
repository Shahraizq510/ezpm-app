import { TopBar } from "@/components/TopBar";

export default function ReportsPage() {
  return (
    <div className="grid gap-6">
      <TopBar title="Reports" />
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
        <div className="text-base font-extrabold">Reports (demo)</div>
        <div className="mt-2 text-sm text-white/65">Monthly income • expenses • net cash flow.</div>
      </div>
    </div>
  );
}
