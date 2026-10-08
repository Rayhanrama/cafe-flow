"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { useStore } from "@/context/store-context";
import { MENU, STOCK } from "@/lib/mock-data";
import { formatClock, formatRupiah, sumLines } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

type Tab = "penjualan" | "menu" | "stok";

export default function AdminPage() {
  const { orders } = useStore();
  const [tab, setTab] = useState<Tab>("penjualan");
  const [menu, setMenu] = useState<MenuItem[]>(MENU);

  const paid = orders.filter((order) => order.status === "dibayar");
  const revenue = paid.reduce((sum, order) => sum + sumLines(order.lines), 0);
  const itemCount = paid.reduce(
    (sum, order) => sum + order.lines.reduce((n, line) => n + line.qty, 0),
    0,
  );
  const ticketAvg = paid.length ? Math.round(revenue / paid.length) : 0;

  const bestSeller = useMemo(() => {
    const tally = new Map<string, number>();
    for (const order of orders) {
      for (const line of order.lines) {
        tally.set(line.name, (tally.get(line.name) ?? 0) + line.qty);
      }
    }
    return [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
  }, [orders]);

  function toggleAvailability(id: string) {
    setMenu((current) =>
      current.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item,
      ),
    );
  }

  return (
    <main className="mx-auto max-w-6xl pb-[var(--space-3xl)]">
      <header className="flex flex-col gap-[var(--space-md)] py-[clamp(1.5rem,4vw,3rem)] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label">Admin · Warung Kopi Nusa</p>
          <h1 className="mt-[var(--space-xs)] text-display-s">
            Panel harian
          </h1>
        </div>
        <Link
          href="/pos"
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-rule-2)] px-[var(--space-md)] text-sm font-semibold hover:bg-[var(--color-paper-2)]"
        >
          Buka kasir
        </Link>
      </header>

      <hr className="rule" />

      {/* Stat strip: figures sit on the baseline, each with its own label.
          No invented growth arrows — only what the mock orders actually show. */}
      <dl className="grid grid-cols-2 gap-[var(--space-lg)] py-[var(--space-xl)] sm:grid-cols-4">
        <Stat label="Pendapatan lunas" value={formatRupiah(revenue)} />
        <Stat label="Transaksi lunas" value={String(paid.length)} />
        <Stat label="Item terjual" value={String(itemCount)} />
        <Stat label="Rata-rata / struk" value={formatRupiah(ticketAvg)} />
      </dl>

      <div
        role="tablist"
        aria-label="Bagian admin"
        className="flex gap-[var(--space-xs)] border-b border-[var(--color-rule)]"
      >
        {(
          [
            ["penjualan", "Penjualan"],
            ["menu", "Menu"],
            ["stok", "Stok bahan"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={[
              "min-h-11 border-b-2 px-[var(--space-md)] text-sm font-semibold transition-colors",
              tab === id
                ? "border-[var(--color-accent)] text-[var(--color-ink)]"
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="pt-[var(--space-xl)]">
        {tab === "penjualan" ? (
          <section className="flex flex-col gap-[var(--space-lg)]">
            {bestSeller ? (
              <p className="max-w-[52ch] text-sm text-[var(--color-muted)]">
                Paling sering dipesan sesi ini:{" "}
                <span className="font-semibold text-[var(--color-ink)]">
                  {bestSeller[0]}
                </span>{" "}
                sebanyak <span className="tnum">{bestSeller[1]}</span> porsi.
              </p>
            ) : null}
            <TransactionsTable orders={orders} />
          </section>
        ) : null}

        {tab === "menu" ? (
          <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-rule)]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[var(--color-paper-2)] text-left">
                  <th className="px-[var(--space-md)] py-[var(--space-sm)] font-semibold">
                    Item
                  </th>
                  <th className="px-[var(--space-md)] py-[var(--space-sm)] font-semibold">
                    Harga
                  </th>
                  <th className="px-[var(--space-md)] py-[var(--space-sm)] font-semibold">
                    Status
                  </th>
                  <th className="px-[var(--space-md)] py-[var(--space-sm)] text-right font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {menu.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[var(--color-rule)]"
                  >
                    <td className="px-[var(--space-md)] py-[var(--space-sm)]">
                      <span className="font-semibold">{item.name}</span>
                      <span className="block text-[var(--color-muted)]">
                        {item.note}
                      </span>
                    </td>
                    <td className="tnum px-[var(--space-md)] py-[var(--space-sm)]">
                      {formatRupiah(item.price)}
                    </td>
                    <td className="px-[var(--space-md)] py-[var(--space-sm)]">
                      <span
                        className={
                          item.available
                            ? "font-semibold text-[var(--color-ok)]"
                            : "font-semibold text-[var(--color-danger)]"
                        }
                      >
                        {item.available ? "Tersedia" : "Habis"}
                      </span>
                    </td>
                    <td className="px-[var(--space-md)] py-[var(--space-sm)] text-right">
                      <Button
                        variant="outline"
                        tone="ink"
                        onClick={() => toggleAvailability(item.id)}
                      >
                        {item.available ? "Set habis" : "Set tersedia"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}

        {tab === "stok" ? (
          <section className="flex flex-col gap-[var(--space-md)]">
            {STOCK.map((item) => {
              const low = item.level <= item.reorderAt;
              return (
                <div
                  key={item.id}
                  className="grid items-center gap-[var(--space-sm)] rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-[var(--space-md)] sm:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-[var(--space-sm)]">
                      <span className="text-sm font-semibold">{item.name}</span>
                      <span className="tnum text-sm text-[var(--color-muted)]">
                        {item.level}% · {item.unit}
                      </span>
                    </div>
                    {/* Bar scale: neutral track, accent fill; low stock swaps
                        to the danger hue and carries a text label too. */}
                    <div className="mt-[var(--space-xs)] h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-paper-2)]">
                      <div
                        className={[
                          "h-full rounded-full",
                          low
                            ? "bg-[var(--color-danger)]"
                            : "bg-[var(--color-accent)]",
                        ].join(" ")}
                        style={{ width: `${item.level}%` }}
                      />
                    </div>
                  </div>
                  <span
                    className={[
                      "justify-self-start rounded-[var(--radius-sm)] border px-[var(--space-xs)] py-[var(--space-3xs)] text-xs font-semibold uppercase tracking-[0.08em] sm:justify-self-end",
                      low
                        ? "border-[var(--color-danger)] text-[var(--color-danger)]"
                        : "border-[var(--color-rule-2)] text-[var(--color-muted)]",
                    ].join(" ")}
                  >
                    {low ? "Perlu restock" : "Aman"}
                  </span>
                </div>
              );
            })}
          </section>
        ) : null}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className="tnum mt-[var(--space-2xs)] text-xl font-semibold">
        {value}
      </dd>
    </div>
  );
}

function TransactionsTable({
  orders,
}: {
  orders: ReturnType<typeof useStore>["orders"];
}) {
  // Collapses to stacked cards on phone widths via a duplicate mobile list.
  return (
    <>
      <ul className="flex flex-col gap-[var(--space-sm)] sm:hidden">
        {orders.map((order) => (
          <li
            key={order.id}
            className="rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-[var(--space-md)]"
          >
            <div className="flex items-center justify-between gap-[var(--space-sm)]">
              <span className="tnum font-semibold">{order.id}</span>
              <span className="tnum font-semibold">
                {formatRupiah(sumLines(order.lines))}
              </span>
            </div>
            <div className="mt-[var(--space-xs)] flex items-center justify-between gap-[var(--space-sm)]">
              <span className="text-sm text-[var(--color-muted)]">
                Meja {order.table} · {order.guest} ·{" "}
                <span className="tnum">{formatClock(order.placedAt)}</span>
              </span>
              <StatusPill status={order.status} />
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-rule)] sm:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--color-paper-2)] text-left">
              <th className="px-[var(--space-md)] py-[var(--space-sm)] font-semibold">
                No. pesanan
              </th>
              <th className="px-[var(--space-md)] py-[var(--space-sm)] font-semibold">
                Waktu
              </th>
              <th className="px-[var(--space-md)] py-[var(--space-sm)] font-semibold">
                Meja
              </th>
              <th className="px-[var(--space-md)] py-[var(--space-sm)] font-semibold">
                Tamu
              </th>
              <th className="px-[var(--space-md)] py-[var(--space-sm)] text-right font-semibold">
                Total
              </th>
              <th className="px-[var(--space-md)] py-[var(--space-sm)] font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-[var(--color-rule)]"
              >
                <td className="tnum px-[var(--space-md)] py-[var(--space-sm)] font-semibold">
                  {order.id}
                </td>
                <td className="tnum px-[var(--space-md)] py-[var(--space-sm)] text-[var(--color-muted)]">
                  {formatClock(order.placedAt)}
                </td>
                <td className="tnum px-[var(--space-md)] py-[var(--space-sm)]">
                  {order.table}
                </td>
                <td className="px-[var(--space-md)] py-[var(--space-sm)]">
                  {order.guest}
                </td>
                <td className="tnum px-[var(--space-md)] py-[var(--space-sm)] text-right font-semibold">
                  {formatRupiah(sumLines(order.lines))}
                </td>
                <td className="px-[var(--space-md)] py-[var(--space-sm)]">
                  <StatusPill status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
