"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { useStore } from "@/context/store-context";
import { formatClock, formatRupiah, sumLines } from "@/lib/format";
import type { Order, PaymentMethod } from "@/lib/types";

const METHOD_LABEL: Record<PaymentMethod, string> = {
  tunai: "Tunai",
  qris: "QRIS",
  debit: "Kartu debit",
};

export function OrderTicket({
  order,
  onAdvance,
  onOpenPayment,
}: {
  order: Order;
  onAdvance: (id: string) => void;
  onOpenPayment: (order: Order) => void;
}) {
  const total = sumLines(order.lines);
  const actionable = order.status === "baru" || order.status === "diproses";

  return (
    <article className="flex flex-col gap-[var(--space-md)] rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-[var(--space-md)]">
      <header className="flex items-start justify-between gap-[var(--space-sm)]">
        <div>
          <h3 className="tnum text-base font-semibold">{order.id}</h3>
          <p className="text-sm text-[var(--color-muted)]">
            Meja {order.table} · {order.guest} ·{" "}
            <span className="tnum">{formatClock(order.placedAt)}</span>
          </p>
        </div>
        <StatusPill status={order.status} />
      </header>

      <ul className="flex flex-col gap-[var(--space-2xs)] border-y border-[var(--color-rule)] py-[var(--space-sm)]">
        {order.lines.map((line) => (
          <li
            key={line.itemId}
            className="flex items-baseline justify-between gap-[var(--space-sm)] text-sm"
          >
            <span className="min-w-0">
              <span className="tnum font-semibold">{line.qty}×</span>{" "}
              {line.name}
            </span>
            <span className="tnum text-[var(--color-muted)]">
              {formatRupiah(line.price * line.qty)}
            </span>
          </li>
        ))}
      </ul>

      {order.note ? (
        <p className="rounded-[var(--radius-sm)] bg-[var(--color-accent-soft)] px-[var(--space-sm)] py-[var(--space-xs)] text-sm text-[var(--color-ink)]">
          <span className="font-semibold">Catatan:</span> {order.note}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-[var(--space-sm)]">
        <span className="tnum text-base font-semibold">
          {formatRupiah(total)}
        </span>
        <div className="flex gap-[var(--space-xs)]">
          {actionable ? (
            <Button
              variant="outline"
              tone="ink"
              onClick={() => onAdvance(order.id)}
            >
              {order.status === "baru" ? "Terima" : "Tandai siap"}
            </Button>
          ) : null}
          {order.status !== "dibayar" ? (
            <Button onClick={() => onOpenPayment(order)}>Bayar</Button>
          ) : (
            <span className="text-sm text-[var(--color-muted)]">
              Lunas · {order.paidWith ? METHOD_LABEL[order.paidWith] : "—"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function PaymentDialog({
  order,
  onClose,
  onSettle,
}: {
  order: Order | null;
  onClose: () => void;
  onSettle: (id: string, method: PaymentMethod) => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("tunai");
  const [cash, setCash] = useState("");

  if (!order) return null;

  const total = sumLines(order.lines);
  const cashValue = Number(cash.replace(/\D/g, "")) || 0;
  const change = cashValue - total;

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] grid place-items-center bg-[oklch(24%_0.02_55/0.4)] p-[var(--space-md)]"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Pembayaran ${order.id}`}
        className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--color-rule-2)] bg-[var(--color-surface)] p-[var(--space-lg)] shadow-[var(--shadow-raised)]"
      >
        <h2 className="text-md">Pembayaran {order.id}</h2>
        <p className="mt-[var(--space-2xs)] text-sm text-[var(--color-muted)]">
          Meja {order.table} · {order.guest}
        </p>

        <div className="mt-[var(--space-lg)] flex items-baseline justify-between border-y border-[var(--color-rule)] py-[var(--space-md)]">
          <span className="text-sm text-[var(--color-muted)]">Tagihan</span>
          <span className="tnum text-lg font-semibold">
            {formatRupiah(total)}
          </span>
        </div>

        <fieldset className="mt-[var(--space-lg)]">
          <legend className="label mb-[var(--space-sm)]">Metode</legend>
          <div className="grid grid-cols-3 gap-[var(--space-xs)]">
            {(Object.keys(METHOD_LABEL) as PaymentMethod[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={method === key}
                onClick={() => setMethod(key)}
                className={[
                  "min-h-11 rounded-[var(--radius-md)] border px-[var(--space-xs)] text-sm font-semibold",
                  method === key
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-ink)]"
                    : "border-[var(--color-rule-2)] text-[var(--color-muted)] hover:border-[var(--color-ink)]",
                ].join(" ")}
              >
                {METHOD_LABEL[key]}
              </button>
            ))}
          </div>
        </fieldset>

        {method === "tunai" ? (
          <div className="mt-[var(--space-lg)] flex flex-col gap-[var(--space-xs)]">
            <label htmlFor="cash" className="text-sm font-semibold">
              Uang diterima
            </label>
            <input
              id="cash"
              inputMode="numeric"
              value={cash}
              onChange={(event) => setCash(event.target.value)}
              placeholder="0"
              className="tnum min-h-11 rounded-[var(--radius-md)] border border-[var(--color-rule-2)] bg-[var(--color-paper)] px-[var(--space-md)] text-sm outline-none focus:border-[var(--color-accent)]"
            />
            {cashValue > 0 ? (
              <p className="tnum text-sm text-[var(--color-muted)]">
                Kembalian:{" "}
                <span
                  className={
                    change < 0
                      ? "font-semibold text-[var(--color-danger)]"
                      : "font-semibold text-[var(--color-ok)]"
                  }
                >
                  {change < 0
                    ? `Kurang ${formatRupiah(Math.abs(change))}`
                    : formatRupiah(change)}
                </span>
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-[var(--space-xl)] flex flex-col-reverse gap-[var(--space-sm)] sm:flex-row sm:justify-end">
          <Button variant="outline" tone="ink" onClick={onClose}>
            Batal
          </Button>
          <Button
            disabled={method === "tunai" && cashValue < total}
            onClick={() => {
              onSettle(order.id, method);
              setCash("");
              setMethod("tunai");
              onClose();
            }}
          >
            Konfirmasi pembayaran
          </Button>
        </div>
      </div>
    </div>
  );
}

export function useQueue() {
  const { orders } = useStore();
  return useMemo(() => {
    const active = orders.filter(
      (order) => order.status === "baru" || order.status === "diproses",
    );
    const ready = orders.filter((order) => order.status === "siap");
    const settled = orders.filter((order) => order.status === "dibayar");
    return { active, ready, settled };
  }, [orders]);
}
