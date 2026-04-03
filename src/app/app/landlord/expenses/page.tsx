import { TopBar } from "@/components/TopBar";
import { demo } from "@/lib/mockData";
import { money } from "@/lib/ui";

const categoryColors: Record<string, string> = {
  Mortgage: "bg-blue-500/20 text-blue-300",
  Insurance: "bg-purple-500/20 text-purple-300",
  Repairs: "bg-orange-500/20 text-orange-300",
  Utilities: "bg-cyan-500/20 text-cyan-300",
  "Property Tax": "bg-red-500/20 text-red-300",
  HOA: "bg-pink-500/20 text-pink-300",
  Management: "bg-green-500/20 text-green-300",
  Other: "bg-white/10 text-white/70",
};

export default function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string }>;
}) {
  // Next.js 16 makes searchParams a promise but we can still access synchronously in server components
  // by wrapping — but for simplicity, let's just use a default approach
  return <ExpensesContent />;
}

function ExpensesContent() {
  const allExpenses = demo.getExpenses();
  const properties = demo.properties;

  // Show all by default (no client-side filter needed — server rendered with all)
  const expenses = allExpenses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="grid gap-6">
      <TopBar title="Expenses" />

      {/* Summary + Add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4">
          <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
            Total Expenses
          </div>
          <div className="mt-1 text-2xl font-extrabold">{money(totalExpenses)}</div>
          <div className="text-xs text-white/50 mt-1">
            {expenses.length} transactions • All properties
          </div>
        </div>

        <button className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/15 to-violet-500/15 px-5 py-3 font-extrabold text-sm hover:from-blue-500/25 hover:to-violet-500/25 transition">
          + Add Expense
        </button>
      </div>

      {/* Property filter pills */}
      <div className="flex gap-2 flex-wrap">
        <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-1.5 text-sm font-semibold">
          All Properties
        </div>
        {properties.map((p) => (
          <div
            key={p.id}
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            {p.name}
          </div>
        ))}
      </div>

      {/* Expense cards */}
      <div className="grid gap-2">
        {expenses.map((e) => {
          const prop = properties.find((p) => p.id === e.propertyId);
          return (
            <div
              key={e.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`shrink-0 rounded-lg px-2 py-1 text-xs font-semibold ${
                    categoryColors[e.category] ?? categoryColors.Other
                  }`}
                >
                  {e.category}
                </span>
                <div className="min-w-0">
                  <div className="font-bold truncate">
                    {e.description}
                    {e.receiptUrl && (
                      <span className="ml-2 text-white/40" title="Receipt attached">
                        📎
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-white/50">
                    {prop?.name} • {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {e.recurring && (
                      <span className="ml-2 text-blue-400/70">↻ Recurring</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-extrabold">{money(e.amount)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
