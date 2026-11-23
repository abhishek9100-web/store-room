"use client";
import { createContext, useContext, useEffect, useState } from "react";
import seed from "@/data/seed.json";
const Ctx = createContext();
const KEY = "stockroom-v2";
export const useStore = () => useContext(Ctx);
export const money = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
export const total = (o) => o.lines.reduce((s, l) => s + l.qty * l.price, 0);
export const statusOf = (i) =>
  i.qty === 0 ? "Out of stock" : i.qty <= i.min ? "Low stock" : "In stock";
const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 7).toUpperCase();
const mv = (d, lines, type, ref) => ({
  ...d,
  items: d.items.map((i) => {
    const l = lines.find((x) => x.itemId === i.id);
    return l ? { ...i, qty: i.qty + (type === "IN" ? l.qty : -l.qty) } : i;
  }),
  history: [
    ...lines.map((l) => ({
      id: "H" + uid(),
      date: today(),
      itemId: l.itemId,
      type,
      qty: l.qty,
      ref,
    })),
    ...d.history,
  ],
});
const next = (arr, p) =>
  p + (Math.max(1000, ...arr.map((o) => +o.id.split("-")[1])) + 1);
export function StoreProvider({ children }) {
  const [d, setD] = useState(seed);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setD({ ...seed, ...JSON.parse(s) });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(KEY, JSON.stringify(d));
      } catch {}
  }, [d, ready]);
  const api = {
    d,
    ready,
    reset: () => setD(seed),
    // A sale reduces stock immediately; blocked if stock is short.
    createSale(customer, lines) {
      for (const l of lines) {
        const it = d.items.find((i) => i.id === l.itemId);
        if (it.qty < l.qty) return `Only ${it.qty} of ${it.name} in stock.`;
      }
      const id = next(d.sales, "INV-");
      setD((p) =>
        mv(
          {
            ...p,
            sales: [
              { id, date: today(), customer, status: "Pending", lines },
              ...p.sales,
            ],
          },
          lines,
          "OUT",
          id,
        ),
      );
    },
    setSaleStatus: (id, status) =>
      setD((p) => ({
        ...p,
        sales: p.sales.map((s) => (s.id === id ? { ...s, status } : s)),
      })),
    createPO(supplier, lines) {
      const id = next(d.purchases, "PO-");
      setD((p) => ({
        ...p,
        purchases: [
          { id, date: today(), supplier, status: "Pending", lines },
          ...p.purchases,
        ],
      }));
    },
    // Receiving a purchase order increases stock.
    receivePO(id) {
      setD((p) => {
        const po = p.purchases.find((x) => x.id === id);
        if (!po || po.status === "Received") return p;
        return mv(
          {
            ...p,
            purchases: p.purchases.map((x) =>
              x.id === id ? { ...x, status: "Received" } : x,
            ),
          },
          po.lines,
          "IN",
          id,
        );
      });
    },
    cancelSale: (id) =>
      setD((p) => {
        const s = p.sales.find((x) => x.id === id);
        return mv(
          { ...p, sales: p.sales.filter((x) => x.id !== id) },
          s.lines,
          "IN",
          "Cancelled " + id,
        );
      }),
    cancelPO: (id) =>
      setD((p) => ({
        ...p,
        purchases: p.purchases.filter(
          (x) => x.id !== id || x.status === "Received",
        ),
      })),
    deleteItem: (id) =>
      setD((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) })),
    addParty: (kind, x) =>
      setD((p) => ({
        ...p,
        [kind]: [{ ...x, id: kind[0].toUpperCase() + uid() }, ...p[kind]],
      })),
    // Transfer moves qty between godowns; merges into the same SKU there or creates it.
    transfer(itemId, to, qty) {
      const it = d.items.find((i) => i.id === itemId);
      if (to === it.godown) return "Pick a different godown.";
      if (!(qty >= 1 && qty <= it.qty))
        return `Only ${it.qty} available to move.`;
      const id = next(d.transfers, "TRF-");
      setD((p) => {
        let items = p.items.map((i) =>
          i.id === itemId ? { ...i, qty: i.qty - qty } : i,
        );
        const t = items.find((i) => i.sku === it.sku && i.godown === to);
        const dest = t ? t.id : "I" + uid();
        items = t
          ? items.map((i) => (i.id === t.id ? { ...i, qty: i.qty + qty } : i))
          : [...items, { ...it, id: dest, qty, godown: to }];
        const h = (type, iid) => ({
          id: "H" + uid(),
          date: today(),
          itemId: iid,
          type,
          qty,
          ref: id,
        });
        return {
          ...p,
          items,
          transfers: [
            { id, date: today(), name: it.name, from: it.godown, to, qty },
            ...p.transfers,
          ],
          history: [h("IN", dest), h("OUT", itemId), ...p.history],
        };
      });
    },
    addItem: (it) =>
      setD((p) => ({ ...p, items: [{ ...it, id: "I" + uid() }, ...p.items] })),
    adjust(itemId, delta, note) {
      const it = d.items.find((i) => i.id === itemId);
      if (it.qty + delta < 0) return "Stock can't go below zero.";
      setD((p) =>
        mv(
          p,
          [{ itemId, qty: Math.abs(delta) }],
          delta > 0 ? "IN" : "OUT",
          note || "Adjustment",
        ),
      );
    },
  };
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
