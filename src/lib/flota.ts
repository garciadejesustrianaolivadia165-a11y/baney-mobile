import { useSyncExternalStore } from "react";

// Vehículos del transportista. Mientras no haya API viven aquí, compartidos por
// Publicar disponibilidad, Mi Empresa y el formulario de nuevo camión.
export const TIPOS_VEHICULO = ["Volteo", "Cama / Plataforma", "Furgón", "Refrigerado", "Cisterna", "Otro"] as const;
export const UNIDADES_CAPACIDAD = ["m³", "Ton", "lb", "kg"] as const;
export const CONDICIONES_VEHICULO = ["Refrigeración", "Material frágil", "Perecederos", "Material peligroso"] as const;

export type Camion = {
  id: string;
  /** Alias con el que se identifica en la app (p. ej. "Mack #23") */
  alias: string;
  tipo: (typeof TIPOS_VEHICULO)[number];
  marca: string;
  anio: string;
  placa: string;
  capacidad: string;
  unidad: (typeof UNIDADES_CAPACIDAD)[number];
  condiciones: string[];
  seguro: string;
  ultimoMantenimiento: string;
  /** Ruta de assets o URI de la foto subida */
  foto?: string;
};

let camiones: Camion[] = [
  { id: "c1", alias: "Mack #23", tipo: "Volteo", marca: "Mack Granite", anio: "2019", placa: "L123456", capacidad: "12", unidad: "m³", condiciones: ["Material frágil"], seguro: "Seguros Universal · 06/2027", ultimoMantenimiento: "15/09/2026", foto: "/images/image_mobile/truck image.png" },
  { id: "c2", alias: "Isuzu #04", tipo: "Cama / Plataforma", marca: "Isuzu NPR", anio: "2021", placa: "L654321", capacidad: "20", unidad: "Ton", condiciones: [], seguro: "La Colonial · 01/2027", ultimoMantenimiento: "02/08/2026" },
];

const oyentes = new Set<() => void>();
const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};
const leer = () => camiones;
const emitir = () => oyentes.forEach((f) => f());

export function useFlota() {
  return useSyncExternalStore(suscribir, leer, leer);
}

/** Texto corto "Volteo 12m³" para tarjetas y listas */
export function descripcionCamion(c: Camion) {
  return `${c.tipo.split(" /")[0]} ${c.capacidad}${c.unidad === "m³" ? "m³" : ` ${c.unidad}`}`;
}

export function agregarCamion(c: Omit<Camion, "id">) {
  camiones = [...camiones, { ...c, id: `c${Date.now()}` }];
  emitir();
}

export function eliminarCamion(id: string) {
  camiones = camiones.filter((c) => c.id !== id);
  emitir();
}
