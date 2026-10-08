// Formatting helpers. Indonesian rupiah + clock, both locale-aware.

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatRupiah(value: number): string {
  return rupiah.format(value);
}

export function formatClock(epochMs: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(epochMs));
}

export function formatSigned(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "±";
  return `${sign}${rupiah.format(Math.abs(value))}`;
}

export function sumLines(lines: { price: number; qty: number }[]): number {
  return lines.reduce((total, line) => total + line.price * line.qty, 0);
}
