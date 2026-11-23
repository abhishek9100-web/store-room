"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Head, Table, Bar, Drawer, Field } from "./ui";
export default function Transfers() {
  const { d, transfer } = useStore();
  const G = ["Godown A", "Godown B", "Godown C"];
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const avail = d.items.filter((i) => i.qty > 0);
  const [f, setF] = useState({ itemId: avail[0]?.id, to: "Godown B", qty: 1 });
  const [err, setErr] = useState("");
  const rows = d.transfers.filter((t) =>
    (t.id + t.name + t.from + t.to).toLowerCase().includes(q.toLowerCase()),
  );
  const go = () => {
    const e = transfer(f.itemId, f.to, f.qty);
    e ? setErr(e) : setOpen(false);
  };
  return (
    <>
      <Head title="Transfers" sub="Move stock between godowns">
        <button
          className="btn"
          onClick={() => {
            setErr("");
            setOpen(true);
          }}
        >
          + New transfer
        </button>
      </Head>
      <Bar q={q} set={setQ} ph="Search transfer, item or godown" />
      <Table cols={["Transfer", "Date", "Item", "From", "To", "Qty"]}>
        {rows.map((t) => (
          <tr key={t.id}>
            <td className="font-semibold">{t.id}</td>
            <td>{t.date}</td>
            <td>{t.name}</td>
            <td>{t.from}</td>
            <td>{t.to}</td>
            <td className="font-bold">{t.qty}</td>
          </tr>
        ))}
      </Table>
      {open && (
        <Drawer title="New transfer" onClose={() => setOpen(false)}>
          <Field label="Item">
            <select
              className="inp"
              value={f.itemId}
              onChange={(e) => setF({ ...f, itemId: e.target.value })}
            >
              {avail.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} · {i.godown} ({i.qty})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Move to">
            <select
              className="inp"
              value={f.to}
              onChange={(e) => setF({ ...f, to: e.target.value })}
            >
              {G.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field label="Quantity">
            <input
              className="inp"
              type="number"
              min="1"
              value={f.qty}
              onChange={(e) => setF({ ...f, qty: +e.target.value })}
            />
          </Field>
          {err && (
            <p className="mb-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
              {err}
            </p>
          )}
          <button className="btn w-full justify-center" onClick={go}>
            Move stock
          </button>
        </Drawer>
      )}
    </>
  );
}
