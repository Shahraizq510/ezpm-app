export function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

export function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const s = Math.max(1, Math.floor((Date.now() - d) / 1000));
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const day = Math.floor(h / 24);
  if (day > 0) return `${day}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return `${s}s ago`;
}
