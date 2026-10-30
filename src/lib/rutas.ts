import { CLIENTES, type Cliente, type PedidoDeCliente } from "@/lib/clientes";

// Pedidos en curso del proveedor (Rutas): el pedido del cliente más el transportista
// que lo lleva y su avance. TODO: API real (Transport Service).
export type Transportista = { nombre: string; avatar: string; vehiculo: string; placa: string; telefono: string; calificacion: number };

export type PedidoEnCurso = {
  cliente: Cliente;
  pedido: PedidoDeCliente;
  transportista: Transportista;
  origen: string;
  /** Minutos para llegar y kilómetros restantes */
  llegadaMin: number;
  km: number;
  /** 0–100 */
  avance: number;
  item: { nombre: string; cantidad: string; img: string };
};

const IMG = "/images/image_home";
const TRANSPORTISTAS: Transportista[] = [
  { nombre: "Ing. Ricardo Peña", avatar: `${IMG}/image_home_10.png`, vehiculo: "Camión Mack · 25 Ton", placa: "L123456", telefono: "+18098843392", calificacion: 4.9 },
  { nombre: "Ramón Medina", avatar: `${IMG}/image_home_11.png`, vehiculo: "Camioneta Hilux · 1 Ton", placa: "L448120", telefono: "+18295550140", calificacion: 4.7 },
  { nombre: "Transportes del Sur", avatar: `${IMG}/image_home_08.png`, vehiculo: "Camión Isuzu · 8 Ton", placa: "L990211", telefono: "+18095550199", calificacion: 4.8 },
];
/** Foto según el producto del pedido (mismas fotos del marketplace) */
function fotoDe(descripcion: string) {
  const d = descripcion.toLowerCase();
  if (/pl[aá]tano|guineo/.test(d)) return `${IMG}/image_home_16.png`;
  if (/papa/.test(d)) return `${IMG}/image_home_14.png`;
  if (/carne|res/.test(d)) return `${IMG}/image_home_15.png`;
  if (/miel/.test(d)) return `${IMG}/image_home_17.png`;
  if (/pimiento/.test(d)) return `${IMG}/image_home_04.png`;
  return `${IMG}/image_home_03.png`;
}

/** Busca el pedido en los clientes y le asigna transportista y avance de forma estable por id */
export function buscarPedidoEnCurso(id: string | undefined): PedidoEnCurso | undefined {
  if (!id) return undefined;
  for (const cliente of CLIENTES) {
    const pedido = cliente.pedidos.find((p) => p.id === id);
    if (!pedido) continue;
    const semilla = Number(id.slice(-3)) || 0;
    const m = pedido.descripcion.match(/^(.*?)\s+(\d+\s+\S+)$/);
    const avance = pedido.estado === "COMPLETADO" ? 100 : pedido.estado === "NO INICIADO" ? 0 : 20 + (semilla % 60);
    return {
      cliente,
      pedido,
      transportista: TRANSPORTISTAS[semilla % TRANSPORTISTAS.length],
      origen: "Haina, San Cristóbal",
      llegadaMin: pedido.estado === "COMPLETADO" ? 0 : 12 + (semilla % 40),
      km: 4 + (semilla % 18),
      avance,
      item: { nombre: m ? m[1] : pedido.descripcion, cantidad: m ? m[2] : "1 pedido", img: fotoDe(pedido.descripcion) },
    };
  }
  return undefined;
}
