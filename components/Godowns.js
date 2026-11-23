"use client";
import { useState } from "react";
import { useStore, money, statusOf } from "@/lib/store";
import { Badge, Head, Card, Table } from "./ui";
export default function Godowns() {
  const { d } = useStore();
  const G = ["Godown A", "Godown B", "Godown C"];
  const [sel, setSel] = useState(G[0]);
  const rows = d.items.filter((i) => i.godown === sel);
  return (
    <>
      <Head title="Godowns" sub="What each storage location holds" />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {G.map((g) => {
          const it = d.items.filter((i) => i.godown === g);
          return (
            <button key={g} onClick={() => setSel(g)} className="text-left">
              <Card
                className={`p-5 transition ${sel === g ? "border-amber ring-2 ring-amber/30" : "hover:border-slate-300"}`}
              >
                <p className="font-bold">{g}</p>
                <p className="mt-2 text-2xl font-extrabold">
                  {it.reduce((s, i) => s + i.qty, 0)}{" "}
                  <span className="text-sm font-medium text-slate-400">
                    units
                  </span>
                </p>
                <p className="text-xs text-slate-500">
                  {it.length} items ·{" "}
                  {money(it.reduce((s, i) => s + i.qty * i.cost, 0))} ·{" "}
                  {it.filter((i) => i.qty <= i.min).length} low
                </p>
              </Card>
            </button>
          );
        })}
      </div>
      <Table cols={["Item", "SKU", "Qty", "Min", "Status"]}>
        {rows.map((i) => (
          <tr key={i.id}>
            <td className="font-semibold">{i.name}</td>
            <td>{i.sku}</td>
            <td className="font-bold">{i.qty}</td>
            <td>{i.min}</td>
            <td>
              <Badge s={statusOf(i)} />
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
