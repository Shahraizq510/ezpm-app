"use client";

import { useState, useRef } from "react";
import { TopBar } from "@/components/TopBar";
import { demo, type Expense } from "@/lib/mockData";
import { money, fileSize } from "@/lib/ui";

const categoryColors: Record<string, string> = {
  Mortgage: "bg-blue-500/20 text-blue-300",
  Insurance: "bg-purple-500/20 text-purple-300",
  Repairs: "bg-orange-500/20 text-orange-300",
  Utilities: "bg-cyan-500/20 text-cyan-300",
  "Property Tax": "bg-red-500/20 text-red-300",
  HOA: "bg-pink-500/20 text-pink-300",
  Management: "bg-green-500/20 text-green-300",
  Other: "bg-white/10 text-white/70",
};

export default function ExpensesPage() {
  const [attachedIds, setAttachedIds] = useState<Set<string>>(() => {
    // Pre-mark expenses that already have receipts
    const ids = new Set<string>();
    demo.getExpenses().forEach((e) => {
      if (e.receiptUrl) ids.add(e.id);
    });
    return ids;
  });
  const [attachingId, setAttachingId] = useState<string | null>(null);
  const [propertyFilter, setPropertyFilter] = useState("all");

  const allExpenses = demo.getExpenses();
  const properties = demo.properties;

  const expenses = (propertyFilter === "all" ? allExpenses : allExpenses.filter((e) => e.propertyId === propertyFilter))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="grid gap-6">
      <TopBar title="Expenses" />

      {/* Summary + Add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4">
          <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">
            Total Expenses
          </div>
          <div className="mt-1 text-2xl font-extrabold">{money(totalExpenses)}</div>
          <div className="text-xs text-white/50 mt-1">
            {expenses.length} transactions • {propertyFilter === "all" ? "All properties" : properties.find((p) => p.id === propertyFilter)?.name}
          </div>
        </div>

        <button className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/15 to-violet-500/15 px-5 py-3 font-extrabold text-sm hover:from-blue-500/25 hover:to-violet-500/25 transition">
          + Add Expense
        </button>
      </div>

      {/* Property filter pills */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setPropertyFilter("all")}
          className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
            propertyFilter === "all" ? "bg-white/10 border border-white/20" : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          All Properties
        </button>
        {properties.map((p) => (
          <button
            key={p.id}
            onClick={() => setPropertyFilter(p.id)}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
              propertyFilter === p.id ? "bg-white/10 border border-white/20" : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Expense cards */}
      <div className="grid gap-2">
        {expenses.map((e) => {
          const prop = properties.find((p) => p.id === e.propertyId);
          const hasReceipt = attachedIds.has(e.id);
          return (
            <div
              key={e.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`shrink-0 rounded-lg px-2 py-1 text-xs font-semibold ${
                    categoryColors[e.category] ?? categoryColors.Other
                  }`}
                >
                  {e.category}
                </span>
                <div className="min-w-0">
                  <div className="font-bold truncate">
                    {e.description}
                    {hasReceipt && (
                      <span className="ml-2 text-white/40" title="Receipt attached">
                        📎
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-white/50">
                    {prop?.name} •{" "}
                    {new Date(e.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {e.recurring && (
                      <span className="ml-2 text-blue-400/70">↻ Recurring</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {hasReceipt ? (
                  <span className="text-green-400 text-sm" title="Receipt attached">✅</span>
                ) : (
                  <button
                    onClick={() => setAttachingId(e.id)}
                    className="rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-sm hover:bg-white/10 transition"
                    title="Attach receipt"
                  >
                    📎
                  </button>
                )}
                <div className="text-right">
                  <div className="font-extrabold">{money(e.amount)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini attach modal */}
      {attachingId && (
        <AttachModal
          expense={allExpenses.find((e) => e.id === attachingId)!}
          onClose={() => setAttachingId(null)}
          onAttach={() => {
            setAttachedIds((prev) => new Set(prev).add(attachingId));
            setAttachingId(null);
          }}
        />
      )}
    </div>
  );
}

function AttachModal({ expense, onClose, onAttach }: { expense: Expense; onClose: () => void; onAttach: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const prop = demo.properties.find((p) => p.id === expense.propertyId);

  const handleAttach = () => {
    setSuccess(true);
    setTimeout(onAttach, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0a0f] p-6 grid gap-4" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">✅</div>
            <div className="font-bold text-sm">Receipt attached!</div>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-extrabold">Attach Receipt</h2>
            <div className="text-xs text-white/50">
              {expense.description} • {prop?.name} • Receipt
            </div>

            <input ref={fileRef} type="file" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-xl border border-dashed border-white/20 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04] px-4 py-6 text-center transition"
            >
              {file ? (
                <div>
                  <div className="font-semibold text-sm">📄 {file.name}</div>
                  <div className="text-xs text-white/40">{fileSize(file.size)}</div>
                </div>
              ) : (
                <div className="text-sm text-white/50">Click to select file</div>
              )}
            </button>

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition">
                Cancel
              </button>
              <button
                onClick={handleAttach}
                disabled={!file}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-extrabold hover:from-blue-400 hover:to-violet-400 transition disabled:opacity-40"
              >
                Attach
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
