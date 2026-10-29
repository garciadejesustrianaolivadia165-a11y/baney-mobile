import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import Mapa from "@/components/mapa";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { C, SOMBRA } from "@/lib/estilos";
import { IMAGENES } from "@/lib/imagenes";

// ============ VISTA 9: TRACKING ============
export default function Tracking() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="h-[340px]">
        <Mapa />
        <View style={SOMBRA.alta} className="absolute inset-x-5 top-12 z-10 flex-row items-center gap-3 rounded-2xl bg-white px-4 py-3.5">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={() => router.replace("/confirmada")}
            className="h-9 w-9 items-center justify-center rounded-full border border-[#E3E6E0] active:bg-[#4A5720]"
          >
            {({ pressed }) => <Icono d={ICONOS.volver} size={16} color={pressed ? "#fff" : C.tinta} strokeWidth={2} />}
          </Pressable>
          <View className="min-w-0 flex-1">
            <Texto className="text-[16px] font-bold leading-tight text-[#16202E]">En camino</Texto>
            <Texto className="text-[11px] font-bold uppercase tracking-wide text-[#9AA3AF]">Llegada est. 12:45 PM</Texto>
          </View>
          <View className="flex-row items-center gap-1.5 rounded-full bg-success-50 px-3 py-1.5">
            <View className="h-2 w-2 rounded-full bg-success-500" />
            <Texto className="text-[12px] font-bold text-success-700">En vivo</Texto>
          </View>
        </View>
      </View>

      <ScrollView
        style={SOMBRA.panel}
        className="z-10 -mt-7 flex-1 rounded-t-[28px] bg-white"
        contentContainerClassName="px-5 pb-5 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto mb-5 h-[5px] w-12 rounded-full bg-[#E3E6E0]" />

        <View className="flex-row items-center gap-4">
          <View>
            <Image source={IMAGENES["/images/image_home/image_home_09.png"]} accessibilityLabel="José Rodríguez" contentFit="cover" style={{ width: 64, height: 64, borderRadius: 32 }} />
            <View className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex-row items-center gap-0.5 rounded-md bg-warning-400 px-1.5 py-0.5">
              <Icono d={ICONOS.estrella} size={10} color={C.tinta} relleno />
              <Texto className="text-[10px] font-bold text-[#16202E]">4.9</Texto>
            </View>
          </View>
          <View className="min-w-0 flex-1">
            <Texto className="text-[20px] font-bold leading-tight text-[#16202E]">José Rodríguez</Texto>
            <Texto className="mt-1 text-[14px] leading-snug text-[#6B7688]">Mack Granite (Rojo) • ABC-1234</Texto>
          </View>
          {[
            { l: "Llamar", d: ICONOS.llamar },
            { l: "Mensaje", d: ICONOS.mensaje },
          ].map((b) => (
            <Pressable key={b.l} accessibilityRole="button" accessibilityLabel={b.l} className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FDE7E7] active:scale-110">
              <Icono d={b.d} size={20} color={C.rojo} />
            </Pressable>
          ))}
        </View>

        <View className="mt-7">
          <View className="flex-row gap-4">
            <View className="w-6 items-center">
              <View className="h-6 w-6 items-center justify-center rounded-full border-2 border-success-500 bg-white">
                <Icono d={ICONOS.check} size={12} color="#059669" strokeWidth={3} />
              </View>
              <View className="w-[2px] flex-1 bg-success-500" />
            </View>
            <View className="pb-6">
              <Texto className="text-[16px] font-bold text-[#16202E]">Carga completada</Texto>
              <Texto className="mt-1 text-[14px] text-[#6B7688]">11:30 AM • Cantera San Pedro</Texto>
            </View>
          </View>
          <View className="flex-row gap-4">
            <View className="w-6 items-center">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-[#E9564F]">
                <Icono d={ICONOS.camion} size={14} color="#fff" strokeWidth={1.9} />
              </View>
              <View className="mt-1 w-[2px] flex-1 border-l-2 border-dashed border-[#D8DCD5]" />
            </View>
            <View className="pb-6">
              <Texto className="text-[16px] font-bold text-[#16202E]">En tránsito a destino</Texto>
              <Texto className="mt-1 text-[14px] text-[#6B7688]">En carretera hacia Santo Domingo</Texto>
            </View>
          </View>
          <View className="flex-row gap-4">
            <View className="w-6 items-center">
              <View className="mt-2 h-2.5 w-2.5 rounded-full bg-[#C9CFC6]" />
            </View>
            <View>
              <Texto className="text-[16px] font-bold text-[#9AA3AF]">Llegada a destino</Texto>
              <Texto className="mt-1 text-[14px] text-[#B4BCC5]">Estimado en 25 minutos</Texto>
            </View>
          </View>
        </View>

        <BotonPill color="#8B9A3A" variante="borde" className="mt-7 w-full py-4" sinSombra>
          {(pressed) => (
            <View className="flex-row items-center gap-2.5">
              <Icono d={ICONOS.compartir} circulos={[[18, 5, 3], [6, 12, 3], [18, 19, 3]]} size={18} color={pressed ? "#fff" : C.tinta} />
              <Texto className="text-[16px] font-bold" style={{ color: pressed ? "#fff" : C.tinta }}>Compartir ubicación</Texto>
            </View>
          )}
        </BotonPill>
      </ScrollView>
    </View>
  );
}
