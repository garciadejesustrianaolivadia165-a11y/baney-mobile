import { buscarPedidoProveedor, type PedidoProveedor } from "@/lib/pedidos-proveedor";

// Pedidos en curso del proveedor (Rutas): el pedido del cliente más el transportista
// que lo lleva y su avance. TODO: API real (Transport Service).
export type Transportista = { nombre: string; avatar: string; vehiculo: string; placa: string; telefono: string; calificacion: number };

export type PedidoEnCurso = {
  pedido: PedidoProveedor;
  transportista: Transportista;
  origen: string;
  /** Minutos para llegar y kilómetros restantes */
  llegadaMin: number;
  km: number;
};

const IMG = "/images/image_home";
const TRANSPORTISTAS: Transportista[] = [
  { nombre: "Ing. Ricardo Peña", avatar: `${IMG}/image_home_10.png`, vehiculo: "Camión Mack · 25 Ton", placa: "L123456", telefono: "+18098843392", calificacion: 4.9 },
  { nombre: "Ramón Medina", avatar: `${IMG}/image_home_11.png`, vehiculo: "Camioneta Hilux · 1 Ton", placa: "L448120", telefono: "+18295550140", calificacion: 4.7 },
  { nombre: "Transportes del Sur", avatar: `${IMG}/image_home_08.png`, vehiculo: "Camión Isuzu · 8 Ton", placa: "L990211", telefono: "+18095550199", calificacion: 4.8 },
];

/** Transportista y tiempos de un pedido, estables por id (TODO: Transport Service) */
export function buscarPedidoEnCurso(id: string | undefined): PedidoEnCurso | undefined {
  const pedido = buscarPedidoProveedor(id);
  if (!pedido) return undefined;
  const semilla = Number(pedido.id.slice(-3)) || 0;
  const km = 4 + (semilla % 18);
  return {
    pedido,
    transportista: TRANSPORTISTAS[semilla % TRANSPORTISTAS.length],
    origen: "Haina, San Cristóbal",
    llegadaMin: pedido.estado === "EN PROCESO" ? Math.max(3, Math.round((100 - pedido.avance) * 0.4)) : 0,
    km: pedido.estado === "EN PROCESO" ? Math.max(1, Math.round((km * (100 - pedido.avance)) / 100)) : 0,
  };
}
