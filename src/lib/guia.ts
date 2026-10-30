import { useSyncExternalStore } from "react";

// Puente entre la guía interactiva del inicio y el cascarón: dónde está el botón
// del menú (para enfocarlo) y si la guía quiere abrir el menú lateral.
export type Rect = { x: number; y: number; w: number; h: number };
type Guia = { botonMenu: Rect | null; sidebar: Rect | null };

let guia: Guia = { botonMenu: null, sidebar: null };
const oyentes = new Set<() => void>();
const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};
const leer = () => guia;

export const useGuia = () => useSyncExternalStore(suscribir, leer, leer);

export function registrarGuia(cambios: Partial<Guia>) {
  guia = { ...guia, ...cambios };
  oyentes.forEach((f) => f());
}
