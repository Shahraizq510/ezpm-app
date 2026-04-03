"use client";

import Link from "next/link";
import { use, useState, useRef } from "react";
import { TopBar } from "@/components/TopBar";
import { StatusPill } from "@/components/StatusPill";
import { demo } from "@/lib/mockData";
import type { DocCategory } from "@/lib/mockData";
import { money, pct, fileSize, timeAgo } from "@/lib/ui";

type Tab = "overview" | "documents" | "expenses" | "revenue";

const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "documents", label: "Documents" },
  { key: "expenses", label: "Expenses" },
  { key: "revenue", label: "Revenue" },
];

const expenseCategoryColors: Record<string, string> = {
  Mortgage: "border-blue-400/30 bg-blue-400/10 text-blue-200",
  Insurance: "border-violet-400/30 bg-violet-400/10 text-violet-200",
  Repairs: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  Utilities: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  "Property Tax": "border-amber-400/30 bg-amber-400/10 text-amber-200",
  HOA: "border-pink-400/30 bg-pink-400/10 text-pink-200",
  Management: "border-teal-400/30 bg-teal-400/10 text-teal-200",
  Other: "border-white/20 bg-white/10 text-white/70",
};

const docCategoryColors: Record<string, string> = {
  Bill: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  Invoice: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  Receipt: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  Insurance: "border-violet-400/30 bg-violet-400/10 text-violet-200",
  Tax: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  Permit: "border-pink-400/30 bg-pink-400/10 text-pink-200",
  Inspection: "border-blue-400/30 bg-blue-400/10 text-blue-200",
  Lease: "border-teal-400/30 bg-teal-400/10 text-teal-200",
  Other: "border-white/20 bg-white/10 text-white/70",
};

function fileIcon(fileType: string) {
  if (fileType === "pdf") return "📄";
  if (["jpg", "jpeg", "png", "webp"].includes(fileType)) return "🖼️";
  return "📋";
}

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const property = demo.getPropertyBySlug(slug);

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [attachedExpenses, setAttachedExpenses] = useState<Set<string>>(
    () => new Set(demo.getExpensesByProperty(property?.id ?? "").filter(e => e.receiptUrl).map(e => e.id))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload form state
  const [uploadCategory, setUploadCategory] = useState<DocCategory>("Bill");
  const [uploadName, setUploadName] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadFile, setUploadFile] = useState<string>("");

  if (!property) {
    return (
      <div className="grid gap-6">
        <TopBar title="Property Not Found" />
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 text-center">
          <div className="text-4xl mb-4">🏚️</div>
          <div className="text-xl font-extrabold mb-2">Property not found</div>
          <div className="text-white/60 mb-4">No property matches &quot;{slug}&quot;</div>
          <Link
            href="/app/landlord/properties"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const unitCards = demo.getUnitCards().filter((u) => {
    const unit = demo.units.find((x) => x.id === u.unitId);
    return unit?.propertyId === property.id;
  });
  const occupied = unitCards.filter((u) => u.status !== "Vacant").length;
  const totalUnits = unitCards.length;
  const occupancyPct = totalUnits > 0 ? occupied / totalUnits : 0;
  const totalMonthlyRent = unitCards
    .filter((c) => c.status !== "Vacant")
    .reduce((s, c) => s + c.rent, 0);

  const documents = demo.getDocumentsByProperty(property.id);
  const expenses = demo.getExpensesByProperty(property.id);
  const totalExpensesAmount = expenses.reduce((s, e) => s + e.amount, 0);
  const revenue = demo.getRevenueByProperty(property.id);
  const invites = demo.getInvitesByProperty(property.id);

  function handleUploadSubmit() {
    setUploadSuccess(true);
    setTimeout(() => {
      setShowUploadModal(false);
      setUploadSuccess(false);
      setUploadCategory("Bill");
      setUploadName("");
      setUploadDesc("");
      setUploadFile("");
    }, 1500);
  }

  function handleAttachReceipt(expenseId: string) {
    setAttachedExpenses((prev) => new Set(prev).add(expenseId));
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div>
        <Link
          href="/app/landlord/properties"
          className="text-white/60 hover:text-white text-sm transition inline-flex items-center gap-1 mb-3"
        >
          ← Properties
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold">{property.name}</h1>
            <div className="mt-1 text-sm text-white/60">{property.address}</div>
          </div>
          <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-white/75">
            {pct(occupancyPct)} occupied
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={
              "rounded-xl px-4 py-2 text-sm font-semibold transition " +
              (activeTab === t.key
                ? "bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-white/10 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW TAB ===== */}
      {activeTab === "overview" && (
        <>
          {/* Quick stats */}
          <section className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Total Units</div>
              <div className="mt-1 text-2xl font-extrabold">{totalUnits}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Occupied</div>
              <div className="mt-1 text-2xl font-extrabold">{occupied}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Vacant</div>
              <div className="mt-1 text-2xl font-extrabold">{totalUnits - occupied}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Monthly Rent</div>
              <div className="mt-1 text-2xl font-extrabold">{money(totalMonthlyRent)}</div>
            </div>
          </section>

          {/* Units */}
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <div className="px-5 py-4 border-b border-white/10">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Units</div>
              <div className="mt-1 text-base font-extrabold">All units at this property</div>
            </div>
            <div className="p-3 grid gap-2">
              {unitCards.map((u) => (
                <Link
                  key={u.unitId}
                  href={`/app/landlord/units/${u.unitId}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 hover:bg-white/[0.08] transition"
                >
                  <div className="min-w-0">
                    <div className="font-bold">Unit {u.label}</div>
                    <div className="text-sm text-white/60 truncate">
                      {u.tenantName ?? "Vacant"} •{" "}
                      {u.rent ? `${money(u.rent)} / ${u.cadence}` : "No rent set"}
                    </div>
                    <div className="mt-1 text-xs text-white/55">{u.note}</div>
                  </div>
                  <StatusPill status={u.status} />
                </Link>
              ))}
            </div>
          </section>

          {/* Pending Invites */}
          {invites.length > 0 && (
            <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              <div className="px-5 py-4 border-b border-white/10">
                <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Pending Invites</div>
              </div>
              <div className="p-3 grid gap-2">
                {invites.map((inv) => {
                  const unit = demo.units.find((u) => u.id === inv.unitId);
                  return (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                    >
                      <div>
                        <div className="font-bold">{inv.tenantName}</div>
                        <div className="text-sm text-white/60">
                          Unit {unit?.label} • {inv.email}
                        </div>
                      </div>
                      <span className="rounded-full border border-amber-300/20 bg-amber-300/10 text-amber-200 px-2.5 py-1 text-xs font-bold">
                        {inv.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}

      {/* ===== DOCUMENTS TAB ===== */}
      {activeTab === "documents" && (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/60">
              {documents.length} document{documents.length !== 1 ? "s" : ""} •{" "}
              {fileSize(documents.reduce((s, d) => s + d.fileSize, 0))}
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/10 px-4 py-2 text-sm font-bold hover:from-blue-500/30 hover:to-violet-500/30 transition"
            >
              Upload Document
            </button>
          </div>

          <div className="grid gap-3">
            {documents.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 text-center text-white/60">
                No documents yet. Upload your first one.
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="text-2xl">{fileIcon(doc.fileType)}</div>
                    <div className="min-w-0">
                      <div className="font-bold truncate">{doc.name}</div>
                      {doc.description && (
                        <div className="text-sm text-white/55 mt-0.5">{doc.description}</div>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                            docCategoryColors[doc.category] ?? docCategoryColors.Other
                          }`}
                        >
                          {doc.category}
                        </span>
                        <span className="text-xs text-white/50">
                          {fileSize(doc.fileSize)}
                        </span>
                        <span className="text-xs text-white/50">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold hover:bg-white/10 transition">
                      View
                    </button>
                    <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold hover:bg-white/10 transition text-red-300">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Upload Modal */}
          {showUploadModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
              onClick={() => {
                setShowUploadModal(false);
                setUploadSuccess(false);
              }}
            >
              <div
                className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                {uploadSuccess ? (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-3">✅</div>
                    <div className="text-lg font-extrabold">Document uploaded</div>
                    <div className="text-sm text-white/60 mt-1">
                      Added to {property.name}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-lg font-extrabold mb-4">
                      Upload to {property.name}
                    </div>

                    {/* Drop zone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04] transition p-8 text-center cursor-pointer mb-4"
                    >
                      <div className="text-3xl mb-2">📁</div>
                      <div className="text-sm text-white/60">
                        {uploadFile || "Drop files here or click to browse"}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          setUploadFile(e.target.files?.[0]?.name ?? "")
                        }
                      />
                    </div>

                    <div className="grid gap-3">
                      <div>
                        <label className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold block mb-1">
                          Category
                        </label>
                        <select
                          value={uploadCategory}
                          onChange={(e) =>
                            setUploadCategory(e.target.value as DocCategory)
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                        >
                          {[
                            "Bill",
                            "Invoice",
                            "Receipt",
                            "Insurance",
                            "Tax",
                            "Permit",
                            "Inspection",
                            "Lease",
                            "Other",
                          ].map((c) => (
                            <option key={c} value={c} className="bg-[#111]">
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold block mb-1">
                          Document Name
                        </label>
                        <input
                          type="text"
                          value={uploadName}
                          onChange={(e) => setUploadName(e.target.value)}
                          placeholder="e.g. Water Bill March 2026"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold block mb-1">
                          Description (optional)
                        </label>
                        <input
                          type="text"
                          value={uploadDesc}
                          onChange={(e) => setUploadDesc(e.target.value)}
                          placeholder="Notes about this document"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={handleUploadSubmit}
                        className="flex-1 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/10 px-4 py-2.5 text-sm font-bold hover:from-blue-500/30 hover:to-violet-500/30 transition"
                      >
                        Upload
                      </button>
                      <button
                        onClick={() => setShowUploadModal(false)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold hover:bg-white/10 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== EXPENSES TAB ===== */}
      {activeTab === "expenses" && (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
              Total Expenses
            </div>
            <div className="mt-1 text-2xl font-extrabold">
              {money(totalExpensesAmount)}
            </div>
            <div className="text-sm text-white/55">
              {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="grid gap-3">
            {expenses.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 text-center text-white/60">
                No expenses recorded yet.
              </div>
            ) : (
              expenses
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((exp) => (
                  <div
                    key={exp.id}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="font-bold">{exp.description}</div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                            expenseCategoryColors[exp.category] ??
                            expenseCategoryColors.Other
                          }`}
                        >
                          {exp.category}
                        </span>
                        <span className="text-xs text-white/50">
                          {new Date(exp.date).toLocaleDateString()}
                        </span>
                        {exp.recurring && (
                          <span className="text-xs text-white/50">↻ Recurring</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-lg font-extrabold">{money(exp.amount)}</div>
                      <button
                        onClick={() => handleAttachReceipt(exp.id)}
                        className={`rounded-xl border border-white/10 px-2.5 py-1.5 text-sm transition ${
                          attachedExpenses.has(exp.id)
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        {attachedExpenses.has(exp.id) ? "✅" : "📎"}
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </>
      )}

      {/* ===== REVENUE TAB ===== */}
      {activeTab === "revenue" && (
        <>
          {/* Summary */}
          <section className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
                Revenue Collected
              </div>
              <div className="mt-1 text-2xl font-extrabold text-emerald-400">
                {money(revenue.totalRevenue)}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
                Total Expenses
              </div>
              <div className="mt-1 text-2xl font-extrabold text-red-400">
                {money(revenue.totalExpenses)}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
                Net Income
              </div>
              <div
                className={`mt-1 text-2xl font-extrabold ${
                  revenue.netIncome >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {money(revenue.netIncome)}
              </div>
            </div>
          </section>

          {/* Revenue breakdown */}
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <div className="px-5 py-4 border-b border-white/10">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
                Revenue
              </div>
              <div className="mt-1 text-base font-extrabold">Payments received</div>
            </div>
            <div className="p-3 grid gap-2">
              {revenue.payments.length === 0 ? (
                <div className="px-4 py-3 text-sm text-white/60">
                  No payments recorded.
                </div>
              ) : (
                revenue.payments
                  .sort(
                    (a, b) =>
                      new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
                  )
                  .map((p) => {
                    const lease = demo.leases.find((l) => l.id === p.leaseId);
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                      >
                        <div>
                          <div className="font-bold">{lease?.tenantName ?? "Unknown"}</div>
                          <div className="text-sm text-white/60">
                            {new Date(p.paidAt).toLocaleDateString()} • {p.method}
                          </div>
                        </div>
                        <div className="text-lg font-extrabold text-emerald-400">
                          +{money(p.amount)}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </section>

          {/* Expenses breakdown */}
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <div className="px-5 py-4 border-b border-white/10">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
                Expenses
              </div>
              <div className="mt-1 text-base font-extrabold">Costs & bills</div>
            </div>
            <div className="p-3 grid gap-2">
              {revenue.expenses.length === 0 ? (
                <div className="px-4 py-3 text-sm text-white/60">
                  No expenses recorded.
                </div>
              ) : (
                revenue.expenses
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                    >
                      <div>
                        <div className="font-bold">{e.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-xs font-bold ${
                              expenseCategoryColors[e.category] ??
                              expenseCategoryColors.Other
                            }`}
                          >
                            {e.category}
                          </span>
                          <span className="text-xs text-white/50">
                            {new Date(e.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-lg font-extrabold text-red-400">
                        −{money(e.amount)}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>

          {/* Net total */}
          <div
            className={`rounded-2xl border p-5 text-center ${
              revenue.netIncome >= 0
                ? "border-emerald-400/20 bg-emerald-400/5"
                : "border-red-400/20 bg-red-400/5"
            }`}
          >
            <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
              Net Income (All Time)
            </div>
            <div
              className={`mt-2 text-3xl font-extrabold ${
                revenue.netIncome >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {money(revenue.netIncome)}
            </div>
            <div className="text-sm text-white/50 mt-1">
              {money(revenue.totalRevenue)} revenue − {money(revenue.totalExpenses)} expenses
            </div>
          </div>
        </>
      )}
    </div>
  );
}
