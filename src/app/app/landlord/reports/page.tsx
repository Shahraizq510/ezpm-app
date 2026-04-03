import { TopBar } from "@/components/TopBar";
import { demo } from "@/lib/mockData";
import { money } from "@/lib/ui";

export default function ReportsPage() {
  const pnl = demo.getPnL();

  return (
    <div className="grid gap-6">
      <TopBar title="Reports" />

      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
              Profit & Loss Report
            </div>
            <div className="mt-1 text-base font-extrabold">Portfolio Performance</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-white/60">
            All Time
          </div>
        </div>
      </div>

      {/* Per-property breakdown */}
      <div className="grid gap-4">
        {pnl.perProperty.map((p) => (
          <div
            key={p.propertyId}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
          >
            <div className="px-5 py-4 border-b border-white/10">
              <div className="font-extrabold text-base">{p.propertyName}</div>
            </div>
            <div className="p-5 grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Revenue */}
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
                    Revenue
                  </div>
                  <div className="mt-1 text-xl font-extrabold text-green-400">
                    {money(p.totalRevenue)}
                  </div>
                </div>

                {/* Expenses */}
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
                    Expenses
                  </div>
                  <div className="mt-1 text-xl font-extrabold text-red-400">
                    {money(p.totalExpenses)}
                  </div>
                </div>

                {/* Net Income */}
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
                    Net Income
                  </div>
                  <div
                    className={`mt-1 text-xl font-extrabold ${
                      p.netIncome >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {money(p.netIncome)}
                  </div>
                </div>
              </div>

              {/* Margin bar */}
              {p.totalRevenue > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                    <span>Expense Ratio</span>
                    <span>
                      {Math.round((p.totalExpenses / p.totalRevenue) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                      style={{
                        width: `${Math.min(100, Math.round((p.totalExpenses / p.totalRevenue) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Totals */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-violet-500/10 backdrop-blur">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
            Portfolio Totals
          </div>
          <div className="mt-1 text-base font-extrabold">All Properties Combined</div>
        </div>
        <div className="p-5 grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
              Total Revenue
            </div>
            <div className="mt-1 text-2xl font-extrabold text-green-400">
              {money(pnl.totals.totalRevenue)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
              Total Expenses
            </div>
            <div className="mt-1 text-2xl font-extrabold text-red-400">
              {money(pnl.totals.totalExpenses)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
              Net Income
            </div>
            <div
              className={`mt-1 text-2xl font-extrabold ${
                pnl.totals.netIncome >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {money(pnl.totals.netIncome)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
