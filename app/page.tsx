import Link from "next/link";

// Landing: a screen picker. Structured as an editorial index rather than three
// equal icon cards — each entry carries a different weight and a real verb.
const SCREENS = [
  {
    href: "/order",
    n: "01",
    title: "Pesanan tamu",
    verb: "Pesan dari meja",
    copy: "Buka dari QR di meja. Pilih menu, kirim ke dapur, pantau status.",
    wide: true,
  },
  {
    href: "/pos",
    n: "02",
    title: "Kasir",
    verb: "Tangani antrian",
    copy: "Terima pesanan, tandai siap, dan selesaikan pembayaran.",
    wide: false,
  },
  {
    href: "/admin",
    n: "03",
    title: "Admin",
    verb: "Kelola warung",
    copy: "Lihat penjualan, atur ketersediaan menu, dan pantau stok bahan.",
    wide: false,
  },
] as const;

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl pb-[var(--space-3xl)]">
      <header className="grid gap-[var(--space-lg)] py-[clamp(3rem,8vw,6rem)] sm:grid-cols-[1.5fr_1fr] sm:items-end">
        <div>
          <p className="label">Prototipe · Peserta workshop</p>
          <h1 className="mt-[var(--space-sm)] text-display">
            Satu alur, tiga layar: tamu, dapur, kasir.
          </h1>
        </div>
        <p className="max-w-[40ch] text-base text-[var(--color-muted)] sm:border-l sm:border-[var(--color-rule)] sm:pl-[var(--space-lg)]">
          Cafe-Flow mensimulasikan pemesanan kafe terintegrasi. Pesanan tamu
          masuk ke layar dapur secara langsung, lalu dibayar di kasir. Data di
          prototipe ini statis.
        </p>
      </header>

      <hr className="rule" />

      {/* Deliberately uneven: the guest screen takes the wide cell; the two
          staff screens stack in the narrow column. */}
      <div className="mt-[var(--space-xl)] grid gap-[var(--space-md)] sm:grid-cols-3 sm:grid-rows-2">
        {SCREENS.map((screen) => (
          <Link
            key={screen.href}
            href={screen.href}
            className={[
              "group flex flex-col justify-between gap-[var(--space-xl)] rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-[var(--space-lg)] transition-colors hover:border-[var(--color-ink)]",
              screen.wide ? "sm:col-span-2 sm:row-span-2" : "",
            ].join(" ")}
          >
            <div className="flex items-baseline justify-between gap-[var(--space-md)]">
              <span className="tnum font-mono text-sm text-[var(--color-muted)]">
                {screen.n}
              </span>
              <span className="label">{screen.verb}</span>
            </div>
            <div>
              <h2
                className={
                  screen.wide ? "text-3xl" : "text-xl"
                }
              >
                {screen.title}
              </h2>
              <p className="mt-[var(--space-sm)] max-w-[46ch] text-sm text-[var(--color-muted)]">
                {screen.copy}
              </p>
              <span className="mt-[var(--space-lg)] inline-block text-sm font-semibold text-[var(--color-accent)]">
                Buka layar →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <footer className="mt-[var(--space-3xl)] flex flex-col gap-[var(--space-xs)] border-t border-[var(--color-rule)] pt-[var(--space-lg)] text-sm text-[var(--color-muted)]">
        <p>
          Dibangun dengan Next.js. UI mengikuti aturan Hallmark dan antislop —
          tanpa gradient ungu, tanpa satu font untuk semua, tanpa layout
          seragam.
        </p>
      </footer>
    </main>
  );
}
