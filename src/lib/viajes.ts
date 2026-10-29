// Solicitudes de transporte que ve el transportista (mapa y dashboard).
// Son los datos que el cliente llena en /solicitud (ruta · carga · pago).
export type Viaje = {
  id: string;
  cliente: string;
  empresa: string;
  telefono: string;
  img: string;
  origen: string;
  destino: string;
  distancia: string;
  material: "Materiales" | "Agregados" | "Maquinaria" | "Otro";
  detalle: string;
  peso: string;
  unidad: string;
  condiciones: string[];
  notas: string;
  programacion: string;
  publicado: string;
  transporte: string;
  precio: number;
  servicio: number;
  seguro: number;
  chip: string;
  tono: "ok" | "espera";
  /** Solo en el historial */
  estado?: "Entregado" | "Cancelado";
  fecha?: string;
  transportista?: string;
};

const IMG = "/images/image_home";

export const VIAJES: Viaje[] = [
  {
    id: "v1",
    cliente: "Ing. Ricardo P.",
    empresa: "Proyectos Verón SRL",
    telefono: "(809) 555-0147",
    img: `${IMG}/image_home_10.png`,
    origen: "Cantera Higüey, La Altagracia",
    destino: "Bávaro, Verón",
    distancia: "18 km · 25 min",
    material: "Agregados",
    detalle: "10m³ de Grava",
    peso: "10",
    unidad: "m³",
    condiciones: ["Ninguna"],
    notas: "Descarga en obra con acceso para volteo. Preguntar por el ingeniero en portería.",
    programacion: "Ahora",
    publicado: "Hace 2 min",
    transporte: "Volteo 12m³",
    precio: 3800,
    servicio: 450,
    seguro: 250,
    chip: "Disponible",
    tono: "ok",
  },
  {
    id: "v2",
    cliente: "Constructora García",
    empresa: "Constructora García & Asoc.",
    telefono: "(809) 555-0199",
    img: `${IMG}/image_home_11.png`,
    origen: "Bloquera San Pedro de Macorís",
    destino: "Punta Cana, Rep. Dom.",
    distancia: "92 km · 1 h 40 min",
    material: "Materiales",
    detalle: 'Blocks 6" – 2,000 unidades',
    peso: "20",
    unidad: "Ton",
    condiciones: ["Material delicado o frágil"],
    notas: "40 paletas, se descargan con montacargas. Entregar antes de las 4:00 PM.",
    programacion: "Programar · Hoy 2:00 PM",
    publicado: "Hace 15 min",
    transporte: "Plataforma 20 Ton",
    precio: 12800,
    servicio: 950,
    seguro: 600,
    chip: "En 45 min",
    tono: "espera",
  },
];

// Viajes ya realizados (vista Historial); abren el mismo detalle que una solicitud
export const VIAJES_HISTORIAL: Viaje[] = [
  { id: "h1", cliente: "Constructora García", empresa: "Constructora García & Asoc.", telefono: "(809) 555-0199", img: `${IMG}/image_home_11.png`, origen: "La Romana, Rep. Dom.", destino: "Santo Domingo Este, Rep. Dom.", distancia: "120 km · 2 h 10 min", material: "Agregados", detalle: "Arena Azul – 12m³", peso: "12", unidad: "m³", condiciones: ["Ninguna"], notas: "Descarga en patio trasero de la obra.", programacion: "Programado · 15 Oct 9:45 AM", publicado: "15 Oct 2023", transporte: "Volteo 12m³", precio: 4500, servicio: 450, seguro: 250, chip: "Entregado", tono: "ok", estado: "Entregado", fecha: "15 Oct 2023 • 09:45 AM", transportista: "José Rodríguez · Mack Granite ABC-1234" },
  { id: "h2", cliente: "Constructora García", empresa: "Constructora García & Asoc.", telefono: "(809) 555-0199", img: `${IMG}/image_home_11.png`, origen: "Santiago De Los Caballeros", destino: "Punta Cana, Rep. Dom.", distancia: "310 km · 4 h 30 min", material: "Materiales", detalle: 'Blocks 6" – 2,000 unid.', peso: "20", unidad: "Ton", condiciones: ["Material delicado o frágil"], notas: "40 paletas, descarga con montacargas.", programacion: "Programado · 12 Oct 2:20 PM", publicado: "12 Oct 2023", transporte: "Plataforma 20 Ton", precio: 11800, servicio: 600, seguro: 400, chip: "Entregado", tono: "ok", estado: "Entregado", fecha: "12 Oct 2023 • 14:20 PM", transportista: "Luis Peña · Isuzu NPR L654321" },
  { id: "h3", cliente: "Constructora García", empresa: "Constructora García & Asoc.", telefono: "(809) 555-0199", img: `${IMG}/image_home_11.png`, origen: "Haina, Rep. Dom.", destino: "Baní, Rep. Dom.", distancia: "45 km · 50 min", material: "Agregados", detalle: "Grava – 8m³", peso: "8", unidad: "m³", condiciones: ["Ninguna"], notas: "", programacion: "Ahora", publicado: "3 Oct 2023", transporte: "Volteo 12m³", precio: 2700, servicio: 250, seguro: 150, chip: "Cancelado", tono: "espera", estado: "Cancelado", fecha: "3 Oct 2023 • 10:10 AM" },
];

export const buscarViaje = (id: string | undefined) => [...VIAJES, ...VIAJES_HISTORIAL].find((v) => v.id === id);

export const pesos = (n: number) => `RD$ ${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
