// Clientes que han comprado los productos del proveedor. TODO: API real.
const IMG = "/images/image_home";

export type PedidoDeCliente = { id: string; fecha: string; descripcion: string; destino: string; total: number; estado: "COMPLETADO" | "EN PROCESO" | "NO INICIADO" };

export type Cliente = {
  id: string;
  nombre: string;
  lugar: string;
  img: string;
  tipo: string;
  telefono: string;
  correo: string;
  direccion: string;
  clienteDesde: string;
  pedidos: PedidoDeCliente[];
};

export const CLIENTES: Cliente[] = [
  {
    id: "cesar-valdez", nombre: "Cesar Valdez", lugar: "San Cristóbal", img: `${IMG}/image_home_09.png`, tipo: "Comprador particular", telefono: "(809) 000-0000", correo: "cesar.valdez@gmail.com", direccion: "Barrio Los Minas, San Juan de la Maguana", clienteDesde: "Mar 2025",
    pedidos: [
      { id: "00242772362", fecha: "25 Feb 2026", descripcion: "Plátanos Banilejos 12 Dz", destino: "Calle Juan Horacio #16, Santo Domingo", total: 135000, estado: "EN PROCESO" },
      { id: "00242772201", fecha: "12 Ene 2026", descripcion: "Papas Criollas 4 qq", destino: "Barrio Los Minas, San Juan de la Maguana", total: 9600, estado: "COMPLETADO" },
      { id: "00242772105", fecha: "20 Nov 2025", descripcion: "Habichuelas Rojas 2 sacos", destino: "Barrio Los Minas, San Juan de la Maguana", total: 12400, estado: "COMPLETADO" },
      { id: "00242772044", fecha: "3 Sep 2025", descripcion: "Miel Artesanal 12 und", destino: "Barrio Los Minas, San Juan de la Maguana", total: 6000, estado: "COMPLETADO" },
    ],
  },
  {
    id: "mini-market-manolo", nombre: "Mini-Market Manolo", lugar: "Santo Domingo", img: `${IMG}/image_home_12.png`, tipo: "Minimarket", telefono: "(809) 555-0123", correo: "compras@minimanolo.do", direccion: "Av. Independencia #45, Santo Domingo", clienteDesde: "Jun 2025",
    pedidos: [
      { id: "00242772363", fecha: "25 Feb 2026", descripcion: "Pimientos Importados", destino: "Av. Independencia #45, Santo Domingo", total: 5000, estado: "EN PROCESO" },
      { id: "00242772364", fecha: "25 Feb 2026", descripcion: "Pimientos Importados", destino: "Av. Independencia #45, Santo Domingo", total: 5000, estado: "NO INICIADO" },
      { id: "00242772290", fecha: "30 Ene 2026", descripcion: "Plátanos Barahoneros 10 cajas", destino: "Av. Independencia #45, Santo Domingo", total: 8500, estado: "COMPLETADO" },
    ],
  },
  {
    id: "colmado-la-fuerza", nombre: "Colmado La Fuerza", lugar: "San Pedro De Macorís", img: `${IMG}/image_home_13.png`, tipo: "Colmado", telefono: "(809) 555-0188", correo: "colmadolafuerza@gmail.com", direccion: "Calle Duarte #88, San Pedro de Macorís", clienteDesde: "Ene 2026",
    pedidos: [{ id: "00242772310", fecha: "4 Feb 2026", descripcion: "Papas Criollas 1 qq", destino: "Calle Duarte #88, San Pedro de Macorís", total: 2400, estado: "COMPLETADO" }],
  },
  {
    id: "gardens-restaurant", nombre: "Garden's Restaurant", lugar: "Santo Domingo", img: `${IMG}/image_home_07.png`, tipo: "Restaurante", telefono: "(809) 555-0160", correo: "chef@gardensrd.com", direccion: "Plaza Naco, Santo Domingo", clienteDesde: "Oct 2025",
    pedidos: [
      { id: "00242772330", fecha: "10 Feb 2026", descripcion: "Carne Angus 60 lb", destino: "Plaza Naco, Santo Domingo", total: 25800, estado: "COMPLETADO" },
      { id: "00242772250", fecha: "18 Ene 2026", descripcion: "Carne Angus 40 lb", destino: "Plaza Naco, Santo Domingo", total: 17200, estado: "COMPLETADO" },
      { id: "00242772180", fecha: "22 Dic 2025", descripcion: "Miel Artesanal 6 und", destino: "Plaza Naco, Santo Domingo", total: 3000, estado: "COMPLETADO" },
    ],
  },
  {
    id: "luisas-comedor", nombre: "D' Luisa's Comedor", lugar: "Azua", img: `${IMG}/image_home_11.png`, tipo: "Comedor", telefono: "(809) 555-0142", correo: "luisa.comedor@gmail.com", direccion: "Calle Colón #12, Azua", clienteDesde: "Feb 2026",
    pedidos: [{ id: "00242772340", fecha: "14 Feb 2026", descripcion: "Habichuelas Rojas 1 saco", destino: "Calle Colón #12, Azua", total: 6200, estado: "COMPLETADO" }],
  },
];

export const buscarCliente = (id: string | undefined) => CLIENTES.find((c) => c.id === id);
/** Recurrente: tres o más pedidos */
export const esRecurrente = (c: Cliente) => c.pedidos.length >= 3;
export const totalComprado = (c: Cliente) => c.pedidos.filter((p) => p.estado !== "NO INICIADO").reduce((a, p) => a + p.total, 0);
export const pesos = (n: number) => `$ ${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
