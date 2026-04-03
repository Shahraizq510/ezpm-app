"use client";

import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { KpiCard } from "@/components/KpiCard";
import { StatusPill } from "@/components/StatusPill";
import { InviteTenantModal } from "@/components/InviteTenantModal";
import { demo } from "@/lib/mockData";
import { money, pct, timeAgo } from "@/lib/ui";

export default function LandlordDashboardPage() {
  const [inviteOpen, setInviteOpen] = useState(false);

  const k = demo.getKpis();
  const cards = demo.getUnitCards();
  const pnl = demo.getPnL();
  const invites = demo.getInvites();
  const pendingInvites = invites.filter((i) => i.status === "pending");
  const vacantUnits = demo.getVacantUnits();

  return (
    <div className="grid gap-6">
      <TopBar title="Dashboard" />

      {/* KPIs */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Total Monthly Rent" value={money(k.totalMonthlyRent)} note="Monthly equivalent" />
        <KpiCard label="Collected This Month" value={money(k.collectedThisMonth)} note="Based on payments ledger" />
        <KpiCard label="Outstanding Balance" value={money(k.outstandingBalance)} note="Due + late (simple)" />
        <KpiCard label="Occupancy Rate" value={pct(k.occupancyRate)} note="Occupied units" />
        <KpiCard label="Net Income" value={money(pnl.totals.netIncome)} note="All-time revenue − expenses" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_.9fr]">
        {/* Units & Status */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Units & Status</div>
              <div className="mt-1 text-base font-extrabold">What needs attention</div>
            </div>
            <div className="text-sm text-white/60">As of today</div>
          </div>

          <div className="p-3 grid gap-2">
            {cards.map((u) => (
              <div
                key={u.unitId}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="font-bold">Unit {u.label}</div>
                  <div className="text-sm text-white/60 truncate">
                    {u.tenantName ?? "Vacant"} • {u.rent ? `${money(u.rent)} / ${u.cadence}` : "No rent set"}
                  </div>
                  <div className="mt-1 text-xs text-white/55">{u.note}</div>
                </div>
                <StatusPill status={u.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <div className="px-5 py-4 border-b border-white/10">
            <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Recent Activity</div>
            <div className="mt-1 text-base font-extrabold">Latest events</div>
          </div>
          <div className="p-4 grid gap-3">
            {demo.activity.map((a) => (
              <div key={a.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-bold">{a.title}</div>
                  <div className="text-xs text-white/55">{timeAgo(a.ts)}</div>
                </div>
                <div className="mt-1 text-sm text-white/65">{a.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
        <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Quick Actions</div>
        <div className="mt-1 text-base font-extrabold">Common workflows</div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <button className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/15 to-violet-500/15 px-4 py-4 text-left hover:from-blue-500/20 hover:to-violet-500/20">
            <div className="font-extrabold">Add Property</div>
            <div className="mt-1 text-sm text-white/65">Create a property and add units.</div>
          </button>
          <button
            onClick={() => setInviteOpen(true)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left hover:bg-white/10"
          >
            <div className="font-extrabold">Invite Tenant</div>
            <div className="mt-1 text-sm text-white/65">Send tenant onboarding link.</div>
          </button>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left hover:bg-white/10">
            <div className="font-extrabold">Create Lease</div>
            <div className="mt-1 text-sm text-white/65">Generate a lease from template.</div>
          </button>
        </div>
      </section>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Pending Invites</div>
          <div className="mt-1 text-base font-extrabold">Awaiting tenant response</div>

          <div className="mt-4 grid gap-2">
            {pendingInvites.map((inv) => {
              const unit = demo.units.find((u) => u.id === inv.unitId);
              return (
                <div
                  key={inv.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="font-bold">{inv.tenantName}</div>
                    <div className="text-sm text-white/60 truncate">
                      Unit {unit?.label ?? "?"} • {inv.email}
                    </div>
                    <div className="mt-1 text-xs text-white/55">
                      Sent {new Date(inv.sentAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 text-amber-200 px-2.5 py-1 text-xs font-bold">
                    Pending
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Invite Tenant Modal */}
      <InviteTenantModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        vacantUnits={vacantUnits}
      />
    </div>
  );
}
