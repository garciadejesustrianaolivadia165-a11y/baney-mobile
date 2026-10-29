import type { Product } from "@/types/product";

// Otros proveedores del ecosistema (menú lateral del proveedor). TODO: API real.
const IMG = "/images/image_home";

export type Proveedor = {
  id: string;
  nombre: string;
  lugar: string;
  img: string;
  empresa: { nombre: string; rnc: string; telefono: string; correo: string; direccion: string };
  descripcion: string;
  categorias: string[];
  desde: string;
  calificacion: number;
  productos: Product[];
};

const producto = (id: string, name: string, image: string, price: number, rating: number, seller: Proveedor["id"], nombre: string, lugar: string, avatar: string): Product => ({ id, name, image, price, currency: "RD$ ", rating, seller: { name: nombre, avatar, location: lugar } });

export const PROVEEDORES: Proveedor[] = [
  {
    id: "maria-perez", nombre: "Maria Perez", lugar: "San Juan De La Maguana", img: `${IMG}/image_home_11.png`,
    empresa: { nombre: "Finca Doña María", rnc: "1-30-44120-5", telefono: "(809) 555-0171", correo: "ventas@fincadonamaria.do", direccion: "Carretera Sánchez km 4, San Juan de la Maguana" },
    descripcion: "Productora de habichuelas, plátanos y hortalizas del valle de San Juan. Cosecha propia y entrega semanal a Santo Domingo.", categorias: ["Legumbres", "Hortalizas", "Frutas"], desde: "2023", calificacion: 4.8,
    productos: [
      producto("mp1", "Habichuelas Rojas", `${IMG}/image_home_03.png`, 6200, 5, "maria-perez", "Maria Perez", "San Juan", `${IMG}/image_home_11.png`),
      producto("mp2", "Plátanos Barahoneros", `${IMG}/image_home_16.png`, 850, 4, "maria-perez", "Maria Perez", "San Juan", `${IMG}/image_home_11.png`),
      producto("mp3", "Papas Criollas", `${IMG}/image_home_14.png`, 2400, 5, "maria-perez", "Maria Perez", "San Juan", `${IMG}/image_home_11.png`),
      producto("mp4", "Zanahorias Criollas", `/images/image_inicio/image_inicio_01.png`, 1050, 4, "maria-perez", "Maria Perez", "San Juan", `${IMG}/image_home_11.png`),
    ],
  },
  {
    id: "juan-garcia", nombre: "Juan Garcia", lugar: "San Pedro De Macorís", img: `${IMG}/image_home_10.png`,
    empresa: { nombre: "Ganadería García SRL", rnc: "1-31-77810-2", telefono: "(809) 555-0129", correo: "pedidos@ganaderiagarcia.do", direccion: "Ingenio Consuelo, San Pedro de Macorís" },
    descripcion: "Carnes premium y productos de origen animal con empaque al vacío. Cadena de frío garantizada hasta la entrega.", categorias: ["Industriales", "Artesanales"], desde: "2022", calificacion: 4.9,
    productos: [
      producto("jg1", "Carne Angus", `${IMG}/image_home_15.png`, 430, 5, "juan-garcia", "Juan Garcia", "San Pedro", `${IMG}/image_home_10.png`),
      producto("jg2", "Res Premium", `${IMG}/image_home_15.png`, 520, 4, "juan-garcia", "Juan Garcia", "San Pedro", `${IMG}/image_home_10.png`),
      producto("jg3", "Miel Artesanal", `${IMG}/image_home_17.png`, 500, 5, "juan-garcia", "Juan Garcia", "San Pedro", `${IMG}/image_home_10.png`),
    ],
  },
  {
    id: "agromerca-rd", nombre: "AgroMerca RD", lugar: "Santo Domingo", img: `${IMG}/image_home_08.png`,
    empresa: { nombre: "AgroMerca RD SRL", rnc: "1-32-00517-8", telefono: "(809) 555-0100", correo: "info@agromerca.do", direccion: "Mercado Nuevo, Av. Duarte, Santo Domingo" },
    descripcion: "Distribuidor mayorista de frutas y vegetales variados para colmados, supermercados y restaurantes.", categorias: ["Frutas", "Hortalizas", "Cereales"], desde: "2021", calificacion: 4.6,
    productos: [
      producto("am1", "Vegetales Variados", `${IMG}/image_home_16.png`, 300, 4, "agromerca-rd", "AgroMerca RD", "Santo Domingo", `${IMG}/image_home_08.png`),
      producto("am2", "Pimientos Maduros", `/images/image_inicio/image_inicio_02.png`, 180, 5, "agromerca-rd", "AgroMerca RD", "Santo Domingo", `${IMG}/image_home_08.png`),
      producto("am3", "Maíz Tierno", `/images/image_inicio/image_inicio_03.png`, 95, 4, "agromerca-rd", "AgroMerca RD", "Santo Domingo", `${IMG}/image_home_08.png`),
      producto("am4", "Guineos Verdes", `${IMG}/image_home_16.png`, 8, 4, "agromerca-rd", "AgroMerca RD", "Santo Domingo", `${IMG}/image_home_08.png`),
    ],
  },
];

export const buscarProveedor = (id: string | undefined) => PROVEEDORES.find((p) => p.id === id);
