"use client";
import { useState } from "react";
import { useStore, money } from "@/lib/store";
import { Drawer, Field } from "./ui";
export default function OrderForm({ kind, onClose }) {
  const { d, createSale, createPO } = useStore();
  const sale = kind === "sale";
  const [party, setParty] = useState("");
  const [lines, setLines] = useState([{ itemId: d.items[0].id, qty: 1 }]);
  const [err, setErr] = useState("");
  const up = (i, k, v) =>
    setLines((l) => l.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const price = (id) => {
    const it = d.items.find((i) => i.id === id);
    return sale ? it.price : it.cost;
  };
  const sum = lines.reduce((s, l) => s + l.qty * price(l.itemId), 0);
  const save = () => {
    if (!party.trim())
      return setErr(sale ? "Enter a customer name." : "Enter a supplier name.");
    const ls = lines
      .filter((l) => l.qty > 0)
      .map((l) => ({ ...l, price: price(l.itemId) }));
    if (!ls.length) return setErr("Add at least one item.");
    const e = sale ? createSale(party.trim(), ls) : createPO(party.trim(), ls);
    if (e) return setErr(e);
    onClose();
  };
  return (
    <Drawer
      title={sale ? "New sales order" : "New purchase order"}
      onClose={onClose}
    >
      <Field label={sale ? "Customer" : "Supplier"}>
        <input
          className="inp"
          list="parties"
          value={party}
          onChange={(e) => setParty(e.target.value)}
          autoFocus
        />
        <datalist id="parties">
          {(sale ? d.customers : d.suppliers).map((p) => (
            <option key={p.id} value={p.name} />
          ))}
        </datalist>
      </Field>
      {lines.map((l, i) => (
        <div key={i} className="mb-3 flex gap-2">
          <select
            className="inp"
            value={l.itemId}
            onChange={(e) => up(i, "itemId", e.target.value)}
          >
            {d.items.map((it) => (
              <option key={it.id} value={it.id}>
                {it.name} · {it.godown} ({it.qty})
              </option>
            ))}
          </select>
          <input
            className="inp w-20"
            type="number"
            min="1"
            value={l.qty}
            onChange={(e) => up(i, "qty", +e.target.value)}
          />
          {lines.length > 1 && (
            <button
              onClick={() => setLines((x) => x.filter((_, j) => j !== i))}
              className="px-1 text-slate-400"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        className="btn2"
        onClick={() =>
          setLines((l) => [...l, { itemId: d.items[0].id, qty: 1 }])
        }
      >
        + Add item
      </button>
      <div className="mt-6 flex justify-between border-t pt-4 font-bold">
        <span>Total</span>
        <span>{money(sum)}</span>
      </div>
      {err && (
        <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {err}
        </p>
      )}
      <button className="btn mt-5 w-full justify-center" onClick={save}>
        {sale ? "Create invoice" : "Place order"}
      </button>
      <p className="mt-3 text-xs text-slate-400">
        {sale
          ? "Stock is reduced as soon as the invoice is created."
          : "Stock increases when you mark the order received."}
      </p>
    </Drawer>
  );
}
