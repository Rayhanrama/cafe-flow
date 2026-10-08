import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { StoreProvider } from "@/context/store-context";
import "./globals.css";

// Editorial pairing (Hallmark typography): expressive display serif +
// modern body sans + mono outlier for numerals/wordmark only.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cafe-Flow — Sistem Pemesanan Kafe",
  description:
    "Prototipe alur pemesanan kafe: pesan dari QR, pesanan masuk ke dapur, pembayaran ke kasir.",
};

export const viewport: Viewport = {
  themeColor: "#f4ede1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
