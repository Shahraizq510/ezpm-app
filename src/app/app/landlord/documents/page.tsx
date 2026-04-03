"use client";

import { useState, useRef, useMemo } from "react";
import { TopBar } from "@/components/TopBar";
import { demo, type PropertyDocument, type DocCategory } from "@/lib/mockData";
import { fileSize } from "@/lib/ui";

const allCategories: DocCategory[] = [
  "Bill", "Invoice", "Receipt", "Insurance",
  "Tax", "Permit", "Inspection", "Lease", "Other",
];

const categoryColors: Record<string, string> = {
  Bill: "bg-cyan-500/20 text-cyan-300",
  Invoice: "bg-orange-500/20 text-orange-300",
  Receipt: "bg-green-500/20 text-green-300",
  Insurance: "bg-purple-500/20 text-purple-300",
  Tax: "bg-red-500/20 text-red-300",
  Permit: "bg-yellow-500/20 text-yellow-300",
  Inspection: "bg-blue-500/20 text-blue-300",
  Lease: "bg-pink-500/20 text-pink-300",
  Other: "bg-white/10 text-white/70",
};

function fileIcon(fileType: string) {
  if (fileType === "pdf") return "📄";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)) return "🖼️";
  return "📋";
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<PropertyDocument[]>(demo.getDocuments());
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);

  const properties = demo.properties;

  const filtered = useMemo(() => {
    let result = docs;
    if (propertyFilter !== "all") result = result.filter((d) => d.propertyId === propertyFilter);
    if (categoryFilter !== "all") result = result.filter((d) => d.category === categoryFilter);
    return result.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [docs, propertyFilter, categoryFilter]);

  const totalSize = docs.reduce((s, d) => s + d.fileSize, 0);
  const catCounts = docs.reduce<Record<string, number>>((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid gap-6">
      <TopBar title="Documents" />

      {/* Summary stats */}
      <div className="flex flex-wrap gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4">
          <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Total Documents</div>
          <div className="mt-1 text-2xl font-extrabold">{docs.length}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4">
          <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold">Total Storage</div>
          <div className="mt-1 text-2xl font-extrabold">{fileSize(totalSize)}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4 flex-1 min-w-[200px]">
          <div className="text-xs uppercase tracking-[0.18em] text-white/55 font-semibold mb-2">By Category</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(catCounts).map(([cat, count]) => (
              <span key={cat} className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${categoryColors[cat] ?? categoryColors.Other}`}>
                {cat} ({count})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filters + Upload button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap items-center">
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

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white ml-2"
          >
            <option value="all">All Categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/15 to-violet-500/15 px-5 py-3 font-extrabold text-sm hover:from-blue-500/25 hover:to-violet-500/25 transition"
        >
          + Upload Document
        </button>
      </div>

      {/* Document cards */}
      <div className="grid gap-2">
        {filtered.length === 0 && (
          <div className="text-center text-white/40 py-12">No documents found</div>
        )}
        {filtered.map((d) => {
          const prop = properties.find((p) => p.id === d.propertyId);
          return (
            <div key={d.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">{fileIcon(d.fileType)}</span>
                <div className="min-w-0">
                  <div className="font-bold truncate">{d.name}</div>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${categoryColors[d.category] ?? categoryColors.Other}`}>
                      {d.category}
                    </span>
                    <span className="text-xs text-white/50">{prop?.name}</span>
                    <span className="text-xs text-white/40">
                      {new Date(d.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="text-xs text-white/40">{fileSize(d.fileSize)}</span>
                  </div>
                  {d.description && <div className="text-xs text-white/40 mt-0.5">{d.description}</div>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/10 transition">
                  View
                </button>
                <button className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUpload={(doc) => {
            setDocs((prev) => [doc, ...prev]);
            setShowUpload(false);
          }}
        />
      )}
    </div>
  );
}

function UploadModal({ onClose, onUpload }: { onClose: () => void; onUpload: (doc: PropertyDocument) => void }) {
  const [propertyId, setPropertyId] = useState(demo.properties[0].id);
  const [category, setCategory] = useState<DocCategory>("Bill");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      if (!name) setName(f.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (!name) setName(f.name);
    }
  };

  const handleUpload = () => {
    const ext = file ? file.name.split(".").pop()?.toLowerCase() || "pdf" : "pdf";
    const doc: PropertyDocument = {
      id: `doc_new_${Date.now()}`,
      propertyId,
      category,
      name: name || file?.name || "Untitled",
      description: description || undefined,
      uploadedAt: new Date().toISOString(),
      fileType: ext,
      fileSize: file?.size || 0,
    };
    setSuccess(true);
    setTimeout(() => onUpload(doc), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0f] p-6 grid gap-4" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">✅</div>
            <div className="text-lg font-bold">Document uploaded!</div>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-extrabold">Upload Document</h2>

            {/* Drag & drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`rounded-2xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition ${
                dragOver ? "border-white/30 bg-white/[0.04]" : "border-white/20 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
              }`}
            >
              <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />
              {file ? (
                <div>
                  <div className="text-2xl mb-1">📄</div>
                  <div className="font-semibold text-sm">{file.name}</div>
                  <div className="text-xs text-white/40">{fileSize(file.size)}</div>
                </div>
              ) : (
                <div>
                  <div className="text-3xl mb-2">📁</div>
                  <div className="text-sm text-white/60">Drop files here or click to browse</div>
                </div>
              )}
            </div>

            {/* Fields */}
            <div className="grid gap-3">
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
              >
                {demo.properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocCategory)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
              >
                {allCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Document name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file && !name}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-extrabold hover:from-blue-400 hover:to-violet-400 transition disabled:opacity-40"
              >
                Upload
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
