import { useSyncExternalStore } from "react";
import type { Product } from "@/types/product";

// Carrito de compra del cliente (04 · Checkout). Un solo almacén en memoria que
// alimentan la tarjeta de producto, la ficha de detalle y "Pedir de nuevo". TODO: API real.
export type ItemCarrito = { producto: Product; cantidad: number; unidad: string; categoria?: string };

export const ITBIS = 0.18;
export const COSTO_ENVIO = 650;

let items: ItemCarrito[] = [];
const oyentes = new Set<() => void>();
const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};
const leer = () => items;
const emitir = () => oyentes.forEach((f) => f());

export const useCarrito = () => useSyncExternalStore(suscribir, leer, leer);

export function agregarAlCarrito(producto: Product, cantidad = 1, extra: { unidad?: string; categoria?: string } = {}) {
  const existente = items.find((i) => i.producto.id === producto.id);
  items = existente
    ? items.map((i) => (i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i))
    : [...items, { producto, cantidad, unidad: extra.unidad ?? "unidad", categoria: extra.categoria }];
  emitir();
}

export function cambiarCantidad(id: string, cantidad: number) {
  items = cantidad <= 0 ? items.filter((i) => i.producto.id !== id) : items.map((i) => (i.producto.id === id ? { ...i, cantidad } : i));
  emitir();
}

export function quitarDelCarrito(id: string) {
  items = items.filter((i) => i.producto.id !== id);
  emitir();
}

export function vaciarCarrito() {
  items = [];
  emitir();
}

export const cantidadCarrito = (lista: ItemCarrito[]) => lista.reduce((a, i) => a + i.cantidad, 0);
export const subtotalCarrito = (lista: ItemCarrito[]) => lista.reduce((a, i) => a + i.producto.price * i.cantidad, 0);
/** "3 unidades", "1 quintal", "2 docenas" */
export const plural = (n: number, unidad: string) => `${n} ${n === 1 ? unidad : unidad.endsWith("a") || unidad.endsWith("o") ? `${unidad}s` : `${unidad}es`}`;
