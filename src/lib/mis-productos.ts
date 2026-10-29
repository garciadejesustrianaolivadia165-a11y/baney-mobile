import { useSyncExternalStore } from "react";

const IMG = "/images/image_home";

export const UNIDADES = ["Unidad", "lb", "kg", "qq", "Ton", "Caja", "Saco", "m³"];

export const CATEGORIAS_PROD = [
  "Cereales",
  "Legumbres",
  "Hortalizas",
  "Frutas",
  "Industriales",
  "Artesanales",
];

export const ESTADOS = ["Publicado", "Agotado", "Borrador"] as const;
export type Estado = (typeof ESTADOS)[number];

export const FOTOS = [
  `${IMG}/image_home_14.png`,
  `${IMG}/image_home_15.png`,
  `${IMG}/image_home_16.png`,
  `${IMG}/image_home_17.png`,
  `${IMG}/image_home_03.png`,
  `${IMG}/image_home_04.png`,
];

export type MiProducto = {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  unidad: string;
  precio: number;
  stock: number;
  estado: Estado;
  img: string;
};

export const colorEstado: Record<Estado, string> = {
  Publicado: "bg-success-100 text-success-700",
  Agotado: "bg-error-100 text-error-600",
  Borrador: "bg-warning-100 text-warning-800",
};

// ===== Almacén compartido =====
// Mientras no haya API, los productos del proveedor viven aquí para que
// el listado y la vista de edición trabajen sobre los mismos datos.

let productos: MiProducto[] = [
  {
    id: "p1",
    nombre: "Papas Criollas",
    descripcion: "Papa criolla lavada, calibre mediano, cosecha de Constanza.",
    categoria: "Hortalizas",
    unidad: "qq",
    precio: 2400,
    stock: 48,
    estado: "Publicado",
    img: `${IMG}/image_home_14.png`,
  },
  {
    id: "p2",
    nombre: "Plátanos Barahoneros",
    descripcion: "Plátano barahonero de primera, empacado en racimos.",
    categoria: "Frutas",
    unidad: "Caja",
    precio: 850,
    stock: 120,
    estado: "Publicado",
    img: `${IMG}/image_home_16.png`,
  },
  {
    id: "p3",
    nombre: "Carne Angus",
    descripcion: "Corte premium refrigerado, empaque al vacío.",
    categoria: "Industriales",
    unidad: "lb",
    precio: 430,
    stock: 0,
    estado: "Agotado",
    img: `${IMG}/image_home_15.png`,
  },
  {
    id: "p4",
    nombre: "Miel Artesanal",
    descripcion: "Miel de abeja pura de Jarabacoa, envase de 500 ml.",
    categoria: "Artesanales",
    unidad: "Unidad",
    precio: 500,
    stock: 32,
    estado: "Publicado",
    img: `${IMG}/image_home_17.png`,
  },
  {
    id: "p5",
    nombre: "Habichuelas Rojas",
    descripcion: "Habichuela roja seleccionada, saco de 100 lb.",
    categoria: "Legumbres",
    unidad: "Saco",
    precio: 6200,
    stock: 15,
    estado: "Borrador",
    img: `${IMG}/image_home_03.png`,
  },
];

const oyentes = new Set<() => void>();

function emitir() {
  oyentes.forEach((f) => f());
}

function suscribir(f: () => void) {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
}

function leer() {
  return productos;
}

export function useMisProductos() {
  return useSyncExternalStore(suscribir, leer, leer);
}

export function buscarProducto(id: string | undefined) {
  return productos.find((p) => p.id === id);
}

export function agregarProducto(p: Omit<MiProducto, "id">) {
  productos = [{ ...p, id: `p${Date.now()}` }, ...productos];
  emitir();
}

export function actualizarProducto(id: string, cambios: Partial<MiProducto>) {
  productos = productos.map((p) => (p.id === id ? { ...p, ...cambios } : p));
  emitir();
}

export function eliminarProducto(id: string) {
  productos = productos.filter((p) => p.id !== id);
  emitir();
}
