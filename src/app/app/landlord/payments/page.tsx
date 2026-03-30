import { TopBar } from "@/components/TopBar";

export default function PaymentsPage() {
  return (
    <div className="grid gap-6">
      <TopBar title="Payments" />
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
        <div className="text-base font-extrabold">Payments & Ledger (demo)</div>
        <div className="mt-2 text-sm text-white/65">
          Monthly collection chart • paid vs due • transaction ledger • export for taxes.
        </div>
      </div>
    </div>
  );
}
