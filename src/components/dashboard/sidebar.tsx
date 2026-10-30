import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useRouter, usePathname, type Href } from "expo-router";
import { cerrarSesion, SALIDA } from "@/lib/sesion";
import { PEDIDOS_CLIENTE } from "@/lib/pedidos-cliente";

import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { PROVEEDORES_TOP } from "@/lib/pedidos-cliente";

export type RolPanel = "proveedor" | "cliente";
import { SOMBRA } from "@/lib/estilos";

const IMG = "/images/image_home";

const iconos = {
  config:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  movil: "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2",
};

type Item = { label: string; href: Href; ruta: string; icon?: number; svg?: string; exacta?: boolean };

// Íconos oficiales del diseño (assets/images). El proveedor no ve el Marketplace:
// su catálogo es "Mis productos". El cliente tiene el Marketplace como inicio.
const PANEL: Record<RolPanel, Item[]> = {
  proveedor: [
    { label: "Inicio", href: "/dashboard", ruta: "/dashboard", icon: IMAGENES["/images/home.png"], exacta: true },
    { label: "Bandeja de entrada", href: "/dashboard/bandeja", ruta: "/dashboard/bandeja", icon: IMAGENES["/images/direct-inbox.png"] },
    { label: "Finanzas", href: "/dashboard/finanzas", ruta: "/dashboard/finanzas", icon: IMAGENES["/images/folder-open.png"] },
    { label: "Mis productos", href: "/dashboard/productos", ruta: "/dashboard/productos", icon: IMAGENES["/images/task-square.png"] },
    { label: "Clientes", href: "/dashboard/clientes", ruta: "/dashboard/clientes", icon: IMAGENES["/images/people.png"] },
    { label: "Rutas", href: "/dashboard/rutas", ruta: "/dashboard/rutas", icon: IMAGENES["/images/people.png"] },
    { label: "Favoritos", href: "/dashboard/favoritos", ruta: "/dashboard/favoritos", svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" },
  ],
  cliente: [
    { label: "Marketplace", href: "/cliente", ruta: "/cliente", icon: IMAGENES["/images/home.png"], exacta: true },
    { label: "Carrito", href: "/cliente/carrito", ruta: "/cliente/carrito", svg: "M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.6L20 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" },
    { label: "Historial", href: "/cliente/historial", ruta: "/cliente/historial", icon: IMAGENES["/images/task-square.png"] },
    { label: "Favoritos", href: "/cliente/favoritos", ruta: "/cliente/favoritos", svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" },
    { label: "Notificaciones", href: "/cliente/notificaciones", ruta: "/cliente/notificaciones", icon: IMAGENES["/images/direct-inbox.png"] },
  ],
};
const CONFIG: Record<RolPanel, Item[]> = {
  proveedor: [
    { label: "Mensajes", href: "/chat", ruta: "/chat", svg: ICONOS.mensaje },
    { label: "Configuración", href: "/dashboard/configuracion", ruta: "/dashboard/configuracion", svg: iconos.config },
  ],
  cliente: [
    { label: "Mensajes", href: "/chat", ruta: "/chat", svg: ICONOS.mensaje },
    { label: "Métodos de pago", href: "/cliente/pagos", ruta: "/cliente/pagos", svg: ICONOS.tarjeta },
    { label: "Configuración", href: "/cliente/configuracion", ruta: "/cliente/configuracion", svg: iconos.config },
  ],
};

const proveedores = [
  { id: "maria-perez", nombre: "Maria Perez", lugar: "San Juan De La Maguana", img: `${IMG}/image_home_11.png` },
  { id: "juan-garcia", nombre: "Juan Garcia", lugar: "San Pedro De Macorís", img: `${IMG}/image_home_10.png` },
  { id: "agromerca-rd", nombre: "AgroMerca RD", lugar: "Santo Domingo", img: `${IMG}/image_home_08.png` },
];

// Menú lateral del dashboard. En teléfono se abre como cajón desde el botón de
// menú de dashboard/_layout.tsx; a partir de 1024 px va fijo a la izquierda.
export default function Sidebar({ abierto = false, onCerrar, fijo = false, rol = "proveedor" }: { abierto?: boolean; onCerrar?: () => void; fijo?: boolean; rol?: RolPanel }) {
  const router = useRouter();
  const ruta = usePathname();
  const panelGeneral = PANEL[rol];
  if (!fijo && !abierto) return null;

  const ir = (href: Href) => {
    onCerrar?.();
    router.push(href);
  };
  const activo = (item: Item) => (item.exacta ? ruta === item.ruta : ruta.startsWith(item.ruta));

  const panel = (
    <ScrollView
      style={SOMBRA.card}
      className={`rounded-3xl bg-white ${fijo ? "w-64" : "w-[17rem]"}`}
      contentContainerClassName="flex-grow p-6"
      showsVerticalScrollIndicator={false}
    >
      <Pressable accessibilityRole="link" onPress={() => ir(rol === "cliente" ? "/cliente" : "/home")}>
        <Image source={IMAGENES["/logos/Logo_Horizontal_baney_png.png"]} accessibilityLabel="BANEY" contentFit="contain" style={{ width: 146, height: 44 }} />
      </Pressable>

      <Texto className="mt-12 text-[17px] font-bold text-[#3F443D]">PANEL GENERAL</Texto>
      <View className="mt-5 gap-3">
        {panelGeneral.map((item) => (
          <Pressable key={item.label} accessibilityRole="link" onPress={() => ir(item.href)} className="flex-row items-center gap-3 px-1 py-2.5 active:opacity-60">
            {item.svg ? <Icono d={item.svg} size={20} color={activo(item) ? "#5d7f4d" : "#3F443D"} /> : <Image source={item.icon} contentFit="contain" style={{ width: 20, height: 20 }} />}
            <Texto className={`text-base font-medium ${activo(item) ? "text-primary-400" : "text-[#3F443D]"}`}>{item.label}</Texto>
          </Pressable>
        ))}
      </View>

      {rol === "cliente" ? (
        <>
          <Texto className="mt-16 text-[17px] font-bold text-[#3F443D]">TUS TOP 3 PROVEEDORES</Texto>
          <View className="mt-5 gap-4">
            {PROVEEDORES_TOP.map((p) => (
              <Pressable
                key={p.id}
                accessibilityRole="link"
                accessibilityLabel={`Ver último pedido a ${p.nombre}`}
                onPress={() => {
                  const ultimo = PEDIDOS_CLIENTE.find((x) => x.proveedor.id === p.id);
                  ir(ultimo ? { pathname: "/cliente/pedido/[id]", params: { id: ultimo.id } } : "/cliente/historial");
                }}
                className="flex-row items-center gap-3 px-1 active:opacity-60"
              >
                <Image source={imagen(p.img)} accessibilityLabel={p.nombre} contentFit="cover" style={{ width: 36, height: 36, borderRadius: 18 }} />
                <View className="min-w-0 flex-1">
                  <Texto numberOfLines={1} className="text-sm font-semibold text-[#3F443D]">{p.nombre}</Texto>
                  <Texto numberOfLines={1} className="text-xs text-neutral-500">{p.pedidos} pedidos · {p.lugar}</Texto>
                </View>
                <Icono d={ICONOS.chevron} size={16} color="#B9C0CB" strokeWidth={1.6} />
              </Pressable>
            ))}
          </View>
        </>
      ) : (
      <>
      <Texto className="mt-16 text-[17px] font-bold text-[#3F443D]">OTROS PROVEEDORES</Texto>
      <View className="mt-5 gap-4">
        {proveedores.map((p) => (
          <Pressable key={p.nombre} accessibilityRole="link" onPress={() => ir({ pathname: "/dashboard/proveedores/[id]", params: { id: p.id } })} className="flex-row items-center gap-3 px-1 active:opacity-60">
            <Image source={IMAGENES[p.img as keyof typeof IMAGENES]} accessibilityLabel={p.nombre} contentFit="cover" style={{ width: 36, height: 36, borderRadius: 18 }} />
            <View className="min-w-0 flex-1">
              <Texto numberOfLines={1} className="text-sm font-semibold text-[#3F443D]">{p.nombre}</Texto>
              <Texto numberOfLines={1} className="text-xs text-neutral-500">{p.lugar}</Texto>
            </View>
          </Pressable>
        ))}
      </View>
      </>
      )}

      <View className="mt-auto pt-10">
        <Texto className="text-[17px] font-bold text-[#3F443D]">CONFIGURACIÓN</Texto>
        <View className="mt-5 gap-3">
          {CONFIG[rol].map((item) => (
            <Pressable key={item.label} accessibilityRole="link" onPress={() => ir(item.href)} className="flex-row items-center gap-3 px-1 py-2.5 active:opacity-60">
              <Icono d={item.svg ?? ""} size={20} color={activo(item) ? "#5d7f4d" : "#3F443D"} />
              <Texto className={`text-base font-medium ${activo(item) ? "text-primary-400" : "text-[#3F443D]"}`}>{item.label}</Texto>
            </Pressable>
          ))}
          <Pressable accessibilityRole="link" onPress={() => { onCerrar?.(); cerrarSesion(); router.replace(SALIDA); }} className="flex-row items-center gap-3 px-1 py-2.5 active:opacity-60">
            <Icono d={ICONOS.salir} size={20} color="#ef4444" />
            <Texto className="text-[15px] font-medium text-error-500">Cerrar Sección</Texto>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );

  if (fijo) return panel;

  return (
    <View className="absolute inset-0 z-50">
      <Pressable accessibilityRole="button" accessibilityLabel="Cerrar menú" onPress={onCerrar} className="absolute inset-0 bg-black/40" />
      <View className="absolute bottom-3 left-3 top-3">{panel}</View>
    </View>
  );
}
