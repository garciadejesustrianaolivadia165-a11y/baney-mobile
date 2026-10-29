import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useRouter, usePathname, type Href } from "expo-router";

import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";

const IMG = "/images/image_home";

const iconos = {
  config:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  movil: "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2",
};

// Íconos oficiales del diseño (assets/images)
const panelGeneral: { label: string; href: Href; ruta: string; icon?: number; svg?: string; exacta?: boolean }[] = [
  { label: "Inicio", href: "/dashboard", ruta: "/dashboard", icon: IMAGENES["/images/home.png"], exacta: true },
  { label: "Bandeja de entrada", href: "/dashboard/bandeja", ruta: "/dashboard/bandeja", icon: IMAGENES["/images/direct-inbox.png"] },
  { label: "Finanzas", href: "/dashboard/finanzas", ruta: "/dashboard/finanzas", icon: IMAGENES["/images/folder-open.png"] },
  { label: "Mis productos", href: "/dashboard/productos", ruta: "/dashboard/productos", icon: IMAGENES["/images/task-square.png"] },
  { label: "Marketplace", href: "/marketplace", ruta: "/marketplace", icon: IMAGENES["/images/folder-open.png"] },
  { label: "Clientes", href: "/dashboard/clientes", ruta: "/dashboard/clientes", icon: IMAGENES["/images/people.png"] },
  { label: "Rutas", href: "/dashboard/rutas", ruta: "/dashboard/rutas", icon: IMAGENES["/images/people.png"] },
  { label: "Mobile", href: "/onboarding", ruta: "/onboarding", svg: iconos.movil },
];

const proveedores = [
  { id: "maria-perez", nombre: "Maria Perez", lugar: "San Juan De La Maguana", img: `${IMG}/image_home_11.png` },
  { id: "juan-garcia", nombre: "Juan Garcia", lugar: "San Pedro De Macorís", img: `${IMG}/image_home_10.png` },
  { id: "agromerca-rd", nombre: "AgroMerca RD", lugar: "Santo Domingo", img: `${IMG}/image_home_08.png` },
];

// Menú lateral del dashboard. En teléfono se abre como cajón desde el botón de
// menú de dashboard/_layout.tsx; a partir de 1024 px va fijo a la izquierda.
export default function Sidebar({ abierto = false, onCerrar, fijo = false }: { abierto?: boolean; onCerrar?: () => void; fijo?: boolean }) {
  const router = useRouter();
  const ruta = usePathname();
  if (!fijo && !abierto) return null;

  const ir = (href: Href) => {
    onCerrar?.();
    router.push(href);
  };
  const activo = (item: (typeof panelGeneral)[number]) => (item.exacta ? ruta === item.ruta : ruta.startsWith(item.ruta));

  const panel = (
    <ScrollView
      style={SOMBRA.card}
      className={`rounded-3xl bg-white ${fijo ? "w-64" : "w-[17rem]"}`}
      contentContainerClassName="flex-grow p-6"
      showsVerticalScrollIndicator={false}
    >
      <Pressable accessibilityRole="link" onPress={() => ir("/home")}>
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

      <Texto className="mt-16 text-[17px] font-bold text-[#3F443D]">OTROS PROVEEDORES</Texto>
      <View className="mt-5 gap-4">
        {proveedores.map((p) => (
          <Pressable key={p.nombre} accessibilityRole="link" onPress={() => ir({ pathname: "/dashboard/clientes/[id]", params: { id: p.id } })} className="flex-row items-center gap-3 px-1 active:opacity-60">
            <Image source={IMAGENES[p.img as keyof typeof IMAGENES]} accessibilityLabel={p.nombre} contentFit="cover" style={{ width: 36, height: 36, borderRadius: 18 }} />
            <View className="min-w-0 flex-1">
              <Texto numberOfLines={1} className="text-sm font-semibold text-[#3F443D]">{p.nombre}</Texto>
              <Texto numberOfLines={1} className="text-xs text-neutral-500">{p.lugar}</Texto>
            </View>
          </Pressable>
        ))}
      </View>

      <View className="mt-auto pt-10">
        <Texto className="text-[17px] font-bold text-[#3F443D]">CONFIGURACIÓN</Texto>
        <View className="mt-5 gap-3">
          <Pressable accessibilityRole="link" onPress={() => ir("/dashboard/configuracion")} className="flex-row items-center gap-3 px-1 py-2.5 active:opacity-60">
            <Icono d={iconos.config} size={20} color={ruta.startsWith("/dashboard/configuracion") ? "#5d7f4d" : "#3F443D"} />
            <Texto className={`text-base font-medium ${ruta.startsWith("/dashboard/configuracion") ? "text-primary-400" : "text-[#3F443D]"}`}>Configuración</Texto>
          </Pressable>
          <Pressable accessibilityRole="link" onPress={() => ir("/landing")} className="flex-row items-center gap-3 px-1 py-2.5 active:opacity-60">
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
