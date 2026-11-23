"use client";
import { useState } from "react";
import { useStore, money, total } from "@/lib/store";
import { Badge, Head, Table, Bar, Sel } from "./ui";
import OrderForm from "./OrderForm";
export default function Purchases() {
  const { d, receivePO, cancelPO } = useStore();
  const [q, setQ] = useState("");
  const [f, setF] = useState("All");
  const [open, setOpen] = useState(false);
  const rows = d.purchases.filter(
    (s) =>
      (f === "All" || s.status === f) &&
      (s.id + s.supplier).toLowerCase().includes(q.toLowerCase()),
  );
  const name = (id) => d.items.find((i) => i.id === id)?.name;
  return (
    <>
      <Head title="Purchases" sub="Purchase orders and receiving">
        <button className="btn" onClick={() => setOpen(true)}>
          + New purchase order
        </button>
      </Head>
      <Bar q={q} set={setQ} ph="Search PO or supplier">
        <Sel v={f} set={setF} opts={["All", "Pending", "Received"]} />
      </Bar>
      <Table cols={["PO", "Date", "Supplier", "Items", "Amount", "Status", ""]}>
        {rows.map((s) => (
          <tr key={s.id}>
            <td className="font-semibold">{s.id}</td>
            <td>{s.date}</td>
            <td>{s.supplier}</td>
            <td className="max-w-[220px] truncate text-slate-500">
              {s.lines.map((l) => `${l.qty}× ${name(l.itemId)}`).join(", ")}
            </td>
            <td className="font-semibold">{money(total(s))}</td>
            <td>
              <Badge s={s.status} />
            </td>
            <td>
              {s.status === "Pending" && (
                <button className="btn2" onClick={() => receivePO(s.id)}>
                  Mark received
                </button>
              )}{" "}
              {s.status === "Pending" && (
                <button
                  className="btn2"
                  onClick={() =>
                    confirm("Cancel this order?") && cancelPO(s.id)
                  }
                >
                  Cancel
                </button>
              )}
            </td>
          </tr>
        ))}
      </Table>
      {open && <OrderForm kind="po" onClose={() => setOpen(false)} />}
    </>
  );
}
