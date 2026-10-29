import { useState } from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";

import BotonPill from "@/components/movil/boton-pill";
import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";

const IMG = "/images/image_home";

const clientes = [
  { nombre: "Cesar Valdez", lugar: "San Cristóbal", img: `${IMG}/image_home_09.png` },
  { nombre: "Mini-Market Manolo", lugar: "Santo Domingo", img: `${IMG}/image_home_12.png` },
  { nombre: "Colmado La Fuerza", lugar: "San Pedro De Macorís", img: `${IMG}/image_home_13.png` },
  { nombre: "Garden's Restaurant", lugar: "Santo Domingo", img: `${IMG}/image_home_07.png` },
  { nombre: "D' Luisa's Comedor", lugar: "Azua", img: `${IMG}/image_home_11.png` },
];

// Barras apiladas del mini-gráfico: 4 tonos de oliva de abajo (oscuro) hacia arriba (pálido).
const barras = [
  [12, 6, 5, 4],
  [20, 9, 7, 6],
  [25, 11, 10, 7],
  [32, 13, 12, 9],
  [26, 12, 9, 7],
  [22, 10, 8, 6],
  [16, 8, 6, 5],
];
const dias = ["D", "L", "M", "M", "J", "V", "S"];
const tonos = ["#5c641d", "#9eaa31", "#ced878", "#eff3d3"];

const acciones = [
  { label: "Notificaciones", d: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" },
  { label: "Mensajes", d: "M4 4h16v12H7l-3 3V4zM8 9h8" },
  { label: "Pedidos", d: "M6 2l1.5 4h9L18 2M3 6h18l-2 14H5L3 6zM9 10v4M15 10v4" },
];

// Panel derecho "Tu Perfil" (en la web solo desde xl). Se usa en el dashboard
// cuando el ancho lo permite y como contenido de la pantalla de perfil.
export default function ProfilePanel() {
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <View style={SOMBRA.card} className="w-72 rounded-3xl bg-white p-6">
      <View className="flex-row items-center justify-between" style={{ zIndex: 20 }}>
        <Texto className="font-sans text-lg font-semibold text-neutral-900">Tu Perfil</Texto>
        <Pressable accessibilityRole="button" accessibilityLabel="Opciones del perfil" onPress={() => setMenuAbierto((o) => !o)} className="rounded-full px-2">
          <Texto className="text-lg text-neutral-500">⋮</Texto>
        </Pressable>
        {menuAbierto && (
          <View style={SOMBRA.alta} className="absolute right-0 top-9 w-44 overflow-hidden rounded-2xl bg-white py-2">
            {[
              { t: "Mi perfil", onPress: () => router.push("/dashboard/perfil") },
              { t: "Mis permisos" },
              { t: "Pagos" },
            ].map((o) => (
              <Pressable
                key={o.t}
                accessibilityRole="button"
                onPress={() => {
                  setMenuAbierto(false);
                  o.onPress?.();
                }}
                className="px-5 py-2.5 active:bg-primary-400/10"
              >
                <Texto className="text-sm font-medium text-[#3F443D]">{o.t}</Texto>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View className="mt-6 items-center">
        {/* Avatar con la línea de completado del perfil: arco verde con puntas redondeadas */}
        <Pressable accessibilityRole="link" accessibilityLabel="Ir a Mi Perfil" onPress={() => router.push("/dashboard/perfil")} className="h-36 w-36 items-center justify-center">
          <Svg viewBox="0 0 144 144" width={144} height={144} style={{ position: "absolute" }}>
            <Circle cx="72" cy="72" r="64" fill="none" stroke="#ededed" strokeWidth="9" />
            <Circle cx="72" cy="72" r="64" fill="none" stroke="#9eaa31" strokeWidth="11" strokeLinecap="round" strokeDasharray="290 402" transform="rotate(130 72 72)" />
          </Svg>
          <Image source={IMAGENES["/images/image_home/Ellipse 5.png"]} accessibilityLabel="José Pedro Guzman" contentFit="cover" style={{ width: 104, height: 104, borderRadius: 52 }} />
        </Pressable>

        <Texto className="mt-5 font-sans text-xl font-semibold text-neutral-900">José Pedro Guzman</Texto>
        <Texto className="font-sans text-sm text-neutral-500">Proveedor</Texto>

        <View className="mt-5 flex-row gap-4">
          {acciones.map((a) => (
            <Pressable key={a.label} accessibilityRole="button" accessibilityLabel={a.label} className="h-12 w-12 items-center justify-center rounded-full border border-primary-300 active:bg-primary-400">
              {({ pressed }) => <Icono d={a.d} size={20} color={pressed ? "#fff" : "#343730"} strokeWidth={1.6} />}
            </Pressable>
          ))}
        </View>

        {/* Actividad: días activos del usuario */}
        <View className="mt-8 w-full">
          <Texto className="text-center text-sm font-semibold text-[#415936]">Actividad</Texto>
          <View className="mt-3 flex-row items-end justify-center gap-2">
            {barras.map((b, i) => (
              <View key={i} className="w-6 flex-col-reverse overflow-hidden rounded-sm">
                {b.map((h, j) => (
                  <View key={j} style={{ height: h, backgroundColor: tonos[j] }} />
                ))}
              </View>
            ))}
          </View>
          <View className="mt-2 flex-row justify-center gap-2">
            {dias.map((dia, i) => (
              <Texto key={i} className="w-6 text-center text-xs font-medium text-[#415936]">{dia}</Texto>
            ))}
          </View>
        </View>
      </View>

      <View className="mt-9 flex-row items-center justify-between">
        <Texto className="font-sans text-lg font-semibold text-neutral-900">Tus Clientes</Texto>
        <Pressable accessibilityRole="button" accessibilityLabel="Agregar cliente" className="h-8 w-8 items-center justify-center rounded-full border border-neutral-300 active:bg-primary-400">
          <Texto className="text-lg text-neutral-600">+</Texto>
        </Pressable>
      </View>

      <View className="mt-4 gap-4">
        {clientes.map((c, i) => (
          <View key={c.nombre} className={`flex-row items-center gap-3 pb-3 ${i < clientes.length - 1 ? "border-b border-neutral-100" : ""}`}>
            <Image source={imagen(c.img)} accessibilityLabel={c.nombre} contentFit="cover" style={{ width: 36, height: 36, borderRadius: 18 }} />
            <View className="min-w-0 flex-1">
              <Texto numberOfLines={1} className="text-sm font-semibold text-neutral-900">{c.nombre}</Texto>
              <Texto numberOfLines={1} className="text-xs text-neutral-500">{c.lugar}</Texto>
            </View>
            <Pressable accessibilityRole="button" className="rounded-full bg-secondary2-300 px-3.5 py-1 active:bg-secondary2-400">
              <Texto className="text-xs font-semibold text-white">Ver</Texto>
            </Pressable>
          </View>
        ))}
      </View>

      <BotonPill color="#afc79f" textoColor="#1e2a19" className="mt-4 w-full py-2.5" textClassName="text-sm font-medium" sinSombra>
        Ver Todos
      </BotonPill>
    </View>
  );
}
