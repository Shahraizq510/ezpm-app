"use client";

import { useState, useEffect } from "react";
import type { Unit } from "@/lib/mockData";

type VacantUnit = Unit & { propertyLabel?: string };

interface InviteTenantModalProps {
  open: boolean;
  onClose: () => void;
  vacantUnits: VacantUnit[];
}

function randomId(len = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < len; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export function InviteTenantModal({ open, onClose, vacantUnits }: InviteTenantModalProps) {
  const [unitId, setUnitId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [rent, setRent] = useState("");
  const [sent, setSent] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  // Animate in
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  // Reset form when opening
  useEffect(() => {
    if (open) {
      setUnitId("");
      setName("");
      setEmail("");
      setPhone("");
      setMoveIn("");
      setRent("");
      setSent(false);
      setInviteUrl("");
      setCopied(false);
    }
  }, [open]);

  if (!open) return null;

  const handleUnitChange = (id: string) => {
    setUnitId(id);
    // Could pre-fill rent based on unit — for now leave blank since vacant units have no lease
    setRent("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://ezpm.app/onboard/inv-${randomId()}`;
    setInviteUrl(url);
    setSent(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = inviteUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none transition-colors";
  const labelClass = "text-xs uppercase tracking-[0.18em] text-white/55 font-semibold";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl">
        {sent ? (
          /* Success State */
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-3xl">
              ✅
            </div>
            <h2 className="text-lg font-extrabold">Invite sent to {name}</h2>
            <p className="mt-1 text-sm text-white/55">The tenant can onboard using this link:</p>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-blue-400 break-all">
              {inviteUrl}
            </div>

            <div className="mt-4 flex gap-3 justify-center">
              <button
                onClick={handleCopy}
                className="rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/15 to-violet-500/15 px-4 py-2 text-sm font-semibold hover:from-blue-500/20 hover:to-violet-500/20 transition-colors"
              >
                {copied ? "Copied ✓" : "Copy Link"}
              </button>
              <button
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <>
            <h2 className="text-lg font-extrabold">Invite Tenant</h2>
            <p className="mt-1 text-sm text-white/55">Send an onboarding link to a new tenant.</p>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
              <div>
                <label className={labelClass}>Unit</label>
                <select
                  required
                  value={unitId}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  className={`${inputClass} mt-1`}
                >
                  <option value="" disabled>
                    Select a vacant unit…
                  </option>
                  {vacantUnits.map((u) => (
                    <option key={u.id} value={u.id} className="bg-[#111] text-white">
                      Unit {u.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Tenant Name</label>
                <input
                  required
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${inputClass} mt-1`}
                />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input
                  required
                  type="email"
                  placeholder="tenant@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputClass} mt-1`}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Phone <span className="text-white/30 normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${inputClass} mt-1`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Move-in Date</label>
                  <input
                    required
                    type="date"
                    value={moveIn}
                    onChange={(e) => setMoveIn(e.target.value)}
                    className={`${inputClass} mt-1`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Monthly Rent</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="2,000"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    className={`${inputClass} mt-1`}
                  />
                </div>
              </div>

              <div className="mt-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-violet-500/20 px-4 py-2 text-sm font-semibold hover:from-blue-500/25 hover:to-violet-500/25 transition-colors"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
