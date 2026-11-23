"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StoreProvider, useStore } from "@/lib/store";
const NAV = [
  ["dashboard", "Dashboard", "▦"],
  ["sales", "Sales", "↗"],
  ["purchases", "Purchases", "↙"],
  ["stock", "Stock", "▤"],
  ["godowns", "Godowns", "⌂"],
  ["transfers", "Transfers", "⇄"],
  ["customers", "Customers", "☺"],
  ["suppliers", "Suppliers", "⚑"],
  ["reports", "Reports", "≣"],
];
function Frame({ children }) {
  const path = usePathname();
  const { ready, reset, d } = useStore();
  const low = d.items.filter((i) => i.qty <= i.min).length;
  if (!ready) return null;
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex shrink-0 flex-row items-center gap-1 bg-ink p-3 text-white md:sticky md:top-0 md:h-screen md:w-60 md:flex-col md:items-stretch md:p-5">
        <div className="mr-3 flex items-center gap-2 md:mb-8">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber font-black text-ink">
            S
          </span>
          <b className="hidden text-lg sm:block">Stockroom</b>
        </div>
        <nav className="flex flex-1 gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {NAV.map(([r, n, ic]) => (
            <Link
              key={r}
              href={"/" + r}
              className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition ${path.startsWith("/" + r) ? "bg-white/15" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
            >
              <span className="w-5 text-center">{ic}</span>
              {n}
              {r === "stock" && low > 0 && (
                <span className="ml-auto rounded-full bg-amber px-2 text-xs font-bold text-ink">
                  {low}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <button
          onClick={() =>
            confirm("Reset all data to the sample set?") && reset()
          }
          className="hidden text-left text-xs text-white/40 hover:text-white md:block"
        >
          Reset sample data
        </button>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div key={path} className="animate-view">
          {children}
        </div>
      </main>
    </div>
  );
}
export default function Shell({ children }) {
  return (
    <StoreProvider>
      <Frame>{children}</Frame>
    </StoreProvider>
  );
}
