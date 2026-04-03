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

export type InviteStatus = "pending" | "opened" | "completed";

export type TenantInvite = {
  id: string;
  unitId: string;
  tenantName: string;
  email: string;
  phone?: string;
  inviteUrl: string;
  status: InviteStatus;
  sentAt: string; // ISO
};

export type DocCategory =
  | "Bill" | "Invoice" | "Receipt" | "Insurance"
  | "Tax" | "Permit" | "Inspection" | "Lease" | "Other";

export type PropertyDocument = {
  id: string;
  propertyId: string;
  category: DocCategory;
  name: string;
  description?: string;
  uploadedAt: string;
  fileType: string;
  fileSize: number;
  url?: string;
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
      tenantName: "YanYan Wang",
      rent: 3000,
      cadence: "quarterly",
      startDate: "2024-06-01T00:00:00Z",
      dueDay: 1,
    },
    {
      id: "l_1532a",
      unitId: "u_1532a",
      tenantName: "Anna Wolfe",
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
      detail: "Anna Wolfe • 1532A Woolsey • March paid via ACH ($1,600).",
    },
    {
      id: "a_2",
      ts: toISO(new Date(asOf.getTime() - 1000 * 60 * 60 * 24 * 3)),
      type: "vacancy",
      title: "Lease sent — pending signature",
      detail: "1534 Woolsey — lease sent to Rushin Contractor, pending signature.",
    },
    {
      id: "a_3",
      ts: "2025-06-01T18:20:00Z",
      type: "payment",
      title: "Quarterly rent received",
      detail: "YanYan Wang • 1532 Woolsey paid for Jun–Aug 2025 ($9,000).",
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
          note: "Lease pending — Rushin Contractor",
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

  invites: [
    {
      id: "inv_001",
      unitId: "u_1534",
      tenantName: "Rushin Contractor",
      email: "rushin@example.com",
      inviteUrl: "https://ezpm.app/onboard/inv-a3k9x2",
      status: "pending",
      sentAt: "2026-03-26T10:00:00Z",
    },
  ] satisfies TenantInvite[],

  getInvites() {
    return this.invites;
  },

  getVacantUnits() {
    return this.units.filter((u) => !this.leases.some((l) => l.unitId === u.id));
  },

  documents: [
    { id: "doc_1", propertyId: "p_woolsey", category: "Bill", name: "Water bill — Jan 2026", description: "Monthly water service", uploadedAt: "2026-01-18T10:00:00Z", fileType: "pdf", fileSize: 250880, url: "/docs/water-jan-2026.pdf" },
    { id: "doc_2", propertyId: "p_woolsey", category: "Bill", name: "PG&E electric bill — Feb 2026", description: "Electric service for all units", uploadedAt: "2026-02-20T14:30:00Z", fileType: "pdf", fileSize: 193536, url: "/docs/pge-feb-2026.pdf" },
    { id: "doc_3", propertyId: "p_woolsey", category: "Invoice", name: "Bay Area Plumbing — repair invoice", description: "Kitchen drain repair, unit 1532A ($450)", uploadedAt: "2025-11-22T09:15:00Z", fileType: "pdf", fileSize: 319488, url: "/docs/plumbing-invoice.pdf" },
    { id: "doc_4", propertyId: "p_woolsey", category: "Insurance", name: "Property insurance certificate", description: "Annual policy — State Farm", uploadedAt: "2025-10-01T08:00:00Z", fileType: "pdf", fileSize: 1258291, url: "/docs/insurance-cert.pdf" },
    { id: "doc_5", propertyId: "p_woolsey", category: "Tax", name: "Property tax statement Q1 2026", description: "Alameda County", uploadedAt: "2026-01-05T11:00:00Z", fileType: "pdf", fileSize: 580608, url: "/docs/tax-q1-2026.pdf" },
    { id: "doc_6", propertyId: "p_woolsey", category: "Inspection", name: "Roof inspection report", description: "Annual roof condition assessment", uploadedAt: "2026-02-10T16:00:00Z", fileType: "pdf", fileSize: 911360, url: "/docs/roof-inspection.pdf" },
    { id: "doc_7", propertyId: "p_woolsey", category: "Lease", name: "Anna Wolfe — lease agreement", description: "Unit 1532A, starts Feb 2026", uploadedAt: "2026-01-28T13:45:00Z", fileType: "pdf", fileSize: 2202009, url: "/docs/lease-anna-wolfe.pdf" },
    { id: "doc_8", propertyId: "p_woolsey", category: "Lease", name: "YanYan Wang — lease agreement", description: "Unit 1532, starts Jun 2024", uploadedAt: "2024-05-20T10:30:00Z", fileType: "pdf", fileSize: 1887436, url: "/docs/lease-yanyan-wang.pdf" },
  ] satisfies PropertyDocument[],

  getDocuments() {
    return this.documents;
  },

  getDocumentsByProperty(propertyId: string) {
    return this.documents.filter((d) => d.propertyId === propertyId);
  },

  getDocumentsByCategory(category: DocCategory) {
    return this.documents.filter((d) => d.category === category);
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
