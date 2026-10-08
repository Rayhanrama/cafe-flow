"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { MENU, SEED_ORDERS } from "@/lib/mock-data";
import { sumLines } from "@/lib/format";
import type {
  CartLine,
  MenuItem,
  Order,
  OrderStatus,
  PaymentMethod,
} from "@/lib/types";

interface StoreValue {
  cart: CartLine[];
  addToCart: (item: MenuItem) => void;
  decrement: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  orders: Order[];
  placeOrder: (table: number, guest: string, note?: string) => string;
  advance: (orderId: string) => void;
  settle: (orderId: string, method: PaymentMethod) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const NEXT_STATUS: Record<OrderStatus, OrderStatus> = {
  baru: "diproses",
  diproses: "siap",
  siap: "dibayar",
  dibayar: "dibayar",
};

let counter = 1042;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((lines) => {
      const existing = lines.find((line) => line.itemId === item.id);
      if (existing) {
        return lines.map((line) =>
          line.itemId === item.id ? { ...line, qty: line.qty + 1 } : line,
        );
      }
      return [
        ...lines,
        { itemId: item.id, name: item.name, price: item.price, qty: 1 },
      ];
    });
  }, []);

  const decrement = useCallback((itemId: string) => {
    setCart((lines) =>
      lines
        .map((line) =>
          line.itemId === itemId ? { ...line, qty: line.qty - 1 } : line,
        )
        .filter((line) => line.qty > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const placeOrder = useCallback(
    (table: number, guest: string, note?: string) => {
      const id = `CF-${++counter}`;
      const order: Order = {
        id,
        table,
        guest,
        lines: cart,
        note: note?.trim() || undefined,
        status: "baru",
        placedAt: Date.now(),
      };
      setOrders((current) => [order, ...current]);
      setCart([]);
      return id;
    },
    [cart],
  );

  const advance = useCallback((orderId: string) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? { ...order, status: NEXT_STATUS[order.status] }
          : order,
      ),
    );
  }, []);

  const settle = useCallback((orderId: string, method: PaymentMethod) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? { ...order, status: "dibayar", paidWith: method }
          : order,
      ),
    );
  }, []);

  const value = useMemo<StoreValue>(() => {
    return {
      cart,
      addToCart,
      decrement,
      clearCart,
      cartCount: cart.reduce((n, line) => n + line.qty, 0),
      cartTotal: sumLines(cart),
      orders,
      placeOrder,
      advance,
      settle,
    };
  }, [cart, orders, addToCart, decrement, clearCart, placeOrder, advance, settle]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error("useStore must be used inside <StoreProvider>");
  }
  return value;
}

// Small shared helpers used by the screens.
export function itemById(id: string): MenuItem | undefined {
  return MENU.find((item) => item.id === id);
}
