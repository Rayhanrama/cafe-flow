"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/store-context";
import { formatRupiah } from "@/lib/format";

// Cart drawer. Stepper uses text glyphs with accessible labels; total is
// tabular so the figure lines up. This is the only elevated surface on the
// customer screen.
export function CartDrawer({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (guest: string, note?: string) => void;
}) {
  const { cart, cartTotal, cartCount, addToCart, decrement } = useStore();
  const [note, setNote] = useState("");
  const [guest, setGuest] = useState("");

  const empty = cart.length === 0;

  function incrementLine(line: (typeof cart)[number]) {
    // Reconstruct a minimal MenuItem-shaped payload for the store action.
    addToCart({
      id: line.itemId,
      name: line.name,
      price: line.price,
      category: "kopi",
      note: "",
      available: true,
    });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Pesanan Anda"
      side="end"
      footer={
        <div className="flex flex-col gap-[var(--space-md)]">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-[var(--color-muted)]">
              Total {cartCount} item
            </span>
            <span className="tnum text-lg font-semibold">
              {formatRupiah(cartTotal)}
            </span>
          </div>
          <Button
            block
            disabled={empty || guest.trim().length === 0}
            onClick={() => {
              onConfirm(guest.trim(), note.trim() || undefined);
              setNote("");
              setGuest("");
            }}
          >
            Kirim ke dapur
          </Button>
          {!empty && guest.trim().length === 0 ? (
            <p className="text-center text-xs text-[var(--color-muted)]">
              Isi nama pemesan untuk melanjutkan.
            </p>
          ) : null}
        </div>
      }
    >
      {empty ? (
        <p className="text-sm text-[var(--color-muted)]">
          Belum ada item. Pilih menu untuk mulai memesan.
        </p>
      ) : (
        <div className="flex flex-col gap-[var(--space-lg)]">
          <ul className="flex flex-col divide-y divide-[var(--color-rule)]">
            {cart.map((line) => (
              <li
                key={line.itemId}
                className="flex items-center justify-between gap-[var(--space-md)] py-[var(--space-sm)]"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{line.name}</p>
                  <p className="tnum text-sm text-[var(--color-muted)]">
                    {formatRupiah(line.price)} × {line.qty}
                  </p>
                </div>
                <div className="flex items-center gap-[var(--space-xs)]">
                  <button
                    type="button"
                    aria-label={`Kurangi ${line.name}`}
                    onClick={() => decrement(line.itemId)}
                    className="grid size-9 place-items-center rounded-full border border-[var(--color-rule-2)] text-base hover:border-[var(--color-ink)]"
                  >
                    −
                  </button>
                  <span className="tnum w-6 text-center text-sm font-semibold">
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    aria-label={`Tambah ${line.name}`}
                    onClick={() => incrementLine(line)}
                    className="grid size-9 place-items-center rounded-full border border-[var(--color-rule-2)] text-base hover:border-[var(--color-ink)]"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-[var(--space-xs)]">
            <label htmlFor="guest-name" className="text-sm font-semibold">
              Nama pemesan
            </label>
            <input
              id="guest-name"
              value={guest}
              onChange={(event) => setGuest(event.target.value)}
              placeholder="Contoh: Rani"
              className="min-h-11 rounded-[var(--radius-md)] border border-[var(--color-rule-2)] bg-[var(--color-paper)] px-[var(--space-md)] text-sm outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <div className="flex flex-col gap-[var(--space-xs)]">
            <label htmlFor="order-note" className="text-sm font-semibold">
              Catatan (opsional)
            </label>
            <textarea
              id="order-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={2}
              placeholder="Tanpa gula, sambal dipisah, dll."
              className="resize-none rounded-[var(--radius-md)] border border-[var(--color-rule-2)] bg-[var(--color-paper)] px-[var(--space-md)] py-[var(--space-sm)] text-sm outline-none focus:border-[var(--color-accent)]"
            />
          </div>
        </div>
      )}
    </Dialog>
  );
}
