export type UnitStatus = "Paid" | "Due" | "Late" | "Vacant";
export type Cadence = "monthly" | "quarterly";

export type ExpenseCategory =
  | "Mortgage"
  | "Insurance"
  | "Repairs"
  | "Utilities"
  | "Property Tax"
  | "HOA"
  | "Management"
  | "Other";

export type Expense = {
  id: string;
  propertyId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string; // ISO
  recurring: boolean;
  receiptUrl?: string;
};

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

  expenses: [
    // Mortgage — recurring monthly
    { id: "exp_mort_2025_10", propertyId: "p_woolsey", category: "Mortgage", description: "Mortgage payment — Oct 2025", amount: 2800, date: "2025-10-01T00:00:00Z", recurring: true },
    { id: "exp_mort_2025_11", propertyId: "p_woolsey", category: "Mortgage", description: "Mortgage payment — Nov 2025", amount: 2800, date: "2025-11-01T00:00:00Z", recurring: true },
    { id: "exp_mort_2025_12", propertyId: "p_woolsey", category: "Mortgage", description: "Mortgage payment — Dec 2025", amount: 2800, date: "2025-12-01T00:00:00Z", recurring: true },
    { id: "exp_mort_2026_01", propertyId: "p_woolsey", category: "Mortgage", description: "Mortgage payment — Jan 2026", amount: 2800, date: "2026-01-01T00:00:00Z", recurring: true },
    { id: "exp_mort_2026_02", propertyId: "p_woolsey", category: "Mortgage", description: "Mortgage payment — Feb 2026", amount: 2800, date: "2026-02-01T00:00:00Z", recurring: true },
    { id: "exp_mort_2026_03", propertyId: "p_woolsey", category: "Mortgage", description: "Mortgage payment — Mar 2026", amount: 2800, date: "2026-03-01T00:00:00Z", recurring: true },

    // Insurance — recurring monthly
    { id: "exp_ins_2025_10", propertyId: "p_woolsey", category: "Insurance", description: "Property insurance premium", amount: 150, date: "2025-10-05T00:00:00Z", recurring: true },
    { id: "exp_ins_2025_11", propertyId: "p_woolsey", category: "Insurance", description: "Property insurance premium", amount: 150, date: "2025-11-05T00:00:00Z", recurring: true },
    { id: "exp_ins_2025_12", propertyId: "p_woolsey", category: "Insurance", description: "Property insurance premium", amount: 150, date: "2025-12-05T00:00:00Z", recurring: true },
    { id: "exp_ins_2026_01", propertyId: "p_woolsey", category: "Insurance", description: "Property insurance premium", amount: 150, date: "2026-01-05T00:00:00Z", recurring: true },
    { id: "exp_ins_2026_02", propertyId: "p_woolsey", category: "Insurance", description: "Property insurance premium", amount: 150, date: "2026-02-05T00:00:00Z", recurring: true },
    { id: "exp_ins_2026_03", propertyId: "p_woolsey", category: "Insurance", description: "Property insurance premium", amount: 150, date: "2026-03-05T00:00:00Z", recurring: true },

    // Property Tax — recurring monthly
    { id: "exp_tax_2025_10", propertyId: "p_woolsey", category: "Property Tax", description: "Property tax escrow", amount: 400, date: "2025-10-10T00:00:00Z", recurring: true },
    { id: "exp_tax_2025_11", propertyId: "p_woolsey", category: "Property Tax", description: "Property tax escrow", amount: 400, date: "2025-11-10T00:00:00Z", recurring: true },
    { id: "exp_tax_2025_12", propertyId: "p_woolsey", category: "Property Tax", description: "Property tax escrow", amount: 400, date: "2025-12-10T00:00:00Z", recurring: true },
    { id: "exp_tax_2026_01", propertyId: "p_woolsey", category: "Property Tax", description: "Property tax escrow", amount: 400, date: "2026-01-10T00:00:00Z", recurring: true },
    { id: "exp_tax_2026_02", propertyId: "p_woolsey", category: "Property Tax", description: "Property tax escrow", amount: 400, date: "2026-02-10T00:00:00Z", recurring: true },
    { id: "exp_tax_2026_03", propertyId: "p_woolsey", category: "Property Tax", description: "Property tax escrow", amount: 400, date: "2026-03-10T00:00:00Z", recurring: true },

    // Utilities — recurring monthly (common areas)
    { id: "exp_util_2025_10", propertyId: "p_woolsey", category: "Utilities", description: "Common area electric + water", amount: 195, date: "2025-10-15T00:00:00Z", recurring: true },
    { id: "exp_util_2025_11", propertyId: "p_woolsey", category: "Utilities", description: "Common area electric + water", amount: 210, date: "2025-11-15T00:00:00Z", recurring: true },
    { id: "exp_util_2025_12", propertyId: "p_woolsey", category: "Utilities", description: "Common area electric + water", amount: 230, date: "2025-12-15T00:00:00Z", recurring: true },
    { id: "exp_util_2026_01", propertyId: "p_woolsey", category: "Utilities", description: "Common area electric + water", amount: 205, date: "2026-01-15T00:00:00Z", recurring: true },
    { id: "exp_util_2026_02", propertyId: "p_woolsey", category: "Utilities", description: "Common area electric + water", amount: 190, date: "2026-02-15T00:00:00Z", recurring: true },
    { id: "exp_util_2026_03", propertyId: "p_woolsey", category: "Utilities", description: "Common area electric + water", amount: 200, date: "2026-03-15T00:00:00Z", recurring: true },

    // One-off repairs
    { id: "exp_repair_1", propertyId: "p_woolsey", category: "Repairs", description: "Plumbing fix — unit 1532A kitchen drain", amount: 450, date: "2025-11-20T00:00:00Z", recurring: false, receiptUrl: "/receipts/plumbing-1532a.pdf" },
    { id: "exp_repair_2", propertyId: "p_woolsey", category: "Repairs", description: "Replace smoke detectors (all units)", amount: 120, date: "2026-01-14T00:00:00Z", recurring: false, receiptUrl: "/receipts/smoke-detectors.pdf" },
    { id: "exp_repair_3", propertyId: "p_woolsey", category: "Repairs", description: "Exterior paint touch-up", amount: 680, date: "2026-03-08T00:00:00Z", recurring: false },

    // Management
    { id: "exp_mgmt_2026_01", propertyId: "p_woolsey", category: "Management", description: "Property management software (EZPM Pro)", amount: 29, date: "2026-01-01T00:00:00Z", recurring: true },
    { id: "exp_mgmt_2026_02", propertyId: "p_woolsey", category: "Management", description: "Property management software (EZPM Pro)", amount: 29, date: "2026-02-01T00:00:00Z", recurring: true },
    { id: "exp_mgmt_2026_03", propertyId: "p_woolsey", category: "Management", description: "Property management software (EZPM Pro)", amount: 29, date: "2026-03-01T00:00:00Z", recurring: true },
  ] satisfies Expense[],

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

  getExpenses() {
    return this.expenses;
  },

  getExpensesByProperty(propertyId: string) {
    return this.expenses.filter((e) => e.propertyId === propertyId);
  },

  getPnL() {
    const totalRevenue = this.payments.reduce((s, p) => s + p.amount, 0);
    const totalExpenses = this.expenses.reduce((s, e) => s + e.amount, 0);

    const perProperty = this.properties.map((prop) => {
      // Revenue: sum payments for leases on units in this property
      const propUnits = this.units.filter((u) => u.propertyId === prop.id);
      const propLeaseIds = this.leases
        .filter((l) => propUnits.some((u) => u.id === l.unitId))
        .map((l) => l.id);
      const propRevenue = this.payments
        .filter((p) => propLeaseIds.includes(p.leaseId))
        .reduce((s, p) => s + p.amount, 0);

      const propExpenses = this.expenses
        .filter((e) => e.propertyId === prop.id)
        .reduce((s, e) => s + e.amount, 0);

      return {
        propertyId: prop.id,
        propertyName: prop.name,
        totalRevenue: propRevenue,
        totalExpenses: propExpenses,
        netIncome: propRevenue - propExpenses,
      };
    });

    return {
      perProperty,
      totals: {
        totalRevenue,
        totalExpenses,
        netIncome: totalRevenue - totalExpenses,
      },
    };
  },
};
