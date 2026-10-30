import { useSyncExternalStore } from "react";

// Preferencias del usuario (Configuración): notificaciones, ubicación y seguridad.
// Almacén compartido para que el login sepa si hay verificación en dos pasos
// y para que los interruptores no se pierdan al salir de la pantalla.
export type Preferencias = {
  push: boolean;
  correo: boolean;
  ofertas: boolean;
  ubicacion: boolean;
  dosPasos: boolean;
};

let preferencias: Preferencias = { push: true, correo: true, ofertas: false, ubicacion: true, dosPasos: false };
const oyentes = new Set<() => void>();
const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};
const leer = () => preferencias;

export const usePreferencias = () => useSyncExternalStore(suscribir, leer, leer);

export function actualizarPreferencias(cambios: Partial<Preferencias>) {
  preferencias = { ...preferencias, ...cambios };
  oyentes.forEach((f) => f());
}
