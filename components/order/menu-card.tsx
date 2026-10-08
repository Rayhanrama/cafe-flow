"use client";

import { formatRupiah } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

// Menu card. Hierarchy is carried by size and type, not by an icon tile:
// signature items render as a wide feature cell; the rest are compact rows.
export function MenuCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}) {
  const soldOut = !item.available;

  if (item.signature) {
    return (
      <article className="col-span-1 flex flex-col justify-between gap-[var(--space-lg)] rounded-[var(--radius-lg)] border border-[var(--color-rule-2)] bg-[var(--color-surface)] p-[var(--space-lg)] min-[420px]:col-span-2 lg:col-span-2">
        <div>
          <p className="label">Paling sering dipesan</p>
          <h3 className="mt-[var(--space-xs)] text-xl">{item.name}</h3>
          <p className="mt-[var(--space-xs)] max-w-[40ch] text-sm text-[var(--color-muted)]">
            {item.note}
          </p>
        </div>
        <div className="flex items-end justify-between gap-[var(--space-md)]">
          <span className="tnum text-lg font-semibold">
            {formatRupiah(item.price)}
          </span>
          <button
            type="button"
            onClick={() => onAdd(item)}
            disabled={soldOut}
            className="min-h-11 rounded-[var(--radius-md)] border border-[var(--color-accent)] px-[var(--space-md)] text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] disabled:opacity-40"
          >
            {soldOut ? "Habis" : "Tambah"}
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="flex items-center justify-between gap-[var(--space-md)] rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-[var(--space-md)]">
      <div className="min-w-0">
        <h3 className="text-base font-semibold leading-snug">{item.name}</h3>
        <p className="mt-[var(--space-3xs)] text-sm text-[var(--color-muted)]">
          {item.note}
        </p>
        <span className="tnum mt-[var(--space-xs)] block text-sm font-semibold">
          {formatRupiah(item.price)}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onAdd(item)}
        disabled={soldOut}
        aria-label={`Tambah ${item.name}`}
        className="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--color-rule-2)] text-lg font-semibold text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-40"
      >
        {soldOut ? "×" : "+"}
      </button>
    </article>
  );
}
