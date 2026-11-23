"use client";
import { useStore, money, total, statusOf } from "@/lib/store";
import Link from "next/link";
import { Badge, Head, Card } from "./ui";
export default function Dashboard() {
  const { d, receivePO } = useStore();
  const low = d.items
    .filter((i) => i.qty <= i.min)
    .sort((a, b) => a.qty - b.qty);
  const val = d.items.reduce((s, i) => s + i.qty * i.cost, 0);
  const rev = d.sales.reduce((s, o) => s + total(o), 0);
  const pend = d.purchases.filter((p) => p.status === "Pending");
  const name = (id) => d.items.find((i) => i.id === id)?.name;
  const cats = Object.entries(
    d.items.reduce(
      (a, i) => ({ ...a, [i.category]: (a[i.category] || 0) + i.qty * i.cost }),
      {},
    ),
  );
  const mx = Math.max(...cats.map((c) => c[1]));
  const S = [
    ["Stock value", money(val), d.items.length + " items"],
    [
      "Sales",
      money(rev),
      d.sales.filter((s) => s.status === "Pending").length + " unpaid",
    ],
    ["Open purchases", pend.length, "awaiting delivery"],
    ["Needs restock", low.length, "at or below minimum"],
  ];
  return (
    <>
      <Head title="Dashboard" sub="Where your inventory stands today" />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {S.map(([l, v, s], i) => (
          <Card
            key={l}
            className={`p-5 ${i === 3 && low.length ? "border-amber bg-amber/10" : ""}`}
          >
            <p className="text-xs font-semibold text-slate-500">{l}</p>
            <p className="mt-2 text-2xl font-extrabold">{v}</p>
            <p className="text-xs text-slate-400">{s}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <h2 className="mb-3 font-bold">Low stock alerts</h2>
          {low.length ? (
            low.map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between border-t py-3 text-sm"
              >
                <div>
                  <b>{i.name}</b>
                  <p className="text-xs text-slate-400">
                    {i.godown} · min {i.min}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{i.qty}</span>
                  <Badge s={statusOf(i)} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              Everything is above its minimum level.
            </p>
          )}
          <Link href="/purchases" className="btn2 mt-2 inline-block">
            Go to purchases
          </Link>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-3 font-bold">Pending deliveries</h2>
          {pend.length ? (
            pend.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border-t py-3 text-sm"
              >
                <div>
                  <b>{p.id}</b>
                  <p className="text-xs text-slate-400">
                    {p.supplier} · {name(p.lines[0].itemId)}
                  </p>
                </div>
                <button className="btn2" onClick={() => receivePO(p.id)}>
                  Receive
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">No deliveries pending.</p>
          )}
        </Card>
        <Card className="p-5 lg:col-span-3">
          <h2 className="mb-3 font-bold">Recent activity</h2>
          {d.history.slice(0, 7).map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between border-t py-2.5 text-sm"
            >
              <div>
                <b>{name(h.itemId)}</b>
                <p className="text-xs text-slate-400">
                  {h.ref} · {h.date}
                </p>
              </div>
              <span
                className={
                  h.type === "IN"
                    ? "font-bold text-emerald-600"
                    : "font-bold text-rose-600"
                }
              >
                {h.type === "IN" ? "+" : "−"}
                {h.qty}
              </span>
            </div>
          ))}
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 font-bold">Stock value by category</h2>
          {cats.map(([c, v]) => (
            <div key={c} className="mb-3">
              <div className="mb-1 flex justify-between text-xs">
                <span>{c}</span>
                <span className="text-slate-500">{money(v)}</span>
              </div>
              <div className="h-2 rounded bg-slate-100">
                <div
                  className="h-2 rounded bg-ink transition-all duration-700"
                  style={{ width: (v / mx) * 100 + "%" }}
                />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
