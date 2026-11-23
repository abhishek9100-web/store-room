"use client";
import { useState } from "react";
import { useStore, money, total } from "@/lib/store";
import { Head, Table, Bar, Drawer, Field } from "./ui";
function Parties({ kind }) {
  const { d, addParty } = useStore();
  const cust = kind === "customers";
  const label = cust ? "Customer" : "Supplier";
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", city: "", phone: "" });
  const orders = cust ? d.sales : d.purchases;
  const key = cust ? "customer" : "supplier";
  const open_ = cust ? "Pending" : "Pending";
  const rows = d[kind].filter((p) =>
    (p.name + p.city + p.phone).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <Head
        title={label + "s"}
        sub={
          cust
            ? "Who you sell to and what they owe"
            : "Who you buy from and what is on order"
        }
      >
        <button className="btn" onClick={() => setOpen(true)}>
          + Add {label.toLowerCase()}
        </button>
      </Head>
      <Bar q={q} set={setQ} ph="Search name, city or phone" />
      <Table
        cols={[
          label,
          "City",
          "Phone",
          "Orders",
          "Total",
          cust ? "Outstanding" : "On order",
        ]}
      >
        {rows.map((p) => {
          const o = orders.filter((x) => x[key] === p.name);
          const pend = o.filter((x) => x.status === open_);
          return (
            <tr key={p.id}>
              <td className="font-semibold">{p.name}</td>
              <td>{p.city}</td>
              <td>{p.phone}</td>
              <td>{o.length}</td>
              <td>{money(o.reduce((s, x) => s + total(x), 0))}</td>
              <td
                className={
                  pend.length ? "font-bold text-amber-dark" : "text-slate-400"
                }
              >
                {money(pend.reduce((s, x) => s + total(x), 0))}
              </td>
            </tr>
          );
        })}
      </Table>
      {open && (
        <Drawer
          title={"Add " + label.toLowerCase()}
          onClose={() => setOpen(false)}
        >
          {[
            ["Name", "name"],
            ["City", "city"],
            ["Phone", "phone"],
          ].map(([l, k]) => (
            <Field key={k} label={l}>
              <input
                className="inp"
                value={f[k]}
                onChange={(e) => setF({ ...f, [k]: e.target.value })}
              />
            </Field>
          ))}
          <button
            className="btn w-full justify-center"
            disabled={!f.name.trim()}
            onClick={() => {
              addParty(kind, f);
              setOpen(false);
            }}
          >
            Save {label.toLowerCase()}
          </button>
        </Drawer>
      )}
    </>
  );
}
export const Customers = () => <Parties kind="customers" />;
export const Suppliers = () => <Parties kind="suppliers" />;
