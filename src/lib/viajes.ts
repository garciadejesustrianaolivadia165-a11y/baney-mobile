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

export const buscarViaje = (id: string | undefined) => VIAJES.find((v) => v.id === id);

export const pesos = (n: number) => `RD$ ${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
