"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CategoryRail } from "@/components/order/category-rail";
import { MenuCard } from "@/components/order/menu-card";
import { CartDrawer } from "@/components/order/cart-drawer";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/store-context";
import { CATEGORIES, MENU, TABLES } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/format";
import type { Category } from "@/lib/types";

export default function OrderPage() {
  const { addToCart, cartCount, cartTotal, placeOrder, orders } = useStore();
  const [category, setCategory] = useState<Category>("kopi");
  const [cartOpen, setCartOpen] = useState(false);
  const [placedId, setPlacedId] = useState<string | null>(null);

  // Simulated QR scan: table 5, drawn from the table list. No fake browser
  // chrome — just the fact of the table number.
  const table = TABLES[4];

  const items = useMemo(
    () => MENU.filter((item) => item.category === category),
    [category],
  );

  const activeCategory = CATEGORIES.find((entry) => entry.id === category)!;

  const placed = placedId ? orders.find((order) => order.id === placedId) : null;

  if (placed) {
    return (
      <main className="mx-auto max-w-2xl py-[clamp(2rem,6vw,5rem)]">
        <p className="label">Pesanan terkirim</p>
        <h1 className="mt-[var(--space-xs)] text-display-s">
          Terima kasih, {placed.guest}.
        </h1>
        <p className="mt-[var(--space-md)] max-w-[46ch] text-base text-[var(--color-muted)]">
          Pesanan <span className="tnum font-semibold text-[var(--color-ink)]">{placed.id}</span> untuk
          meja {placed.table} sudah masuk ke dapur. Pantau statusnya di bawah ini.
        </p>

        <ol className="mt-[var(--space-2xl)] flex flex-col gap-[var(--space-md)]">
          {(["baru", "diproses", "siap"] as const).map((stage, index) => {
            const reached =
              ["baru", "diproses", "siap"].indexOf(placed.status) >= index;
            const labels = {
              baru: "Diterima dapur",
              diproses: "Sedang dibuat",
              siap: "Siap diantar ke meja",
            } as const;
            return (
              <li
                key={stage}
                className="flex items-center gap-[var(--space-md)]"
              >
                <span
                  aria-hidden
                  className={[
                    "grid size-8 shrink-0 place-items-center rounded-full border text-sm font-semibold",
                    reached
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                      : "border-[var(--color-rule-2)] text-[var(--color-faint)]",
                  ].join(" ")}
                >
                  {index + 1}
                </span>
                <span
                  className={
                    reached
                      ? "text-sm font-semibold"
                      : "text-sm text-[var(--color-faint)]"
                  }
                >
                  {labels[stage]}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-[var(--space-2xl)] flex flex-wrap gap-[var(--space-sm)]">
          <Button onClick={() => setPlacedId(null)} tone="ink" variant="outline">
            Pesan lagi
          </Button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] px-[var(--space-md)] text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          >
            Kembali ke beranda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-[var(--space-3xl)]">
      <div className="mx-auto max-w-5xl">
        {/* Hero: no gradient, no centred stack. Table number carries the
            launch point; the accent marks a single region. */}
        <header className="grid gap-[var(--space-lg)] py-[clamp(1.5rem,4vw,3rem)] sm:grid-cols-[1.4fr_1fr] sm:items-end">
          <div>
            <p className="label">Warung Kopi Nusa · Meja {table.number}</p>
            <h1 className="mt-[var(--space-xs)] text-display-s">
              Pilih minuman, kirim ke dapur.
            </h1>
          </div>
          <p className="max-w-[38ch] text-sm text-[var(--color-muted)] sm:border-l sm:border-[var(--color-rule)] sm:pl-[var(--space-lg)]">
            Pesanan Anda masuk langsung ke layar dapur begitu dikonfirmasi.
            Bayar di kasir setelah selesai.
          </p>
        </header>

        <hr className="rule" />

        <div className="flex flex-col gap-[var(--space-lg)] py-[var(--space-xl)]">
          <CategoryRail active={category} onChange={setCategory} />
          <div>
            <p className="text-sm text-[var(--color-muted)]">
              {activeCategory.label} · {activeCategory.blurb} ·{" "}
              <span className="tnum">{items.length} item</span>
            </p>
            <div className="mt-[var(--space-lg)] grid grid-cols-1 gap-[var(--space-md)] min-[420px]:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <MenuCard key={item.id} item={item} onAdd={addToCart} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar: the one fixed element, tinted paper, hairline top. */}
      <div className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-[var(--color-rule)] bg-[color-mix(in_oklch,var(--color-paper)_92%,transparent)] px-[var(--space-md)] py-[var(--space-sm)] backdrop-blur-[2px]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-[var(--space-md)]">
          <div className="min-w-0">
            <p className="label">{cartCount} item</p>
            <span className="tnum text-base font-semibold">
              {formatRupiah(cartTotal)}
            </span>
          </div>
          <Button
            onClick={() => setCartOpen(true)}
            disabled={cartCount === 0}
          >
            Lihat pesanan
          </Button>
        </div>
      </div>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onConfirm={(guest, note) => {
          const id = placeOrder(table.number, guest, note);
          setCartOpen(false);
          setPlacedId(id);
        }}
      />
    </main>
  );
}
