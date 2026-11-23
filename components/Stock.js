"use client";
import { useState } from "react";
import { useStore, money, statusOf } from "@/lib/store";
import { Badge, Head, Table, Bar, Sel, Drawer, Field } from "./ui";
function Detail({ id, onClose }) {
  const { d, adjust, deleteItem } = useStore();
  const it = d.items.find((i) => i.id === id);
  const [n, setN] = useState(1);
  const [err, setErr] = useState("");
  const h = d.history.filter((x) => x.itemId === id);
  return (
    <Drawer title={it.name} onClose={onClose}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">
            {it.sku} · {it.godown}
          </p>
          <p className="text-3xl font-extrabold">
            {it.qty}{" "}
            <span className="text-sm font-medium text-slate-400">
              min {it.min}
            </span>
          </p>
        </div>
        <Badge s={statusOf(it)} />
      </div>
      <div className="mb-6 flex gap-2">
        <input
          className="inp w-24"
          type="number"
          min="1"
          value={n}
          onChange={(e) => setN(+e.target.value)}
        />
        <button
          className="btn2"
          onClick={() => setErr(adjust(id, n, "Manual add") || "")}
        >
          + Add
        </button>
        <button
          className="btn2"
          onClick={() => setErr(adjust(id, -n, "Manual remove") || "")}
        >
          − Remove
        </button>
      </div>
      {err && <p className="mb-4 text-sm text-rose-600">{err}</p>}
      <button
        className="mb-4 text-xs font-semibold text-rose-600"
        onClick={() =>
          confirm("Delete this item?") && (deleteItem(id), onClose())
        }
      >
        Delete item
      </button>
      <h3 className="mb-2 text-sm font-bold">Stock history</h3>
      {h.length ? (
        h.map((x) => (
          <div
            key={x.id}
            className="flex items-center justify-between border-b py-2.5 text-sm"
          >
            <div>
              <b>{x.ref}</b>
              <p className="text-xs text-slate-400">{x.date}</p>
            </div>
            <span
              className={
                x.type === "IN"
                  ? "font-bold text-emerald-600"
                  : "font-bold text-rose-600"
              }
            >
              {x.type === "IN" ? "+" : "−"}
              {x.qty}
            </span>
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-400">No movements yet.</p>
      )}
    </Drawer>
  );
}
export default function Stock() {
  const { d, addItem } = useStore();
  const [q, setQ] = useState("");
  const [st, setSt] = useState("All");
  const [g, setG] = useState("All godowns");
  const [sel, setSel] = useState(null);
  const [add, setAdd] = useState(false);
  const [nf, setNf] = useState({
    name: "",
    sku: "",
    category: "",
    qty: 0,
    min: 5,
    price: 0,
    cost: 0,
    godown: "Godown A",
  });
  const rows = d.items.filter(
    (i) =>
      (st === "All" || statusOf(i) === st) &&
      (g === "All godowns" || i.godown === g) &&
      (i.name + i.sku + i.category).toLowerCase().includes(q.toLowerCase()),
  );
  const set = (k) => (e) =>
    setNf({
      ...nf,
      [k]: e.target.type === "number" ? +e.target.value : e.target.value,
    });
  return (
    <>
      <Head title="Stock" sub="Items, levels and movement history">
        <button className="btn" onClick={() => setAdd(true)}>
          + Add item
        </button>
      </Head>
      <Bar q={q} set={setQ} ph="Search name, SKU, category">
        <Sel
          v={st}
          set={setSt}
          opts={["All", "In stock", "Low stock", "Out of stock"]}
        />
        <Sel
          v={g}
          set={setG}
          opts={["All godowns", "Godown A", "Godown B", "Godown C"]}
        />
      </Bar>
      <Table
        cols={["Item", "Category", "Godown", "Qty", "Min", "Value", "Status"]}
      >
        {rows.map((i) => (
          <tr
            key={i.id}
            className="cursor-pointer"
            onClick={() => setSel(i.id)}
          >
            <td>
              <b>{i.name}</b>
              <p className="text-xs text-slate-400">{i.sku}</p>
            </td>
            <td>{i.category}</td>
            <td>{i.godown}</td>
            <td className="font-bold">{i.qty}</td>
            <td>{i.min}</td>
            <td>{money(i.qty * i.cost)}</td>
            <td>
              <Badge s={statusOf(i)} />
            </td>
          </tr>
        ))}
      </Table>
      {sel && <Detail id={sel} onClose={() => setSel(null)} />}
      {add && (
        <Drawer title="Add item" onClose={() => setAdd(false)}>
          {[
            ["Name", "name"],
            ["SKU", "sku"],
            ["Category", "category"],
          ].map(([l, k]) => (
            <Field key={k} label={l}>
              <input className="inp" value={nf[k]} onChange={set(k)} />
            </Field>
          ))}
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Opening qty", "qty"],
              ["Minimum level", "min"],
              ["Sale price", "price"],
              ["Cost", "cost"],
            ].map(([l, k]) => (
              <Field key={k} label={l}>
                <input
                  className="inp"
                  type="number"
                  min="0"
                  value={nf[k]}
                  onChange={set(k)}
                />
              </Field>
            ))}
          </div>
          <Field label="Godown">
            <select className="inp" value={nf.godown} onChange={set("godown")}>
              {["Godown A", "Godown B", "Godown C"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <button
            className="btn w-full justify-center"
            disabled={!nf.name || !nf.sku}
            onClick={() => {
              addItem(nf);
              setAdd(false);
            }}
          >
            Save item
          </button>
        </Drawer>
      )}
    </>
  );
}
