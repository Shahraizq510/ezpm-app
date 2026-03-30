export function KpiCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
        {label}
      </div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight">{value}</div>
      {note ? <div className="mt-2 text-sm text-white/65">{note}</div> : null}
    </div>
  );
}
