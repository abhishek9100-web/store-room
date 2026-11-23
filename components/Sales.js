"use client";
import { useState } from "react";
import { useStore, money, total } from "@/lib/store";
import { Badge, Head, Table, Bar, Sel } from "./ui";
import OrderForm from "./OrderForm";
export default function Sales() {
  const { d, setSaleStatus, cancelSale } = useStore();
  const [q, setQ] = useState("");
  const [f, setF] = useState("All");
  const [open, setOpen] = useState(false);
  const rows = d.sales.filter(
    (s) =>
      (f === "All" || s.status === f) &&
      (s.id + s.customer).toLowerCase().includes(q.toLowerCase()),
  );
  const name = (id) => d.items.find((i) => i.id === id)?.name;
  return (
    <>
      <Head title="Sales" sub="Invoices and customer orders">
        <button className="btn" onClick={() => setOpen(true)}>
          + New order
        </button>
      </Head>
      <Bar q={q} set={setQ} ph="Search invoice or customer">
        <Sel v={f} set={setF} opts={["All", "Paid", "Pending"]} />
      </Bar>
      <Table
        cols={["Invoice", "Date", "Customer", "Items", "Amount", "Status", ""]}
      >
        {rows.map((s) => (
          <tr key={s.id}>
            <td className="font-semibold">{s.id}</td>
            <td>{s.date}</td>
            <td>{s.customer}</td>
            <td className="max-w-[220px] truncate text-slate-500">
              {s.lines.map((l) => `${l.qty}× ${name(l.itemId)}`).join(", ")}
            </td>
            <td className="font-semibold">{money(total(s))}</td>
            <td>
              <Badge s={s.status} />
            </td>
            <td>
              {s.status === "Pending" && (
                <button
                  className="btn2"
                  onClick={() => setSaleStatus(s.id, "Paid")}
                >
                  Mark paid
                </button>
              )}{" "}
              <button
                className="btn2"
                onClick={() =>
                  confirm("Cancel this invoice and return the stock?") &&
                  cancelSale(s.id)
                }
              >
                Cancel
              </button>
            </td>
          </tr>
        ))}
      </Table>
      {open && <OrderForm kind="sale" onClose={() => setOpen(false)} />}
    </>
  );
}
