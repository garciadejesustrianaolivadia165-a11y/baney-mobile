import { useSyncExternalStore } from "react";
import type { Href } from "expo-router";

// Estado de sesión del prototipo (rol elegido, qué busca el cliente y los datos
// del perfil que se editan desde Perfil → Datos personales / Mi Empresa).
// Mismo patrón de almacén compartido que lib/mis-productos.ts; cuando exista
// la API, aquí se guardará también el token del usuario.
export type Rol = "cliente" | "transportista" | "proveedor" | null;
export type Busca = "transportista" | "productor" | null;
export type ModoAuth = "login" | "registro";

export type Perfil = {
  nombres: string;
  apellidos: string;
  cedula: string;
  correo: string;
  telefono: string;
  provincia: string;
  pais: string;
  /** Ruta de assets o URI de la foto subida */
  avatar: string;
  /** Empresa a la que pertenece (vacío si se registró sin empresa) */
  empresa: { nombre: string; rnc: string; correo: string; telefono: string; direccion: string; dueno: string };
  licencia: { numero: string; categoria: string; vencimiento: string };
};

type Sesion = { rol: Rol; busca: Busca; modoAuth: ModoAuth; perfil: Perfil };

const PERFIL_INICIAL: Perfil = {
  nombres: "Triana Olivadia",
  apellidos: "García",
  cedula: "402-1234567-8",
  correo: "triana@constructoragarcia.do",
  telefono: "+1 (809)-884-3392",
  provincia: "Santo Domingo",
  pais: "República Dominicana",
  avatar: "/images/image_home/image_home_11.png",
  empresa: { nombre: "Constructora García & Asoc.", rnc: "1-31-85274-9", correo: "info@constructoragarcia.do", telefono: "+1 (809)-555-0199", direccion: "Av. Abraham Lincoln #12, Santo Domingo", dueno: "Triana Olivadia García" },
  licencia: { numero: "402-1234567-8", categoria: "Categoría 4 (vehículos pesados)", vencimiento: "12/2028" },
};

const INICIAL: Sesion = { rol: null, busca: null, modoAuth: "registro", perfil: PERFIL_INICIAL };
let sesion: Sesion = INICIAL;
const oyentes = new Set<() => void>();

function suscribir(f: () => void) {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
}
const leer = () => sesion;
const emitir = () => oyentes.forEach((f) => f());

export function useSesion() {
  return useSyncExternalStore(suscribir, leer, leer);
}

export function actualizarSesion(cambios: Partial<Omit<Sesion, "perfil">>) {
  sesion = { ...sesion, ...cambios };
  emitir();
}

export function actualizarPerfil(cambios: Partial<Perfil>) {
  sesion = { ...sesion, perfil: { ...sesion.perfil, ...cambios } };
  emitir();
}

/** Cerrar sesión vuelve al splash y luego al login; el rol elegido se conserva para el próximo acceso. */
export function cerrarSesion() {
  sesion = { ...INICIAL, rol: sesion.rol, busca: sesion.busca };
  emitir();
}

/** A dónde entra el usuario tras iniciar sesión o registrarse, según el rol elegido */
export function destinoPorRol(): Href {
  if (sesion.rol === "proveedor") return "/dashboard";
  if (sesion.rol === "transportista") return "/transportista";
  if (sesion.rol === "cliente") return sesion.busca === "productor" ? "/cliente" : "/mapa";
  return "/rol";
}

/** Ruta de salida: splash verde y después la vista de iniciar sesión */
export const SALIDA: Href = { pathname: "/", params: { destino: "login" } };
