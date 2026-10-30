import { useSyncExternalStore } from "react";

// Chat entre las partes de un pedido o viaje (Chat Service, Período 5). Conversaciones
// en memoria con respuesta simulada. TODO: API real + websockets.
export type Mensaje = { id: string; de: "yo" | "otro"; texto: string; hora: string };
export type Contacto = { nombre: string; avatar: string; rol: string };
export type Conversacion = { id: string; con: Contacto; mensajes: Mensaje[]; noLeidos: number };

const IMG = "/images/image_home";
const hora = (d = new Date()) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

let conversaciones: Conversacion[] = [
  {
    id: "c1",
    con: { nombre: "Ing. Ricardo Peña", avatar: `${IMG}/image_home_10.png`, rol: "Transportista" },
    noLeidos: 2,
    mensajes: [
      { id: "m1", de: "otro", texto: "Buenos días, ya cargué los plátanos en Haina. Salgo en 10 minutos.", hora: "08:40 AM" },
      { id: "m2", de: "yo", texto: "Perfecto, el cliente lo espera antes del mediodía.", hora: "08:42 AM" },
      { id: "m3", de: "otro", texto: "Hay tráfico en la 6 de Noviembre, voy por la Autopista Duarte. Llego 11:30.", hora: "10:05 AM" },
      { id: "m4", de: "otro", texto: "¿El colmado tiene rampa para descargar?", hora: "10:06 AM" },
    ],
  },
  {
    id: "c2",
    con: { nombre: "Cesar Valdez", avatar: `${IMG}/image_home_09.png`, rol: "Cliente" },
    noLeidos: 0,
    mensajes: [
      { id: "m1", de: "otro", texto: "¿Las papas vienen lavadas?", hora: "Ayer" },
      { id: "m2", de: "yo", texto: "Sí, lavadas y en sacos de 100 lb.", hora: "Ayer" },
    ],
  },
];

const oyentes = new Set<() => void>();
const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};
const leer = () => conversaciones;
const emitir = () => oyentes.forEach((f) => f());

export const useConversaciones = () => useSyncExternalStore(suscribir, leer, leer);
export const buscarConversacion = (id: string | undefined) => conversaciones.find((c) => c.id === id);
export const noLeidosTotal = (lista: Conversacion[]) => lista.reduce((a, c) => a + c.noLeidos, 0);

/** Devuelve el id del chat con esa persona (lo crea si no existe) */
export function abrirChatCon(con: Contacto) {
  const existente = conversaciones.find((c) => c.con.nombre === con.nombre);
  if (existente) return existente.id;
  const nueva: Conversacion = { id: `c${Date.now()}`, con, mensajes: [], noLeidos: 0 };
  conversaciones = [nueva, ...conversaciones];
  emitir();
  return nueva.id;
}

export function marcarLeida(id: string) {
  if (!conversaciones.find((c) => c.id === id && c.noLeidos > 0)) return;
  conversaciones = conversaciones.map((c) => (c.id === id ? { ...c, noLeidos: 0 } : c));
  emitir();
}

const RESPUESTAS = ["Recibido, gracias.", "Dame un momento y te confirmo.", "Listo, lo tengo anotado.", "Perfecto, nos vemos en el destino.", "Te aviso cuando esté cerca."];

/** Envía un mensaje y simula la respuesta de la otra parte */
export function enviarMensaje(id: string, texto: string) {
  const limpio = texto.trim();
  if (!limpio) return;
  const agregar = (de: Mensaje["de"], t: string) => {
    conversaciones = conversaciones.map((c) => (c.id === id ? { ...c, mensajes: [...c.mensajes, { id: `m${Date.now()}${Math.random().toString(16).slice(2, 6)}`, de, texto: t, hora: hora() }] } : c));
    emitir();
  };
  agregar("yo", limpio);
  setTimeout(() => agregar("otro", RESPUESTAS[limpio.length % RESPUESTAS.length]), 1500);
}
