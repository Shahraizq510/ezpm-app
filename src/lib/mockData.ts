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
    totalMonthlyRent: 34250,
    collectedThisMonth: 24820,
    outstandingBalance: 9430,
    occupancyRate: 0.89,
  },
  properties: [
    {
      id: "p_1",
      name: "Sunset Apartments",
      address: "1240 Sunset Blvd, Los Angeles, CA",
      units: 12,
      occupancyPct: 0.83,
      totalRent: 22800,
    },
    {
      id: "p_2",
      name: "Maple Court",
      address: "88 Maple Ave, San Jose, CA",
      units: 6,
      occupancyPct: 1.0,
      totalRent: 11450,
    },
  ] satisfies Property[],

  units: [
    { id: "u_1", propertyId: "p_1", label: "1A", tenantName: "A. Johnson", rent: 1850, status: "Paid" },
    { id: "u_2", propertyId: "p_1", label: "2B", tenantName: "R. Patel", rent: 1975, status: "Due" },
    { id: "u_3", propertyId: "p_1", label: "3C", tenantName: "M. Chen", rent: 2100, status: "Late" },
    { id: "u_4", propertyId: "p_2", label: "4A", tenantName: "S. Rivera", rent: 1900, status: "Paid" },
    { id: "u_5", propertyId: "p_2", label: "5B", tenantName: "K. Williams", rent: 1950, status: "Paid" },
    { id: "u_6", propertyId: "p_2", label: "6C", tenantName: "N. Ahmed", rent: 1950, status: "Paid" },
  ] satisfies Unit[],

  activity: [
    {
      id: "a_1",
      ts: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
      type: "payment",
      title: "Tenant paid rent",
      detail: "Unit 1A paid via ACH ($1,850).",
    },
    {
      id: "a_2",
      ts: new Date(Date.now() - 1000 * 60 * 68).toISOString(),
      type: "application",
      title: "New application received",
      detail: "Applicant: Jordan Lee • Unit 2B.",
    },
    {
      id: "a_3",
      ts: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
      type: "maintenance",
      title: "Maintenance request submitted",
      detail: "Unit 3C • Plumbing • Priority: Urgent.",
    },
  ] satisfies ActivityEvent[],
};
