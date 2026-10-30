import { useSyncExternalStore } from "react";
import type { Product } from "@/types/product";

// Favoritos / lista de deseos. El cliente guarda productos del marketplace; el
// proveedor destaca productos de su catálogo (solo ids). TODO: API real.
type Favoritos = { productos: Product[]; destacados: string[] };

let favoritos: Favoritos = { productos: [], destacados: [] };
const oyentes = new Set<() => void>();
const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};
const leer = () => favoritos;
const emitir = () => oyentes.forEach((f) => f());

export const useFavoritos = () => useSyncExternalStore(suscribir, leer, leer);
export const esFavorito = (id: string) => favoritos.productos.some((p) => p.id === id);

/** Marca o quita un producto del marketplace en la lista de deseos; devuelve si quedó marcado */
export function alternarFavorito(producto: Product) {
  const estaba = esFavorito(producto.id);
  favoritos = { ...favoritos, productos: estaba ? favoritos.productos.filter((p) => p.id !== producto.id) : [...favoritos.productos, producto] };
  emitir();
  return !estaba;
}

export function quitarFavorito(id: string) {
  favoritos = { ...favoritos, productos: favoritos.productos.filter((p) => p.id !== id) };
  emitir();
}

/** Destacados del proveedor (corazón en "Tus Productos") */
export const esDestacado = (id: string) => favoritos.destacados.includes(id);
export function alternarDestacado(id: string) {
  favoritos = { ...favoritos, destacados: esDestacado(id) ? favoritos.destacados.filter((x) => x !== id) : [...favoritos.destacados, id] };
  emitir();
}
