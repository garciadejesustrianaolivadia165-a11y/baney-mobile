import { Pressable, TextInput, View } from "react-native";
import { Image } from "expo-image";

import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";

// Capa sobre el mapa: buscador + filtro y la tarjeta "Oportunidad hoy"
export default function PanelMapa({
  placeholder,
  oportunidad,
  onVer,
}: {
  placeholder: string;
  oportunidad: string;
  onVer: () => void;
}) {
  return (
    <>
      <View className="absolute inset-x-5 top-5 z-10 flex-row items-center gap-3">
        <View
          style={SOMBRA.suave}
          className="flex-1 flex-row items-center gap-3 rounded-full border border-neutral-200 bg-white px-6 py-3.5"
        >
          <Icono d="M21 21l-4.35-4.35" circulos={[[11, 11, 7]]} size={16} color="#a2a79e" strokeWidth={2} />
          <TextInput
            placeholder={placeholder}
            placeholderTextColor="#a2a79e"
            className="flex-1 font-inter text-sm tracking-wide text-neutral-800"
            style={{ paddingVertical: 0 }}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filtrar"
          style={SOMBRA.suave}
          className="h-[50px] w-[50px] items-center justify-center rounded-2xl border border-neutral-200 bg-white active:scale-110"
        >
          <Image source={IMAGENES["/images/image_rutas/btn_filter.png"]} contentFit="contain" style={{ width: 24, height: 24 }} />
        </Pressable>
      </View>

      <View
        style={SOMBRA.alta}
        className="absolute inset-x-5 top-[92px] z-10 flex-row items-center gap-3.5 rounded-[34px] bg-[#4A5720]/75 px-4 py-4"
      >
        <View className="h-11 w-11 items-center justify-center rounded-full bg-black/25">
          <Icono d={ICONOS.fuego} size={20} color="#F59E0B" relleno />
        </View>
        <View className="min-w-0 flex-1">
          <Texto className="text-[13px] leading-tight text-white/75">Oportunidad hoy</Texto>
          <Texto className="mt-0.5 text-[17px] font-bold leading-[1.25] text-white">{oportunidad}</Texto>
        </View>
        <BotonPill color="#f59e0b" onPress={onVer} className="w-[72px] rounded-2xl px-3 py-2.5" textClassName="text-[15px] leading-tight text-center" sinSombra>
          Ver ahora
        </BotonPill>
      </View>
    </>
  );
}
