import { Linking, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { abrirChatCon } from "@/lib/chat";
import { SOMBRA } from "@/lib/estilos";
import { imagen, IMAGENES } from "@/lib/imagenes";
import type { Transportista } from "@/lib/rutas";

const TELEFONO = "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z";

/** "Llega en X min · km restantes", estado, barra de avance con el camión y origen → destino */
export function TarjetaLlegada({ titulo, detalle, chip, avance, origen, destino }: { titulo: string; detalle?: string; chip?: { texto: string; fondo: string; color: string }; avance: number; origen: string; destino: string }) {
  return (
    <View style={SOMBRA.card} className="rounded-[1.75rem] bg-white p-5">
      <View className="flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Texto className="font-sans text-[22px] font-bold text-primary-600">{titulo}</Texto>
          {detalle && <Texto className="font-sans text-sm font-semibold text-neutral-500">{detalle}</Texto>}
        </View>
        {chip && (
          <View className={`rounded-full px-3 py-1 ${chip.fondo}`}>
            <Texto className={`text-xs font-semibold ${chip.color}`}>{chip.texto}</Texto>
          </View>
        )}
      </View>

      <View className="mt-6 justify-center">
        <View className="h-3 w-full rounded-full bg-[#dfe3d3]" />
        <View className="absolute left-0 h-3 rounded-full bg-primary-600" style={{ width: `${Math.max(avance, 6)}%` }} />
        <Image source={IMAGENES["/images/image_rutas/liner.png"]} contentFit="contain" style={{ position: "absolute", left: `${Math.min(Math.max(avance - 8, 0), 84)}%`, width: 56, height: 56 }} />
      </View>
      <Texto className="mt-2 text-right text-xs text-neutral-400">{avance}% del recorrido</Texto>

      <View className="my-5 h-px bg-neutral-200" />

      <View className="gap-1">
        <View className="flex-row items-center gap-4">
          <Image source={IMAGENES["/images/image_rutas/from_icon.png"]} contentFit="contain" style={{ width: 40, height: 40 }} />
          <View className="flex-1 rounded-full border border-neutral-300 px-5 py-3">
            <Texto numberOfLines={1} className="text-center font-sans text-sm font-semibold text-primary-600">{origen}</Texto>
          </View>
        </View>
        <View className="ml-[19px] h-5 justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <View key={i} className="h-1 w-1 rounded-full bg-primary-700" />
          ))}
        </View>
        <View className="flex-row items-center gap-4">
          <Image source={IMAGENES["/images/image_rutas/where_icon.png"]} contentFit="contain" style={{ width: 40, height: 40 }} />
          <View className="flex-1 rounded-full border border-neutral-300 px-3 py-3">
            <Texto numberOfLines={1} className="text-center font-sans text-sm font-semibold text-primary-600">{destino}</Texto>
          </View>
        </View>
      </View>
    </View>
  );
}

/** Transportista (o contraparte) con calificación y botones Llamar / Mensaje (el mensaje abre el chat) */
export function TarjetaContacto({ titulo = "Transportista", persona, subtitulo }: { titulo?: string; persona: Transportista; subtitulo?: string }) {
  const router = useRouter();
  return (
    <View style={SOMBRA.card} className="rounded-[1.75rem] bg-white p-5">
      <Texto className="font-sans text-lg font-semibold text-[#3F443D]">{titulo}</Texto>
      <View className="mt-3 flex-row items-center gap-3">
        <Image source={imagen(persona.avatar)} accessibilityLabel={persona.nombre} contentFit="cover" style={{ width: 52, height: 52, borderRadius: 26 }} />
        <View className="min-w-0 flex-1">
          <Texto className="font-sans text-[17px] font-semibold text-neutral-900">{persona.nombre}</Texto>
          <Texto className="text-sm text-neutral-500">{subtitulo ?? `${persona.vehiculo} · Placa ${persona.placa}`}</Texto>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-[#F7F3E9] px-3 py-1.5">
          <Icono d={ICONOS.estrella} size={14} color="#3F3A28" relleno />
          <Texto className="text-[13px] font-bold text-[#3F3A28]">{persona.calificacion.toFixed(1)}</Texto>
        </View>
      </View>
      <View className="mt-4 flex-row gap-3">
        <BotonPill color="#364a2d" textoColor="#fdf8f0" onPress={() => Linking.openURL(`tel:${persona.telefono}`)} className="flex-1 py-3" sinSombra>
          {(pressed) => (
            <View className="flex-row items-center gap-2">
              <Icono d={TELEFONO} size={16} color={pressed ? "#364a2d" : "#fdf8f0"} />
              <Texto className="font-sans text-sm font-semibold" style={{ color: pressed ? "#364a2d" : "#fdf8f0" }}>Llamar</Texto>
            </View>
          )}
        </BotonPill>
        <BotonPill color="#364a2d" variante="borde" textoColor="#364a2d" onPress={() => router.push({ pathname: "/chat/[id]", params: { id: abrirChatCon({ nombre: persona.nombre, avatar: persona.avatar, rol: titulo }) } })} className="flex-1 py-3" sinSombra>
          {(pressed) => (
            <View className="flex-row items-center gap-2">
              <Icono d={ICONOS.mensaje} size={16} color={pressed ? "#fff" : "#364a2d"} />
              <Texto className="font-sans text-sm font-semibold" style={{ color: pressed ? "#fff" : "#364a2d" }}>Mensaje</Texto>
            </View>
          )}
        </BotonPill>
      </View>
    </View>
  );
}
