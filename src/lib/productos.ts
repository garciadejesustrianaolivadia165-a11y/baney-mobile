import type { Product } from "@/types/product";

const IMG = "/images/image_home";

export const AVATARES = [`${IMG}/image_home_09.png`, `${IMG}/image_home_10.png`, `${IMG}/image_home_11.png`, `${IMG}/image_home_12.png`];

/** Foto de producto del marketplace: el guineo de public/images/image_home */
export const FOTO_PRODUCTO = `${IMG}/image_home_16.png`;

export const CATEGORIAS = ["Todas las áreas", "Cereales", "Legumbres", "Industriales", "Artesanales", "Hortalizas", "Frutas"];

export const SUGERENCIAS = ["Carnes y Reces", "Productos Congelados", "Productos Ornamentales", "Apicultura", "Veterinaria"];

export type ProductoCatalogo = Product & { categoria: string; descripcion: string; unidad: string };

const VENDEDORES = [
  { name: "Juan Pedro García", avatar: AVATARES[0], location: "AgroMerca RD" },
  { name: "María Santos", avatar: AVATARES[2], location: "Constanza" },
  { name: "Finca López", avatar: AVATARES[1], location: "Azua" },
  { name: "Rancho Díaz", avatar: AVATARES[3], location: "Higüey" },
  { name: "Apiario Marte", avatar: AVATARES[1], location: "Jarabacoa" },
  { name: "Hermanos Rodríguez", avatar: AVATARES[0], location: "San Juan de la Maguana" },
];

// Fotos oficiales disponibles: papas (14), carne (15), guineos (16), miel (17),
// puesto de hortalizas (04) y campo de cultivo (03). TODO: fotos reales de cada producto.
const F = { papas: `${IMG}/image_home_14.png`, carne: `${IMG}/image_home_15.png`, guineos: `${IMG}/image_home_16.png`, miel: `${IMG}/image_home_17.png`, hortalizas: `${IMG}/image_home_04.png`, campo: `${IMG}/image_home_03.png` };

const BASE: [string, string, string, number, string, number, number, string][] = [
  // nombre, categoría, foto, precio, unidad, rating, vendedor, descripción
  ["Guineos Criollos", "Frutas", F.guineos, 300, "racimo", 5, 0, "Guineo criollo madurado en mata, cosecha de la semana. Racimos de 8 a 10 manos."],
  ["Papas Criollas", "Hortalizas", F.papas, 2400, "qq", 5, 1, "Papa criolla lavada, calibre mediano, de los campos de Constanza."],
  ["Carne Angus", "Industriales", F.carne, 430, "lb", 4, 3, "Corte premium refrigerado, empaque al vacío, trazabilidad por lote."],
  ["Miel Artesanal", "Artesanales", F.miel, 500, "frasco", 5, 4, "Miel multifloral de colmenas de montaña, sin calentar ni filtrar."],
  ["Plátanos Barahoneros", "Frutas", F.guineos, 850, "caja", 4, 5, "Plátano barahonero de primera, cajas de 50 unidades para colmados y restaurantes."],
  ["Lechuga Repollada", "Hortalizas", F.hortalizas, 95, "unidad", 4, 1, "Lechuga hidropónica cosechada el mismo día del despacho."],
  ["Maíz Tierno", "Cereales", F.campo, 1200, "saco", 4, 2, "Mazorcas tiernas para hervir o asar, sacos de 100 unidades."],
  ["Habichuelas Rojas", "Legumbres", F.campo, 6200, "saco", 5, 5, "Habichuela roja seca de San Juan, saco de 100 lb, grano parejo."],
  ["Papas Blancas", "Hortalizas", F.papas, 2100, "qq", 4, 1, "Papa blanca para freír, calibre grande, lavada y seleccionada."],
  ["Res Premium", "Industriales", F.carne, 520, "lb", 4, 3, "Cortes de res de pastoreo, maduración de 14 días."],
  ["Guineos Verdes", "Frutas", F.guineos, 240, "racimo", 4, 2, "Guineo verde para hervir, racimos pesados, ideal para mangú."],
  ["Miel de Abeja Pura", "Artesanales", F.miel, 450, "frasco", 5, 4, "Miel clara de flor de cajuil, frasco de 32 onzas."],
  ["Tomates de Ensalada", "Hortalizas", F.hortalizas, 1800, "caja", 4, 1, "Tomate de ensalada firme, caja de 25 lb, madurez pareja."],
  ["Arroz Selecto", "Cereales", F.campo, 3200, "saco", 5, 5, "Arroz grano largo del Bajo Yuna, saco de 100 lb."],
  ["Cebolla Roja", "Hortalizas", F.hortalizas, 1500, "saco", 4, 2, "Cebolla roja de Baní, saco de 50 lb, secada al sol."],
  ["Gandules Verdes", "Legumbres", F.campo, 95, "lb", 5, 5, "Gandul verde desgranado, listo para el moro de Navidad."],
];

/** Catálogo de ejemplo; se reemplazará por la API manteniendo la interfaz Product */
export const CATALOGO: ProductoCatalogo[] = BASE.map(([name, categoria, image, price, unidad, rating, vendedor, descripcion], i) => ({
  id: String(i + 1),
  name,
  image,
  price,
  currency: "RD$ ",
  rating,
  seller: VENDEDORES[vendedor],
  categoria,
  descripcion,
  unidad,
}));

export const buscarProducto = (id: string | undefined) => CATALOGO.find((p) => p.id === id);

/** Productos de la misma categoría (o los primeros del catálogo) para la ficha */
export const relacionadosDe = (p: ProductoCatalogo | undefined, n = 6) => {
  const otros = CATALOGO.filter((x) => x.id !== p?.id);
  const misma = p ? otros.filter((x) => x.categoria === p.categoria) : [];
  return [...misma, ...otros.filter((x) => !misma.includes(x))].slice(0, n);
};

export const GALERIA = Array.from({ length: 5 }, () => FOTO_PRODUCTO);
