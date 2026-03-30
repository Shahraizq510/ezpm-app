import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";

export default function LandlordLayout({ children }: { children: ReactNode }) {
  // For demo: we can’t get pathname in a server component without a hook,
  // so we pass a conservative base path. In a real app you’d highlight based on usePathname().
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
          <Sidebar activePath="/app/landlord" />
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
