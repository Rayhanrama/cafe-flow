import type {
  Category,
  MenuItem,
  Order,
  StockItem,
  Table,
} from "./types";

// Mock catalogue. Prices are plausible Jakarta warung-kopi figures; names are
// real drinks, not invented brands. No fabricated ratings or sales counts.

export const CATEGORIES: { id: Category; label: string; blurb: string }[] = [
  { id: "kopi", label: "Kopi", blurb: "Espresso bar" },
  { id: "non-kopi", label: "Non-Kopi", blurb: "Teh & susu" },
  { id: "makanan", label: "Makanan", blurb: "Piring utama" },
  { id: "snack", label: "Camilan", blurb: "Pendamping" },
];

export const MENU: MenuItem[] = [
  { id: "k1", name: "Kopi Susu Gula Aren", price: 24000, category: "kopi", note: "Espresso, susu, aren", available: true, signature: true },
  { id: "k2", name: "Es Kopi Tubruk", price: 18000, category: "kopi", note: "Seduhan tubruk, es batu", available: true },
  { id: "k3", name: "Cappuccino", price: 26000, category: "kopi", note: "Satu shot, busa tebal", available: true },
  { id: "k4", name: "Americano", price: 20000, category: "kopi", note: "Panjang, tanpa gula", available: true },
  { id: "k5", name: "Kopi Pandan", price: 25000, category: "kopi", note: "Sirup pandan, susu", available: false },
  { id: "n1", name: "Matcha Latte", price: 28000, category: "non-kopi", note: "Matcha upacara, susu", available: true, signature: true },
  { id: "n2", name: "Teh Serai Madu", price: 19000, category: "non-kopi", note: "Serai, madu, lemon", available: true },
  { id: "n3", name: "Cokelat Panas", price: 23000, category: "non-kopi", note: "Cokelat 60%, susu", available: true },
  { id: "m1", name: "Nasi Goreng Kampung", price: 32000, category: "makanan", note: "Telur mata, kerupuk", available: true },
  { id: "m2", name: "Roti Bakar Srikaya", price: 21000, category: "makanan", note: "Srikaya buatan sendiri", available: true },
  { id: "m3", name: "Mie Goreng Jawa", price: 30000, category: "makanan", note: "Bawang goreng, acar", available: true },
  { id: "s1", name: "Pisang Goreng Keju", price: 17000, category: "snack", note: "Tiga potong, keju", available: true },
  { id: "s2", name: "Singkong Goreng", price: 15000, category: "snack", note: "Sambal bawang", available: true },
  { id: "s3", name: "Kue Cubit", price: 16000, category: "snack", note: "Mesès, keju", available: false },
];

export const TABLES: Table[] = [
  { number: 1, seats: 2, occupied: true },
  { number: 2, seats: 4, occupied: true },
  { number: 3, seats: 2, occupied: false },
  { number: 4, seats: 6, occupied: true },
  { number: 5, seats: 4, occupied: false },
  { number: 6, seats: 2, occupied: true },
  { number: 7, seats: 8, occupied: false },
  { number: 8, seats: 4, occupied: true },
];

const now = Date.UTC(2026, 2, 14, 2, 0, 0); // fixed clock for determinism

export const SEED_ORDERS: Order[] = [
  {
    id: "CF-1042",
    table: 2,
    guest: "Rani",
    lines: [
      { itemId: "k1", name: "Kopi Susu Gula Aren", price: 24000, qty: 2 },
      { itemId: "s1", name: "Pisang Goreng Keju", price: 17000, qty: 1 },
    ],
    note: "Satu kopi tanpa gula tambahan",
    status: "baru",
    placedAt: now - 4 * 60000,
  },
  {
    id: "CF-1041",
    table: 4,
    guest: "Dimas",
    lines: [
      { itemId: "m1", name: "Nasi Goreng Kampung", price: 32000, qty: 2 },
      { itemId: "n2", name: "Teh Serai Madu", price: 19000, qty: 2 },
    ],
    status: "diproses",
    placedAt: now - 9 * 60000,
  },
  {
    id: "CF-1040",
    table: 1,
    guest: "Sari",
    lines: [
      { itemId: "k2", name: "Es Kopi Tubruk", price: 18000, qty: 1 },
      { itemId: "m2", name: "Roti Bakar Srikaya", price: 21000, qty: 1 },
    ],
    status: "siap",
    placedAt: now - 15 * 60000,
  },
  {
    id: "CF-1039",
    table: 6,
    guest: "Bimo",
    lines: [
      { itemId: "n1", name: "Matcha Latte", price: 28000, qty: 2 },
    ],
    status: "siap",
    placedAt: now - 21 * 60000,
  },
  {
    id: "CF-1038",
    table: 8,
    guest: "Laras",
    lines: [
      { itemId: "k3", name: "Cappuccino", price: 26000, qty: 1 },
      { itemId: "s2", name: "Singkong Goreng", price: 15000, qty: 1 },
      { itemId: "k4", name: "Americano", price: 20000, qty: 1 },
    ],
    status: "dibayar",
    placedAt: now - 34 * 60000,
    paidWith: "qris",
  },
  {
    id: "CF-1037",
    table: 4,
    guest: "Putri",
    lines: [
      { itemId: "m3", name: "Mie Goreng Jawa", price: 30000, qty: 1 },
      { itemId: "n3", name: "Cokelat Panas", price: 23000, qty: 1 },
    ],
    status: "dibayar",
    placedAt: now - 46 * 60000,
    paidWith: "tunai",
  },
];

export const STOCK: StockItem[] = [
  { id: "st1", name: "Biji kopi arabika", unit: "kg", level: 62, reorderAt: 30 },
  { id: "st2", name: "Susu segar", unit: "liter", level: 24, reorderAt: 35 },
  { id: "st3", name: "Gula aren cair", unit: "liter", level: 78, reorderAt: 25 },
  { id: "st4", name: "Matcha bubuk", unit: "gram", level: 18, reorderAt: 30 },
  { id: "st5", name: "Beras", unit: "kg", level: 55, reorderAt: 30 },
  { id: "st6", name: "Minyak goreng", unit: "liter", level: 41, reorderAt: 30 },
];
