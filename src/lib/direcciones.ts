import { useSyncExternalStore } from "react";

// Direcciones guardadas del usuario (Perfil → Mis direcciones). Se usan como
// destino en la solicitud de transporte y como entrega en el checkout. TODO: API real.
export const ETIQUETAS = ["Casa", "Trabajo", "Finca", "Almacén", "Otra"] as const;
export type Etiqueta = (typeof ETIQUETAS)[number];

export type Direccion = {
  id: string;
  etiqueta: Etiqueta;
  direccion: string;
  provincia: string;
  /** Punto de referencia o instrucciones para el chofer */
  referencia: string;
  contacto: string;
  telefono: string;
  predeterminada: boolean;
};

export const DIRECCION_VACIA: Omit<Direccion, "id"> = { etiqueta: "Casa", direccion: "", provincia: "Santo Domingo", referencia: "", contacto: "", telefono: "", predeterminada: false };

let direcciones: Direccion[] = [
  { id: "d1", etiqueta: "Casa", direccion: "Av. Abraham Lincoln #12, Santo Domingo", provincia: "Santo Domingo", referencia: "Edificio gris, portón verde", contacto: "Triana García", telefono: "+1 (809)-884-3392", predeterminada: true },
  { id: "d2", etiqueta: "Finca", direccion: "Carretera Sánchez km 14, Haina, San Cristóbal", provincia: "San Cristóbal", referencia: "Entrada después del colmado La Esperanza", contacto: "Ramón Peña", telefono: "+1 (829)-555-0140", predeterminada: false },
];

const oyentes = new Set<() => void>();
const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};
const leer = () => direcciones;
const emitir = () => oyentes.forEach((f) => f());

export const useDirecciones = () => useSyncExternalStore(suscribir, leer, leer);
export const buscarDireccion = (id: string) => direcciones.find((d) => d.id === id);

export function guardarDireccion(datos: Omit<Direccion, "id">, id?: string) {
  const nueva: Direccion = { ...datos, id: id ?? `d${Date.now()}`, predeterminada: datos.predeterminada || direcciones.length === 0 };
  direcciones = id ? direcciones.map((d) => (d.id === id ? nueva : d)) : [...direcciones, nueva];
  if (nueva.predeterminada) direcciones = direcciones.map((d) => ({ ...d, predeterminada: d.id === nueva.id }));
  emitir();
  return nueva;
}

export function eliminarDireccion(id: string) {
  direcciones = direcciones.filter((d) => d.id !== id);
  if (direcciones.length && !direcciones.some((d) => d.predeterminada)) direcciones = direcciones.map((d, i) => ({ ...d, predeterminada: i === 0 }));
  emitir();
}

export function hacerPredeterminada(id: string) {
  direcciones = direcciones.map((d) => ({ ...d, predeterminada: d.id === id }));
  emitir();
}
