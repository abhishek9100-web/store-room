"use client";
import { useEffect } from "react";
const tone = {
  Paid: "emerald",
  Received: "emerald",
  "In stock": "emerald",
  Pending: "amber",
  "Low stock": "amber",
  "Out of stock": "rose",
  IN: "emerald",
  OUT: "rose",
};
const cls = {
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
};
export const Badge = ({ s }) => (
  <span
    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cls[tone[s] || "amber"]}`}
  >
    {s}
  </span>
);
export const Head = ({ title, sub, children }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
      <p className="text-sm text-slate-500">{sub}</p>
    </div>
    <div className="flex gap-2">{children}</div>
  </div>
);
export const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-slate-200/80 bg-white ${className}`}
  >
    {children}
  </div>
);
export const Table = ({ cols, children, empty }) => (
  <Card className="overflow-x-auto">
    <table className="w-full min-w-[640px]">
      <thead>
        <tr>
          {cols.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
    {!children?.length && (
      <p className="p-10 text-center text-sm text-slate-400">
        {empty || "Nothing matches your filters."}
      </p>
    )}
  </Card>
);
export const Bar = ({ q, set, children, ph = "Search…" }) => (
  <div className="mb-4 flex flex-wrap gap-2">
    <input
      className="inp max-w-xs"
      placeholder={ph}
      value={q}
      onChange={(e) => set(e.target.value)}
    />
    {children}
  </div>
);
export const Sel = ({ v, set, opts }) => (
  <select
    className="inp w-auto"
    value={v}
    onChange={(e) => set(e.target.value)}
  >
    {opts.map((o) => (
      <option key={o}>{o}</option>
    ))}
  </select>
);
export function Drawer({ title, onClose, children }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 animate-fade bg-ink/40"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-md animate-slideIn flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-xl text-slate-400 hover:text-slate-800"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
export const Field = ({ label, children }) => (
  <label className="mb-4 block text-xs font-semibold text-slate-500">
    {label}
    <div className="mt-1 text-sm font-normal text-slate-800">{children}</div>
  </label>
);
