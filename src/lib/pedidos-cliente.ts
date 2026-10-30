import { useSyncExternalStore } from "react";
import { plural, type ItemCarrito } from "@/lib/carrito";

// Pedidos de productos del cliente (Historial del marketplace). TODO: API real.
export type PedidoCliente = {
  id: string;
  fecha: string;
  proveedor: { id: string; nombre: string; lugar: string; img: string };
  items: { nombre: string; categoria: string; cantidad: string; precio: number; img: string }[];
  itbis: number;
  envio: number;
  estado: "Entregado" | "En camino" | "Cancelado";
  direccion: string;
  /** Cómo se pagó (solo los pedidos hechos desde la app) */
  metodoPago?: string;
  entrega?: "Transporte BANEY" | "Recoger en la finca";
};

const IMG = "/images/image_home";

export const PROVEEDORES_TOP = [
  { id: "maria-perez", nombre: "Maria Perez", lugar: "San Juan De La Maguana", img: `${IMG}/image_home_11.png`, pedidos: 12 },
  { id: "juan-garcia", nombre: "Juan Garcia", lugar: "San Pedro De Macorís", img: `${IMG}/image_home_10.png`, pedidos: 8 },
  { id: "agromerca-rd", nombre: "AgroMerca RD", lugar: "Santo Domingo", img: `${IMG}/image_home_08.png`, pedidos: 5 },
];

export const PEDIDOS_CLIENTE: PedidoCliente[] = [
  {
    id: "00242772362",
    fecha: "25 Feb 2026 • 09:45 AM",
    proveedor: PROVEEDORES_TOP[0],
    items: [
      { nombre: "Plátanos Banilejos", categoria: "Frutas", cantidad: "12 docenas", precio: 1800, img: `${IMG}/image_home_16.png` },
      { nombre: "Papas Criollas", categoria: "Hortalizas", cantidad: "2 qq", precio: 4800, img: `${IMG}/image_home_14.png` },
    ],
    itbis: 1188,
    envio: 650,
    estado: "En camino",
    direccion: "Calle Juan Horacio #16, Santo Domingo",
  },
  {
    id: "00242772301",
    fecha: "18 Feb 2026 • 02:20 PM",
    proveedor: PROVEEDORES_TOP[1],
    items: [{ nombre: "Carne Angus", categoria: "Industriales", cantidad: "40 lb", precio: 17200, img: `${IMG}/image_home_15.png` }],
    itbis: 3096,
    envio: 900,
    estado: "Entregado",
    direccion: "Calle Juan Horacio #16, Santo Domingo",
  },
  {
    id: "00242772280",
    fecha: "3 Feb 2026 • 10:10 AM",
    proveedor: PROVEEDORES_TOP[2],
    items: [{ nombre: "Miel Artesanal", categoria: "Artesanales", cantidad: "24 unidades", precio: 12000, img: `${IMG}/image_home_17.png` }],
    itbis: 2160,
    envio: 0,
    estado: "Cancelado",
    direccion: "Calle Juan Horacio #16, Santo Domingo",
  },
];

let pedidos: PedidoCliente[] = PEDIDOS_CLIENTE;
const oyentes = new Set<() => void>();
const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};
const leer = () => pedidos;

/** Lista viva de pedidos (los de ejemplo más los creados desde el checkout) */
export const usePedidosCliente = () => useSyncExternalStore(suscribir, leer, leer);
export const buscarPedidoCliente = (id: string | undefined) => pedidos.find((p) => p.id === id);

/** Crea el pedido al confirmar el checkout y lo pone primero en el historial */
export function crearPedidoCliente(items: ItemCarrito[], datos: { direccion: string; envio: number; metodoPago: string; entrega: PedidoCliente["entrega"] }) {
  const primero = items[0]?.producto.seller;
  const ahora = new Date();
  const fecha = `${ahora.getDate()} ${["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][ahora.getMonth()]} ${ahora.getFullYear()} • ${ahora.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
  const subtotal = items.reduce((a, i) => a + i.producto.price * i.cantidad, 0);
  const pedido: PedidoCliente = {
    id: String(242772362 + pedidos.length + 1).padStart(11, "0"),
    fecha,
    proveedor: { id: primero ? primero.name.toLowerCase().replace(/\s+/g, "-") : "baney", nombre: primero?.name ?? "BANEY", lugar: primero?.location ?? "", img: primero?.avatar ?? `${IMG}/image_home_08.png` },
    items: items.map((i) => ({ nombre: i.producto.name, categoria: i.categoria ?? "Marketplace", cantidad: plural(i.cantidad, i.unidad), precio: i.producto.price * i.cantidad, img: i.producto.image })),
    itbis: Math.round(subtotal * 0.18),
    envio: datos.envio,
    estado: "En camino",
    direccion: datos.direccion,
    metodoPago: datos.metodoPago,
    entrega: datos.entrega,
  };
  pedidos = [pedido, ...pedidos];
  oyentes.forEach((f) => f());
  return pedido;
}
export const subtotalPedido = (p: PedidoCliente) => p.items.reduce((a, i) => a + i.precio, 0);
export const totalPedido = (p: PedidoCliente) => (p.estado === "Cancelado" ? 0 : subtotalPedido(p) + p.itbis + p.envio);
export const pesos = (n: number) => `RD$ ${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
