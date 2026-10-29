import { View } from "react-native";
import Presionable from "@/components/ui/presionable";
import { Image } from "expo-image";

import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { C, SOMBRA } from "@/lib/estilos";

// Card de opción de las vistas de rol y de "¿qué buscas?" (misma forma, colores y tipografía)
export default function CardOpcion({
  img,
  titulo,
  texto,
  onPress,
}: {
  img: number;
  titulo: string;
  texto: string;
  onPress: () => void;
}) {
  return (
    <Presionable
      accessibilityRole="button"
      onPress={onPress}
      estilo={(pressed) => [SOMBRA.card, pressed && { transform: [{ translateY: -3 }] }]}
      className="w-full flex-row items-center gap-4 rounded-[18px] bg-white px-5 py-5 active:bg-neutral-50"
    >
      <Image source={img} contentFit="cover" style={{ width: 64, height: 64, borderRadius: 32 }} />
      <View className="min-w-0 flex-1">
        <Texto className="text-[17px] font-bold leading-tight text-[#16202E]">{titulo}</Texto>
        <Texto className="mt-1.5 text-[13px] leading-snug text-[#6B7688]">{texto}</Texto>
      </View>
      <Icono d={ICONOS.chevron} size={16} color={C.chevron} strokeWidth={1.6} />
    </Presionable>
  );
}
