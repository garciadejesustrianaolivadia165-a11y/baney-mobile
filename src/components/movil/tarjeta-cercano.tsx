import { View } from "react-native";
import Presionable from "@/components/ui/presionable";
import { Image } from "expo-image";

import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import type { FuenteImagen } from "@/lib/imagenes";

// Tarjeta de camión/cliente cercano del panel bajo el mapa
export default function TarjetaCercano({
  img,
  titulo,
  detalle,
  conPin,
  precio,
  chip,
  tono = "ok",
  onPress,
}: {
  img?: FuenteImagen;
  titulo: string;
  detalle: string;
  conPin?: boolean;
  precio?: string;
  chip: string;
  tono?: "ok" | "espera";
  onPress?: () => void;
}) {
  return (
    <Presionable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      disabled={!onPress}
      estilo={(pressed) => [SOMBRA.suave, pressed && { transform: [{ translateY: -3 }] }]}
      className="mt-4 flex-row items-start gap-3.5 rounded-2xl border border-[#EDEFEB] bg-white p-4"
    >
      {img ? (
        <Image source={img} contentFit="cover" style={{ width: 56, height: 56, borderRadius: 28 }} />
      ) : (
        <View className="h-14 w-14 rounded-full bg-[#C4C4C4]" />
      )}
      <View className="min-w-0 flex-1">
        <Texto className="text-[15px] font-bold leading-tight text-[#16202E]">{titulo}</Texto>
        <View className="mt-1.5 flex-row items-center gap-1">
          {conPin && <Icono d={ICONOS.pin} size={14} color="#6B7688" relleno />}
          <Texto className={`${conPin ? "text-[12px]" : "text-[13px]"} text-[#6B7688]`}>{detalle}</Texto>
        </View>
        {precio && (
          <View className="mt-2 flex-row items-center gap-2">
            <Texto className="text-[15px] font-bold text-[#4A5720]">{precio}</Texto>
            <View className="rounded-md bg-[#F1F3F0] px-2 py-0.5">
              <Texto className="text-[11px] text-[#6B7688]">Precio est.</Texto>
            </View>
          </View>
        )}
      </View>
      <View className={`rounded-md px-2.5 py-1 ${tono === "ok" ? "bg-success-100" : "bg-warning-100"}`}>
        <Texto className={`text-center text-[11px] font-semibold leading-tight ${tono === "ok" ? "text-success-700" : "text-warning-800"}`}>
          {chip}
        </Texto>
      </View>
    </Presionable>
  );
}
