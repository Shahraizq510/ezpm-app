export type UnitStatus = "Paid" | "Due" | "Late";

export type Unit = {
  id: string;
  propertyId: string;
  label: string; // e.g. 1A
  tenantName?: string;
  rent: number;
  status: UnitStatus;
};

export type Property = {
  id: string;
  name: string;
  address: string;
  units: number;
  occupancyPct: number;
  totalRent: number;
};

export type ActivityEvent = {
  id: string;
  ts: string; // ISO
  type: "payment" | "application" | "maintenance" | "lease";
  title: string;
  detail: string;
};

export const demo = {
  kpis: {
    // Demo numbers — update as you add more properties
    totalMonthlyRent: 4600,
    collectedThisMonth: 3000,
    outstandingBalance: 1600,
    occupancyRate: 2 / 3,
  },
  properties: [
    {
      id: "p_1",
      name: "Woolsey Street",
      address: "1532 Woolsey St, Berkeley, CA",
      units: 3,
      occupancyPct: 2 / 3,
      totalRent: 4600,
    },
    {
      id: "p_2",
      name: "Second Property",
      address: "(add address)",
      units: 0,
      occupancyPct: 0,
      totalRent: 0,
    },
  ] satisfies Property[],

  units: [
    {
      id: "u_1532",
      propertyId: "p_1",
      label: "1532",
      tenantName: "(Tenant)",
      rent: 3000,
      status: "Paid",
    },
    {
      id: "u_1532a",
      propertyId: "p_1",
      label: "1532A",
      tenantName: "(Tenant)",
      rent: 1600,
      status: "Due",
    },
    {
      id: "u_1534",
      propertyId: "p_1",
      label: "1534",
      tenantName: "Vacant",
      rent: 0,
      status: "Late",
    },
  ] satisfies Unit[],

  activity: [
    {
      id: "a_1",
      ts: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      type: "payment",
      title: "Rent received",
      detail: "1532 Woolsey paid via ACH ($3,000).",
    },
    {
      id: "a_2",
      ts: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      type: "payment",
      title: "Rent due",
      detail: "1532A Woolsey is due ($1,600).",
    },
    {
      id: "a_3",
      ts: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
      type: "application",
      title: "Vacancy needs attention",
      detail: "1534 Woolsey is vacant — post listing + schedule showings.",
    },
  ] satisfies ActivityEvent[],
};
