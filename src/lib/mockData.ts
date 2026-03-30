export type UnitStatus = "Paid" | "Due" | "Late" | "Vacant";
export type Cadence = "monthly" | "quarterly";

export type Property = {
  id: string;
  name: string;
  address: string;
};

export type Unit = {
  id: string;
  propertyId: string;
  label: string; // e.g. 1532A
};

export type Lease = {
  id: string;
  unitId: string;
  tenantName: string;
  rent: number;
  cadence: Cadence;
  startDate: string; // ISO
  dueDay: number; // 1-28
};

export type Payment = {
  id: string;
  leaseId: string;
  amount: number;
  paidAt: string; // ISO
  periodStart: string; // ISO
  periodEnd: string; // ISO
  method: "ACH" | "Card" | "Cash";
};

export type ActivityEvent = {
  id: string;
  ts: string; // ISO
  type: "payment" | "application" | "maintenance" | "lease" | "vacancy";
  title: string;
  detail: string;
};

export const asOf = new Date("2026-03-29T12:00:00Z");

function toISO(d: Date) {
  return d.toISOString();
}

function addMonths(d: Date, months: number) {
  const nd = new Date(d);
  nd.setUTCMonth(nd.getUTCMonth() + months);
  return nd;
}

function endOfMonthUTC(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 23, 59, 59));
}

function startOfMonthUTC(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0));
}

function dueDateForMonth(asOfDate: Date, dueDay: number) {
  return new Date(Date.UTC(asOfDate.getUTCFullYear(), asOfDate.getUTCMonth(), dueDay, 0, 0, 0));
}

function daysBetween(a: Date, b: Date) {
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function statusForLease(lease: Lease, payments: Payment[], now: Date): UnitStatus {
  const leasePayments = payments
    .filter((p) => p.leaseId === lease.id)
    .sort((a, b) => new Date(b.periodEnd).getTime() - new Date(a.periodEnd).getTime());

  // If no payments and lease already started → Due
  if (leasePayments.length === 0) {
    const due = dueDateForMonth(now, lease.dueDay);
    const lateDays = daysBetween(due, now);
    return lateDays > 7 ? "Late" : "Due";
  }

  const paidThrough = new Date(leasePayments[0].periodEnd);
  if (now.getTime() <= paidThrough.getTime()) return "Paid";

  // Determine “current period due date” based on cadence.
  const currentDue = dueDateForMonth(now, lease.dueDay);
  const lateDays = daysBetween(currentDue, now);
  return lateDays > 7 ? "Late" : "Due";
}

export const demo = {
  properties: [
    {
      id: "p_woolsey",
      name: "Woolsey Street",
      address: "1532 Woolsey St, Berkeley, CA",
    },
    {
      id: "p_2",
      name: "Second Property",
      address: "(add address)",
    },
  ] satisfies Property[],

  units: [
    { id: "u_1532", propertyId: "p_woolsey", label: "1532" },
    { id: "u_1532a", propertyId: "p_woolsey", label: "1532A" },
    { id: "u_1534", propertyId: "p_woolsey", label: "1534" },
  ] satisfies Unit[],

  leases: [
    {
      id: "l_1532",
      unitId: "u_1532",
      tenantName: "Tenant (Quarterly)",
      rent: 3000,
      cadence: "quarterly",
      startDate: "2024-06-01T00:00:00Z",
      dueDay: 1,
    },
    {
      id: "l_1532a",
      unitId: "u_1532a",
      tenantName: "Tenant (Monthly)",
      rent: 1600,
      cadence: "monthly",
      startDate: "2026-02-01T00:00:00Z",
      dueDay: 1,
    },
  ] satisfies Lease[],

  payments: [
    // 1532 Woolsey: last paid June 2025 (covers Jun–Aug)
    {
      id: "pay_1532_2025_06",
      leaseId: "l_1532",
      amount: 9000,
      paidAt: "2025-06-01T18:20:00Z",
      periodStart: "2025-06-01T00:00:00Z",
      periodEnd: "2025-08-31T23:59:59Z",
      method: "ACH",
    },

    // 1532A Woolsey: rented last month, show 2 months paid (Feb + Mar 2026)
    {
      id: "pay_1532a_2026_02",
      leaseId: "l_1532a",
      amount: 1600,
      paidAt: "2026-02-01T19:10:00Z",
      periodStart: "2026-02-01T00:00:00Z",
      periodEnd: "2026-02-28T23:59:59Z",
      method: "ACH",
    },
    {
      id: "pay_1532a_2026_03",
      leaseId: "l_1532a",
      amount: 1600,
      paidAt: "2026-03-01T18:45:00Z",
      periodStart: "2026-03-01T00:00:00Z",
      periodEnd: "2026-03-31T23:59:59Z",
      method: "ACH",
    },
  ] satisfies Payment[],

  activity: [
    {
      id: "a_1",
      ts: toISO(new Date(asOf.getTime() - 1000 * 60 * 60 * 30)),
      type: "payment",
      title: "Rent received",
      detail: "1532A Woolsey • March paid via ACH ($1,600).",
    },
    {
      id: "a_2",
      ts: toISO(new Date(asOf.getTime() - 1000 * 60 * 60 * 24 * 3)),
      type: "vacancy",
      title: "Vacancy needs attention",
      detail: "1534 Woolsey is vacant — post listing + schedule showings.",
    },
    {
      id: "a_3",
      ts: "2025-06-01T18:20:00Z",
      type: "payment",
      title: "Quarterly rent received",
      detail: "1532 Woolsey paid for Jun–Aug 2025 ($9,000).",
    },
  ] satisfies ActivityEvent[],

  // Derived views
  getUnitCards() {
    const cards = this.units.map((u) => {
      const lease = this.leases.find((l) => l.unitId === u.id);
      if (!lease) {
        return {
          unitId: u.id,
          label: u.label,
          tenantName: undefined as string | undefined,
          rent: 0,
          cadence: undefined as Cadence | undefined,
          status: "Vacant" as UnitStatus,
          note: "Vacant — needs tenant",
        };
      }

      const st = statusForLease(lease, this.payments, asOf);
      const now = asOf;
      const nextDue = dueDateForMonth(addMonths(now, 1), lease.dueDay);

      // quick “paid through” from latest payment
      const latest = this.payments
        .filter((p) => p.leaseId === lease.id)
        .sort((a, b) => new Date(b.periodEnd).getTime() - new Date(a.periodEnd).getTime())[0];

      const paidThrough = latest ? new Date(latest.periodEnd) : undefined;

      return {
        unitId: u.id,
        label: u.label,
        tenantName: lease.tenantName,
        rent: lease.rent,
        cadence: lease.cadence,
        status: st,
        note:
          st === "Paid"
            ? `Paid through ${paidThrough?.toISOString().slice(0, 10)}`
            : `Next due ${nextDue.toISOString().slice(0, 10)}`,
      };
    });

    return cards;
  },

  getKpis() {
    const cards = this.getUnitCards();
    const active = cards.filter((c) => c.status !== "Vacant");

    const totalMonthlyRent = active
      .filter((c) => c.cadence === "monthly")
      .reduce((s, c) => s + c.rent, 0)
      // treat quarterly as monthly equivalent for KPI
      + active.filter((c) => c.cadence === "quarterly").reduce((s, c) => s + c.rent, 0);

    const monthStart = startOfMonthUTC(asOf);
    const monthEnd = endOfMonthUTC(asOf);

    const collectedThisMonth = this.payments
      .filter((p) => {
        const paidAt = new Date(p.paidAt);
        return paidAt >= monthStart && paidAt <= monthEnd;
      })
      .reduce((s, p) => s + p.amount, 0);

    // Simple “outstanding”: sum of active monthly rents for units that aren’t Paid
    const outstandingBalance = active
      .filter((c) => c.status === "Due" || c.status === "Late")
      .reduce((s, c) => s + c.rent, 0);

    const occupancyRate = active.length / cards.length;

    return { totalMonthlyRent, collectedThisMonth, outstandingBalance, occupancyRate };
  },
};
