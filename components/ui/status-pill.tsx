import type { OrderStatus } from "@/lib/types";

// Status is never signalled by colour alone — every pill carries its label.

const LABEL: Record<OrderStatus, string> = {
  baru: "Pesanan baru",
  diproses: "Sedang dibuat",
  siap: "Siap diantar",
  dibayar: "Sudah dibayar",
};

const STYLE: Record<OrderStatus, string> = {
  baru:
    "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]",
  diproses:
    "bg-[var(--color-warn-soft)] text-[color-mix(in_oklch,var(--color-warn)_70%,var(--color-ink))] border-[var(--color-warn)]",
  siap:
    "bg-[var(--color-ok-soft)] text-[var(--color-ok)] border-[var(--color-ok)]",
  dibayar:
    "bg-[var(--color-paper-2)] text-[var(--color-muted)] border-[var(--color-rule-2)]",
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-[var(--space-2xs)]",
        "rounded-[var(--radius-sm)] border px-[var(--space-xs)] py-[var(--space-3xs)]",
        "text-[0.68rem] font-semibold uppercase tracking-[0.08em]",
        STYLE[status],
      ].join(" ")}
    >
      <span
        aria-hidden
        className="block size-1.5 rounded-full bg-current"
      />
      {LABEL[status]}
    </span>
  );
}
