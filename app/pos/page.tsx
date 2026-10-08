"use client";

import { useState } from "react";
import Link from "next/link";
import { PaymentDialog, OrderTicket, useQueue } from "@/components/pos/order-ticket";
import { useStore } from "@/context/store-context";
import { TABLES } from "@/lib/mock-data";
import { formatRupiah, sumLines } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function PosPage() {
  const { advance, settle } = useStore();
  const { active, ready, settled } = useQueue();
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);

  const todayTotal = settled.reduce(
    (sum, order) => sum + sumLines(order.lines),
    0,
  );

  return (
    <main className="mx-auto max-w-6xl pb-[var(--space-3xl)]">
      <header className="flex flex-col gap-[var(--space-md)] py-[clamp(1.5rem,4vw,3rem)] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label">Kasir · Shift pagi</p>
          <h1 className="mt-[var(--space-xs)] text-display-s">Antrian hari ini</h1>
        </div>
        <dl className="flex gap-[var(--space-xl)]">
          <div>
            <dt className="label">Order aktif</dt>
            <dd className="tnum text-lg font-semibold">
              {active.length + ready.length}
            </dd>
          </div>
          <div>
            <dt className="label">Sudah dibayar</dt>
            <dd className="tnum text-lg font-semibold">
              {formatRupiah(todayTotal)}
            </dd>
          </div>
        </dl>
      </header>

      <hr className="rule" />

      {/* Asymmetric split: queue is the wide working column, the meja rail is
          the narrow reference column. */}
      <div className="mt-[var(--space-xl)] grid gap-[var(--space-xl)] lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-[var(--space-xl)]">
          <section className="flex flex-col gap-[var(--space-md)]">
            <h2 className="text-2xl">
              Perlu ditindak{" "}
              <span className="tnum text-base text-[var(--color-muted)]">
                ({active.length})
              </span>
            </h2>
            {active.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">
                Tidak ada pesanan baru. Semua sudah ditangani.
              </p>
            ) : (
              <div className="grid gap-[var(--space-md)] sm:grid-cols-2">
                {active.map((order) => (
                  <OrderTicket
                    key={order.id}
                    order={order}
                    onAdvance={advance}
                    onOpenPayment={setPayingOrder}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-[var(--space-md)]">
            <h2 className="text-2xl">
              Siap diantar{" "}
              <span className="tnum text-base text-[var(--color-muted)]">
                ({ready.length})
              </span>
            </h2>
            {ready.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">
                Belum ada yang siap.
              </p>
            ) : (
              <div className="grid gap-[var(--space-md)] sm:grid-cols-2">
                {ready.map((order) => (
                  <OrderTicket
                    key={order.id}
                    order={order}
                    onAdvance={advance}
                    onOpenPayment={setPayingOrder}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-[var(--space-lg)]">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-[var(--space-lg)]">
            <h2 className="text-md">Status meja</h2>
            <p className="mt-[var(--space-2xs)] text-sm text-[var(--color-muted)]">
              Putih berarti kosong, terracotta berarti terisi.
            </p>
            <ul className="mt-[var(--space-md)] grid grid-cols-4 gap-[var(--space-xs)]">
              {TABLES.map((table) => (
                <li key={table.number}>
                  <div
                    className={[
                      "grid aspect-square place-items-center rounded-[var(--radius-sm)] border text-sm font-semibold",
                      table.occupied
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                        : "border-[var(--color-rule-2)] text-[var(--color-muted)]",
                    ].join(" ")}
                    title={`Meja ${table.number} · ${table.seats} kursi · ${table.occupied ? "terisi" : "kosong"}`}
                  >
                    <span className="tnum">{table.number}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-[var(--space-lg)]">
            <h2 className="text-md">Selesai hari ini</h2>
            <ul className="mt-[var(--space-md)] flex flex-col divide-y divide-[var(--color-rule)]">
              {settled.length === 0 ? (
                <li className="text-sm text-[var(--color-muted)]">
                  Belum ada transaksi.
                </li>
              ) : (
                settled.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between gap-[var(--space-sm)] py-[var(--space-sm)] text-sm"
                  >
                    <span className="tnum text-[var(--color-muted)]">
                      {order.id}
                    </span>
                    <span className="tnum font-semibold">
                      {formatRupiah(sumLines(order.lines))}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <Link
            href="/admin"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-rule-2)] px-[var(--space-md)] text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]"
          >
            Buka panel admin
          </Link>
        </aside>
      </div>

      <PaymentDialog
        order={payingOrder}
        onClose={() => setPayingOrder(null)}
        onSettle={settle}
      />
    </main>
  );
}
