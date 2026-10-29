import type { Product } from "@/types/product";

const IMG = "/images/image_home";

export const AVATARES = [
  `${IMG}/image_home_09.png`,
  `${IMG}/image_home_10.png`,
  `${IMG}/image_home_11.png`,
  `${IMG}/image_home_12.png`,
];

/** Foto de producto del marketplace: el guineo de public/images/image_home */
export const FOTO_PRODUCTO = `${IMG}/image_home_16.png`;

const FOTOS = Array.from({ length: 16 }, () => "image_home_16");

export const CATEGORIAS = [
  "Todas las áreas",
  "Cereales",
  "Legumbres",
  "Industriales",
  "Artesanales",
  "Hortalizas",
  "Frutas",
];

export const SUGERENCIAS = [
  "Carnes y Reces",
  "Productos Congelados",
  "Productos Ornamentales",
  "Apicultura",
  "Veterinaria",
];

export type ProductoCatalogo = Product & { categoria: string };

/** Catálogo de ejemplo; se reemplazará por la API manteniendo la interfaz Product */
export const CATALOGO: ProductoCatalogo[] = FOTOS.map((foto, i) => ({
  id: String(i + 1),
  name: "Vegetales Variados",
  image: `${IMG}/${foto}.png`,
  price: 300,
  currency: "RD$ ",
  rating: i % 4 === 0 ? 4 : 5,
  seller: {
    name: "Juan Pedro García",
    avatar: AVATARES[i % AVATARES.length],
    location: "AgroMerca RD",
  },
  categoria: CATEGORIAS[(i % (CATEGORIAS.length - 1)) + 1],
}));

/** Productos relacionados de la ficha de detalle */
export const RELACIONADOS = [
  { id: "r1", nombre: "Guineo Criollo", img: FOTO_PRODUCTO },
  { id: "r2", nombre: "Guineo Manzano", img: FOTO_PRODUCTO },
  { id: "r3", nombre: "Guineo Verde", img: FOTO_PRODUCTO },
  { id: "r4", nombre: "Guineo Maduro", img: FOTO_PRODUCTO },
  { id: "r5", nombre: "Plátanos Barahoneros", img: FOTO_PRODUCTO },
  { id: "r6", nombre: "Guineo Orgánico", img: FOTO_PRODUCTO },
];

export const GALERIA = Array.from({ length: 5 }, () => FOTO_PRODUCTO);

export const LOREM_PRODUCTO =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam";
