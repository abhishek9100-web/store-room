"use client";
import { useState } from "react";
import { useStore, money, total, statusOf } from "@/lib/store";
import { Head, Table, Bar } from "./ui";
export default function Reports() {
  const { d } = useStore();
  const [tab, setTab] = useState("Stock");
  const [q, setQ] = useState("");
  const name = (id) => d.items.find((i) => i.id === id)?.name;
  const lines = (o) =>
    o.lines.map((l) => `${l.qty}× ${name(l.itemId)}`).join("; ");
  const R = {
    Stock: {
      cols: [
        "Item",
        "SKU",
        "Godown",
        "Qty",
        "Cost value",
        "Retail value",
        "Status",
      ],
      rows: d.items.map((i) => [
        i.name,
        i.sku,
        i.godown,
        i.qty,
        money(i.qty * i.cost),
        money(i.qty * i.price),
        statusOf(i),
      ]),
    },
    Sales: {
      cols: ["Invoice", "Date", "Customer", "Items", "Amount", "Status"],
      rows: d.sales.map((s) => [
        s.id,
        s.date,
        s.customer,
        lines(s),
        money(total(s)),
        s.status,
      ]),
    },
    Purchase: {
      cols: ["PO", "Date", "Supplier", "Items", "Amount", "Status"],
      rows: d.purchases.map((s) => [
        s.id,
        s.date,
        s.supplier,
        lines(s),
        money(total(s)),
        s.status,
      ]),
    },
  }[tab];
  const rows = R.rows.filter((r) =>
    r.join(" ").toLowerCase().includes(q.toLowerCase()),
  );
  const csv = () => {
    const t = [R.cols, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([t], { type: "text/csv" }));
    a.download = tab.toLowerCase() + "-report.csv";
    a.click();
  };
  const sum =
    tab === "Sales"
      ? `Total billed ${money(d.sales.reduce((s, o) => s + total(o), 0))}`
      : tab === "Purchase"
        ? `Total ordered ${money(d.purchases.reduce((s, o) => s + total(o), 0))}`
        : `Stock at cost ${money(d.items.reduce((s, i) => s + i.qty * i.cost, 0))}`;
  return (
    <>
      <Head title="Reports" sub={sum}>
        <button className="btn" onClick={csv}>
          Export CSV
        </button>
      </Head>
      <div className="mb-4 inline-flex rounded-xl bg-white p-1 shadow-sm">
        {["Stock", "Sales", "Purchase"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setQ("");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === t ? "bg-ink text-white" : "text-slate-500"}`}
          >
            {t} report
          </button>
        ))}
      </div>
      <Bar q={q} set={setQ} />
      <Table cols={R.cols}>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j}>{c}</td>
            ))}
          </tr>
        ))}
      </Table>
    </>
  );
}
