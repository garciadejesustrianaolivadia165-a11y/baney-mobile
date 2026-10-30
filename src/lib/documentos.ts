import { useSyncExternalStore } from "react";
import type { Rol } from "@/lib/sesion";

// Documentos de verificación del usuario (Perfil → Mis documentos). Cada rol
// tiene su lista; el estado lo decidirá el equipo de BANEY al revisarlos. TODO: API real.
export type EstadoDocumento = "pendiente" | "revision" | "aprobado" | "rechazado";
export type Archivo = { uri: string; nombre: string; tipo: string };

export type Documento = {
  id: string;
  titulo: string;
  detalle: string;
  obligatorio: boolean;
  estado: EstadoDocumento;
  archivo?: Archivo;
  /** Fecha de vencimiento (licencia, seguro) */
  vence?: string;
  /** Motivo cuando el documento fue rechazado */
  motivo?: string;
};

export const ESTADOS: Record<EstadoDocumento, { texto: string; fondo: string; color: string }> = {
  pendiente: { texto: "Sin subir", fondo: "bg-neutral-100", color: "text-neutral-600" },
  revision: { texto: "En revisión", fondo: "bg-warning-100", color: "text-warning-700" },
  aprobado: { texto: "Aprobado", fondo: "bg-success-100", color: "text-success-700" },
  rechazado: { texto: "Rechazado", fondo: "bg-error-100", color: "text-error-700" },
};

const CEDULA: Documento = { id: "cedula", titulo: "Cédula de identidad", detalle: "Ambas caras, legible y vigente", obligatorio: true, estado: "aprobado", archivo: { uri: "/images/image_home/image_home_11.png", nombre: "cedula.jpg", tipo: "image/jpeg" } };

const POR_ROL: Record<NonNullable<Rol>, Documento[]> = {
  cliente: [CEDULA, { id: "rnc", titulo: "RNC o registro mercantil", detalle: "Solo si compras a nombre de una empresa", obligatorio: false, estado: "pendiente" }],
  proveedor: [
    CEDULA,
    { id: "rnc", titulo: "RNC o registro mercantil", detalle: "Para emitir facturas con comprobante fiscal", obligatorio: true, estado: "revision", archivo: { uri: "", nombre: "rnc_constructora.pdf", tipo: "application/pdf" } },
    { id: "sanitario", titulo: "Registro sanitario / certificación", detalle: "Si vendes productos procesados o de origen animal", obligatorio: false, estado: "pendiente" },
  ],
  transportista: [
    CEDULA,
    { id: "licencia", titulo: "Licencia de conducir", detalle: "Categoría acorde al vehículo que registraste", obligatorio: true, estado: "rechazado", vence: "12/2028", motivo: "La foto está borrosa: no se lee la categoría." },
    { id: "seguro", titulo: "Seguro del vehículo", detalle: "Póliza vigente de cada camión de tu flota", obligatorio: true, estado: "pendiente", vence: "03/2027" },
    { id: "matricula", titulo: "Matrícula del vehículo", detalle: "A tu nombre o de la empresa de transporte", obligatorio: true, estado: "pendiente" },
  ],
};

let documentos: Record<NonNullable<Rol>, Documento[]> = POR_ROL;
const oyentes = new Set<() => void>();
const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};
const leer = () => documentos;
const emitir = () => oyentes.forEach((f) => f());

export function useDocumentos(rol: Rol) {
  const todos = useSyncExternalStore(suscribir, leer, leer);
  return todos[rol ?? "cliente"];
}

/** Guarda el archivo elegido y lo deja "En revisión" hasta que BANEY lo apruebe */
export function subirDocumento(rol: Rol, id: string, archivo: Archivo) {
  const r = rol ?? "cliente";
  documentos = { ...documentos, [r]: documentos[r].map((d) => (d.id === id ? { ...d, archivo, estado: "revision", motivo: undefined } : d)) };
  emitir();
}

export function quitarDocumento(rol: Rol, id: string) {
  const r = rol ?? "cliente";
  documentos = { ...documentos, [r]: documentos[r].map((d) => (d.id === id ? { ...d, archivo: undefined, estado: "pendiente", motivo: undefined } : d)) };
  emitir();
}
