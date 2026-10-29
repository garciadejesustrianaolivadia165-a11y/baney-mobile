import { useSyncExternalStore } from "react";

// Estado de sesión del prototipo (rol elegido y qué busca el cliente).
// Mismo patrón de almacén compartido que lib/mis-productos.ts; cuando exista
// la API, aquí se guardará también el token del usuario.
export type Rol = "cliente" | "transportista" | "proveedor" | null;
export type Busca = "transportista" | "productor" | null;
export type ModoAuth = "login" | "registro";

type Sesion = { rol: Rol; busca: Busca; modoAuth: ModoAuth };

const INICIAL: Sesion = { rol: null, busca: null, modoAuth: "registro" };
let sesion: Sesion = INICIAL;
const oyentes = new Set<() => void>();

function suscribir(f: () => void) {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
}
const leer = () => sesion;

export function useSesion() {
  return useSyncExternalStore(suscribir, leer, leer);
}

export function actualizarSesion(cambios: Partial<Sesion>) {
  sesion = { ...sesion, ...cambios };
  oyentes.forEach((f) => f());
}

export function cerrarSesion() {
  sesion = INICIAL;
  oyentes.forEach((f) => f());
}
