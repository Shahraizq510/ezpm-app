import { TopBar } from "@/components/TopBar";

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <TopBar title="Settings" />
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
        <div className="text-base font-extrabold">Settings (demo)</div>
        <div className="mt-2 text-sm text-white/65">
          Properties config • payment setup (Stripe) • notifications.
        </div>
      </div>
    </div>
  );
}
