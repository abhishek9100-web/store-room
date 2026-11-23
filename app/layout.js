import "./globals.css";
import Shell from "@/components/Shell";
import { Manrope } from "next/font/google";
const f = Manrope({ subsets: ["latin"], variable: "--f" });
export const metadata = { title: "Stockroom — Inventory" };
export default function L({ children }) {
  return (
    <html lang="en" className={f.variable}>
      <body className="font-sans">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
