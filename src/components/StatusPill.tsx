import type { UnitStatus } from "@/lib/mockData";

export function StatusPill({ status }: { status: UnitStatus }) {
  const cls =
    status === "Paid"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
      : status === "Due"
        ? "border-amber-300/20 bg-amber-300/10 text-amber-200"
        : status === "Vacant"
          ? "border-sky-300/20 bg-sky-300/10 text-sky-200"
          : "border-rose-400/20 bg-rose-400/10 text-rose-200";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${cls}`}>
      {status}
    </span>
  );
}
