import { useSyncExternalStore } from "react";
import { CLIENTES } from "@/lib/clientes";
import type { PedidoFila } from "@/components/dashboard/tabla-pedidos";

// Pedidos que recibe el proveedor (inicio, bandeja, detalle y rutas). Un solo
// almacén para que aceptar, rechazar, cancelar o completar un pedido se refleje
// en todas las pantallas. TODO: API real (Order / Transport Service).
export type EstadoPedido = "NUEVO" | "EN PROCESO" | "COMPLETADO" | "RECHAZADO" | "CANCELADO";
export type ItemPedido = { nombre: string; categoria: string; cantidad: string; precio: number; img: string };
export type PedidoProveedor = {
  id: string;
  cliente: { id: string; nombre: string; img: string; telefono: string; direccion: string; tipo: string };
  fecha: string;
  hora: string;
  destino: string;
  items: ItemPedido[];
  itbis: number;
  envio: number;
  estado: EstadoPedido;
  /** Avance del transporte (solo EN PROCESO), 0–100 */
  avance: number;
};

const IMG = "/images/image_home";

/** Foto según el producto (mismas fotos del marketplace) */
export function fotoProducto(nombre: string) {
  const d = nombre.toLowerCase();
  if (/pl[aá]tano|guineo/.test(d)) return `${IMG}/image_home_16.png`;
  if (/papa/.test(d)) return `${IMG}/image_home_14.png`;
  if (/carne|res\b/.test(d)) return `${IMG}/image_home_15.png`;
  if (/miel/.test(d)) return `${IMG}/image_home_17.png`;
  if (/lechuga|pimiento|tomate|cebolla|hortaliza|vegetal/.test(d)) return `${IMG}/image_home_04.png`;
  return `${IMG}/image_home_03.png`;
}

const CATEGORIA: [RegExp, string][] = [
  [/pl[aá]tano|guineo|mango|pi[ñn]a/, "Frutas"],
  [/papa|lechuga|pimiento|tomate|cebolla|yuca/, "Hortalizas"],
  [/habichuela|frijol/, "Legumbres"],
  [/carne|pollo|leche|queso/, "Industriales"],
  [/miel|caf[eé]|cacao/, "Artesanales"],
  [/ma[ií]z|arroz/, "Cereales"],
];
const categoriaDe = (n: string) => CATEGORIA.find(([r]) => r.test(n.toLowerCase()))?.[1] ?? "Marketplace";

/** "Plátanos Banilejos 12 Dz" → ítem con nombre, cantidad y foto */
function itemDe(descripcion: string, precio: number): ItemPedido {
  const m = descripcion.match(/^(.*?)\s+(\d+\s+\S+)$/);
  const nombre = m ? m[1] : descripcion;
  return { nombre, categoria: categoriaDe(nombre), cantidad: m ? m[2] : "1 lote", precio, img: fotoProducto(nombre) };
}

const ESTADO_INICIAL: Record<string, EstadoPedido> = { "EN PROCESO": "EN PROCESO", COMPLETADO: "COMPLETADO", "NO INICIADO": "NUEVO" };
const HORAS = ["10:45 AM", "09:12 AM", "Ayer, 04:30 PM", "08:05 AM", "Ayer, 11:20 AM", "02:40 PM"];

function iniciales(): PedidoProveedor[] {
  const lista: PedidoProveedor[] = [];
  CLIENTES.forEach((c) =>
    c.pedidos.forEach((p) => {
      const semilla = Number(p.id.slice(-3)) || 0;
      lista.push({
        id: p.id,
        cliente: { id: c.id, nombre: c.nombre, img: c.img, telefono: c.telefono, direccion: c.direccion, tipo: c.tipo },
        fecha: p.fecha,
        hora: HORAS[semilla % HORAS.length],
        destino: p.destino,
        items: [itemDe(p.descripcion, Math.round(p.total / 1.18))],
        itbis: p.total - Math.round(p.total / 1.18),
        envio: 0,
        estado: ESTADO_INICIAL[p.estado] ?? "NUEVO",
        avance: p.estado === "EN PROCESO" ? 20 + (semilla % 60) : 0,
      });
    }),
  );
  // Dos pedidos nuevos más para la bandeja de hoy
  const fuerza = CLIENTES.find((c) => c.id === "colmado-la-fuerza") ?? CLIENTES[0];
  lista.push({
    id: "00242772365",
    cliente: { id: fuerza.id, nombre: fuerza.nombre, img: fuerza.img, telefono: fuerza.telefono, direccion: fuerza.direccion, tipo: fuerza.tipo },
    fecha: "30 Oct 2026",
    hora: "08:05 AM",
    destino: fuerza.direccion,
    items: [itemDe("Papas Criollas 3 qq", 7200), itemDe("Miel Artesanal 6 und", 3000)],
    itbis: 1836,
    envio: 0,
    estado: "NUEVO",
    avance: 0,
  });
  // Los de ejemplo del inicio (362 y 363 en proceso, 364 nuevo) se ordenan primero
  const orden = ["00242772362", "00242772363", "00242772364", "00242772365"];
  return lista.sort((a, b) => (orden.indexOf(a.id) === -1 ? 99 : orden.indexOf(a.id)) - (orden.indexOf(b.id) === -1 ? 99 : orden.indexOf(b.id)));
}

let pedidos: PedidoProveedor[] = iniciales();
const oyentes = new Set<() => void>();
const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};
const leer = () => pedidos;
const emitir = () => oyentes.forEach((f) => f());

export const usePedidosProveedor = () => useSyncExternalStore(suscribir, leer, leer);
export const buscarPedidoProveedor = (id: string | undefined) => pedidos.find((p) => p.id === id);

function cambiar(id: string, cambios: Partial<PedidoProveedor> | ((p: PedidoProveedor) => Partial<PedidoProveedor>)) {
  pedidos = pedidos.map((p) => (p.id === id ? { ...p, ...(typeof cambios === "function" ? cambios(p) : cambios) } : p));
  emitir();
}

export const aceptarPedido = (id: string) => cambiar(id, { estado: "EN PROCESO", avance: 5 });
export const rechazarPedido = (id: string) => cambiar(id, { estado: "RECHAZADO" });
export const cancelarPedido = (id: string) => cambiar(id, { estado: "CANCELADO" });
export const completarPedido = (id: string) => cambiar(id, { estado: "COMPLETADO", avance: 100 });
export const agregarItemPedido = (id: string, item: ItemPedido) => cambiar(id, (p) => ({ items: [...p.items, item], itbis: Math.round((subtotalPedido(p) + item.precio) * 0.18) }));
export const quitarItemPedido = (id: string, indice: number) =>
  cambiar(id, (p) => {
    const items = p.items.filter((_, i) => i !== indice);
    return { items, itbis: Math.round(items.reduce((a, i) => a + i.precio, 0) * 0.18) };
  });

export const subtotalPedido = (p: PedidoProveedor) => p.items.reduce((a, i) => a + i.precio, 0);
export const totalPedido = (p: PedidoProveedor) => subtotalPedido(p) + p.itbis + p.envio;
export const descripcionPedido = (p: PedidoProveedor) => p.items.map((i) => `${i.nombre} ${i.cantidad}`).join(", ");
export const pesosRD = (n: number) => `RD$ ${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

/** Fila para TablaPedidos (Cliente · Status · Descripción · Precio) */
export const filaPedido = (p: PedidoProveedor): PedidoFila => ({ id: p.id, cliente: p.cliente.nombre, fecha: p.fecha, img: p.cliente.img, status: p.estado, descripcion: descripcionPedido(p), precio: pesosRD(totalPedido(p)) });

/** Texto corto de progreso para las alertas de "Nuevos pedidos" */
export const resumenAlerta = (p: PedidoProveedor) => `${p.cliente.nombre} pidió ${descripcionPedido(p)} · ${p.items.length} ${p.items.length === 1 ? "producto" : "productos"} · ${pesosRD(totalPedido(p))}`;
