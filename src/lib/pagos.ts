import { useSyncExternalStore } from "react";

// Métodos de pago guardados por el usuario (Perfil → Métodos de pago).
export type MetodoPago = {
  id: string;
  tipo: "debito" | "credito" | "paypal";
  titulo: string;
  /** Últimos 4 dígitos o correo de PayPal */
  detalle: string;
  titular: string;
  vencimiento?: string;
  predeterminado: boolean;
};

let metodos: MetodoPago[] = [
  { id: "m1", tipo: "debito", titulo: "Tarjeta Débito", detalle: "**** 6789", titular: "Juan Pérez", vencimiento: "12/23", predeterminado: true },
  { id: "m2", tipo: "credito", titulo: "Tarjeta Crédito", detalle: "**** 6789", titular: "Juan Pérez", vencimiento: "12/23", predeterminado: false },
  { id: "m3", tipo: "paypal", titulo: "PayPal", detalle: "juan.perez@gmail.com", titular: "Juan Pérez", predeterminado: false },
];

const oyentes = new Set<() => void>();
const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};
const leer = () => metodos;
const emitir = () => oyentes.forEach((f) => f());

export const useMetodosPago = () => useSyncExternalStore(suscribir, leer, leer);

export function agregarMetodo(m: Omit<MetodoPago, "id" | "predeterminado">) {
  metodos = [...metodos, { ...m, id: `m${Date.now()}`, predeterminado: metodos.length === 0 }];
  emitir();
}

export function eliminarMetodo(id: string) {
  metodos = metodos.filter((m) => m.id !== id);
  if (metodos.length && !metodos.some((m) => m.predeterminado)) metodos = metodos.map((m, i) => ({ ...m, predeterminado: i === 0 }));
  emitir();
}

export function hacerPredeterminado(id: string) {
  metodos = metodos.map((m) => ({ ...m, predeterminado: m.id === id }));
  emitir();
}
