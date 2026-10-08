// Domain types for the Cafe-Flow prototype. Data is mock-only (no backend).

export type Category = "kopi" | "non-kopi" | "makanan" | "snack";

export interface MenuItem {
  id: string;
  name: string;
  price: number; // in rupiah
  category: Category;
  /** Short, honest descriptor — no invented marketing claims. */
  note: string;
  available: boolean;
  /** Signature items are rendered larger; a hierarchy signal, not a badge. */
  signature?: boolean;
}

export interface CartLine {
  itemId: string;
  name: string;
  price: number;
  qty: number;
}

export type OrderStatus = "baru" | "diproses" | "siap" | "dibayar";

export interface Order {
  id: string;
  table: number;
  guest: string;
  lines: CartLine[];
  note?: string;
  status: OrderStatus;
  placedAt: number; // epoch ms
  paidWith?: PaymentMethod;
}

export type PaymentMethod = "tunai" | "qris" | "debit";

export interface Table {
  number: number;
  seats: number;
  occupied: boolean;
}

export interface StockItem {
  id: string;
  name: string;
  unit: string;
  level: number; // 0..100 percent
  reorderAt: number;
}
