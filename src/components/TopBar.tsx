export function TopBar({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-white/55 font-semibold">
          Landlord
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10">
          Notifications
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-600" />
          <div className="leading-tight">
            <div className="text-sm font-semibold">Demo Account</div>
            <div className="text-xs text-white/60">owner@ezpm.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
