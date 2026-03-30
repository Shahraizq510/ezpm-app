import { TopBar } from "@/components/TopBar";

export default function ApplicationsPage() {
  return (
    <div className="grid gap-6">
      <TopBar title="Applications" />

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
        <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Edge feature</div>
        <div className="mt-1 text-base font-extrabold">Application scoring (demo)</div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            { name: "Jordan Lee", income: 7200, credit: 712, rent: 1975, risk: "Low", action: "Approve" },
            { name: "Taylor Kim", income: 5200, credit: 640, rent: 2100, risk: "Medium", action: "Review" },
          ].map((a) => (
            <div key={a.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-extrabold">{a.name}</div>
                  <div className="mt-1 text-sm text-white/65">Income: ${a.income}/mo • Credit: {a.credit}</div>
                  <div className="mt-1 text-sm text-white/65">Target rent: ${a.rent}/mo</div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/75">
                  Risk: {a.risk}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Income rule</div>
                  <div className="mt-1 font-bold">{a.income >= 3 * a.rent ? "≥ 3× rent" : "< 3× rent"}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Credit rule</div>
                  <div className="mt-1 font-bold">{a.credit >= 700 ? "Strong" : a.credit >= 650 ? "Fair" : "Weak"}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Suggested</div>
                  <div className="mt-1 font-bold">{a.action}</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 flex-wrap">
                <button className="rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/10 px-3 py-2 text-sm font-bold">
                  Approve
                </button>
                <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold">Review</button>
                <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
