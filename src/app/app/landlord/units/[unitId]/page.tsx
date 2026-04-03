"use client";

import Link from "next/link";
import { use, useState, useRef } from "react";
import { StatusPill } from "@/components/StatusPill";
import { demo } from "@/lib/mockData";
import type { DocCategory, PropertyDocument } from "@/lib/mockData";
import { money, fileSize } from "@/lib/ui";

type Tab = "overview" | "payments" | "expenses" | "documents";

const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "payments", label: "Payments" },
  { key: "expenses", label: "Expenses" },
  { key: "documents", label: "Documents" },
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

export default function UnitDetailPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = use(params);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<PropertyDocument[]>([]);
  const [uploadCategory, setUploadCategory] = useState<DocCategory>("Receipt");
  const [uploadName, setUploadName] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadFile, setUploadFile] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unit = demo.getUnitById(unitId);

  if (!unit) {
    return (
      <div className="grid gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 text-center">
          <div className="text-4xl mb-4">🏠</div>
          <div className="text-xl font-extrabold mb-2">Unit not found</div>
          <div className="text-white/60 mb-4">No unit matches &quot;{unitId}&quot;</div>
          <Link href="/app/landlord/dashboard" className="text-blue-400 hover:text-blue-300 text-sm">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const property = demo.properties.find((p) => p.id === unit.propertyId);
  const lease = demo.getLeaseByUnit(unit.id);
  const unitCard = demo.getUnitCards().find((c) => c.unitId === unit.id);
  const payments = demo.getPaymentsByUnit(unit.id);
  const unitExpenses = demo.getExpensesByUnit(unit.id);
  const documents = demo.getDocumentsByUnit(unit.id);
  const revenue = demo.getUnitRevenue(unit.id);
  const invite = demo.getInvites().find((i) => i.unitId === unit.id);

  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
  const totalUnitExpenses = unitExpenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div>
        <Link
          href="/app/landlord/dashboard"
          className="text-white/60 hover:text-white text-sm transition inline-flex items-center gap-1 mb-3"
        >
          ← Dashboard
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold">Unit {unit.label}</h1>
            <div className="mt-1 text-sm text-white/60">
              {property?.name} • {property?.address}
            </div>
          </div>
          {unitCard && <StatusPill status={unitCard.status} />}
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

      {/* ===== OVERVIEW ===== */}
      {activeTab === "overview" && (
        <>
          {/* Tenant & Lease Info */}
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold mb-3">
              Tenant & Lease
            </div>
            {lease ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-white/50">Tenant</div>
                  <div className="font-bold text-lg">{lease.tenantName}</div>
                </div>
                <div>
                  <div className="text-xs text-white/50">Rent</div>
                  <div className="font-bold text-lg">
                    {money(lease.rent)} / {lease.cadence}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/50">Lease Start</div>
                  <div className="font-bold">
                    {new Date(lease.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/50">Due Day</div>
                  <div className="font-bold">{lease.dueDay}th of each month</div>
                </div>
              </div>
            ) : invite ? (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold">{invite.tenantName}</div>
                  <div className="text-sm text-white/60">{invite.email}</div>
                </div>
                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 text-amber-200 px-2.5 py-1 text-xs font-bold">
                  Lease Pending
                </span>
              </div>
            ) : (
              <div className="text-white/60">No active lease — unit is vacant.</div>
            )}
          </section>

          {/* Quick Stats */}
          <section className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
                Total Collected
              </div>
              <div className="mt-1 text-2xl font-extrabold text-emerald-400">
                {money(totalPaid)}
              </div>
              <div className="text-xs text-white/50 mt-1">
                {payments.length} payment{payments.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
                Unit Expenses
              </div>
              <div className="mt-1 text-2xl font-extrabold text-red-400">
                {money(totalUnitExpenses)}
              </div>
              <div className="text-xs text-white/50 mt-1">
                {unitExpenses.length} expense{unitExpenses.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
                Net (Unit-Level)
              </div>
              <div
                className={`mt-1 text-2xl font-extrabold ${
                  revenue.netIncome >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {money(revenue.netIncome)}
              </div>
              <div className="text-xs text-white/50 mt-1">Revenue − unit expenses</div>
            </div>
          </section>

          {/* Status note */}
          {unitCard && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold mb-1">
                Status
              </div>
              <div className="text-sm text-white/70">{unitCard.note}</div>
            </div>
          )}
        </>
      )}

      {/* ===== PAYMENTS ===== */}
      {activeTab === "payments" && (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
              Total Collected
            </div>
            <div className="mt-1 text-2xl font-extrabold text-emerald-400">
              {money(totalPaid)}
            </div>
          </div>

          <div className="grid gap-3">
            {payments.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 text-center text-white/60">
                No payments recorded for this unit.
              </div>
            ) : (
              payments
                .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
                .map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold">{money(p.amount)}</div>
                      <div className="text-sm text-white/60">
                        {new Date(p.paidAt).toLocaleDateString()} • {p.method}
                      </div>
                      <div className="text-xs text-white/50 mt-1">
                        Period: {new Date(p.periodStart).toLocaleDateString()} –{" "}
                        {new Date(p.periodEnd).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-lg font-extrabold text-emerald-400">
                      +{money(p.amount)}
                    </div>
                  </div>
                ))
            )}
          </div>
        </>
      )}

      {/* ===== EXPENSES ===== */}
      {activeTab === "expenses" && (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
              Unit-Specific Expenses
            </div>
            <div className="mt-1 text-2xl font-extrabold text-red-400">
              {money(totalUnitExpenses)}
            </div>
            <div className="text-xs text-white/50 mt-1">
              Only expenses directly tied to this unit
            </div>
          </div>

          <div className="grid gap-3">
            {unitExpenses.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 text-center text-white/60">
                No unit-specific expenses. Property-wide costs (mortgage, insurance, etc.) are on the{" "}
                <Link
                  href={`/app/landlord/properties/${property ? demo.getPropertySlug(property) : ""}`}
                  className="text-blue-400 hover:text-blue-300"
                >
                  property page
                </Link>.
              </div>
            ) : (
              unitExpenses
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
                            expenseCategoryColors[exp.category] ?? expenseCategoryColors.Other
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
                        {exp.receiptUrl && (
                          <span className="text-xs text-white/50">📎 Receipt</span>
                        )}
                      </div>
                    </div>
                    <div className="text-lg font-extrabold text-red-400 shrink-0">
                      −{money(exp.amount)}
                    </div>
                  </div>
                ))
            )}
          </div>
        </>
      )}

      {/* ===== DOCUMENTS ===== */}
      {activeTab === "documents" && (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/60">
              {documents.length + uploadedDocs.length} document{documents.length + uploadedDocs.length !== 1 ? "s" : ""} related to this unit
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/10 px-4 py-2 text-sm font-bold hover:from-blue-500/30 hover:to-violet-500/30 transition"
            >
              Upload Document
            </button>
          </div>

          <div className="grid gap-3">
            {documents.length + uploadedDocs.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 text-center text-white/60">
                No documents found for this unit. Upload one or check the{" "}
                <Link
                  href={`/app/landlord/properties/${property ? demo.getPropertySlug(property) : ""}`}
                  className="text-blue-400 hover:text-blue-300"
                >
                  property documents
                </Link>{" "}
                for shared files.
              </div>
            ) : (
              [...uploadedDocs, ...documents].map((doc) => (
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
                        <span className="text-xs text-white/50">{fileSize(doc.fileSize)}</span>
                        <span className="text-xs text-white/50">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold hover:bg-white/10 transition shrink-0">
                    View
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Upload Modal */}
          {showUploadModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
              onClick={() => { setShowUploadModal(false); setUploadSuccess(false); }}
            >
              <div
                className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                {uploadSuccess ? (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-3">✅</div>
                    <div className="text-lg font-extrabold">Document uploaded</div>
                    <div className="text-sm text-white/60 mt-1">Added to Unit {unit?.label}</div>
                  </div>
                ) : (
                  <>
                    <div className="text-lg font-extrabold mb-4">Upload to Unit {unit?.label}</div>

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
                        onChange={(e) => setUploadFile(e.target.files?.[0]?.name ?? "")}
                      />
                    </div>

                    <div className="grid gap-3">
                      <div>
                        <label className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold block mb-1">Category</label>
                        <select
                          value={uploadCategory}
                          onChange={(e) => setUploadCategory(e.target.value as DocCategory)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                        >
                          {["Bill", "Invoice", "Receipt", "Insurance", "Tax", "Permit", "Inspection", "Lease", "Other"].map((c) => (
                            <option key={c} value={c} className="bg-[#111]">{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold block mb-1">Document Name</label>
                        <input
                          type="text"
                          value={uploadName}
                          onChange={(e) => setUploadName(e.target.value)}
                          placeholder="e.g. Plumbing receipt March 2026"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold block mb-1">Description (optional)</label>
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
                        onClick={() => {
                          const newDoc: PropertyDocument = {
                            id: `doc_upload_${Date.now()}`,
                            propertyId: unit?.propertyId ?? "",
                            category: uploadCategory,
                            name: uploadName || uploadFile || "Untitled",
                            description: uploadDesc || undefined,
                            uploadedAt: new Date().toISOString(),
                            fileType: uploadFile.split(".").pop() ?? "pdf",
                            fileSize: Math.floor(Math.random() * 500000) + 50000,
                          };
                          setUploadedDocs((prev) => [newDoc, ...prev]);
                          setUploadSuccess(true);
                          setTimeout(() => {
                            setShowUploadModal(false);
                            setUploadSuccess(false);
                            setUploadCategory("Receipt");
                            setUploadName("");
                            setUploadDesc("");
                            setUploadFile("");
                          }, 1500);
                        }}
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
    </div>
  );
}
