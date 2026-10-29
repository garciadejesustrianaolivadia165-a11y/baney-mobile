import { Pressable, View } from "react-native";

import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { C } from "@/lib/estilos";

// Cabecera con botón circular "Volver" y título centrado (solicitud, flota)
export default function CabeceraVolver({ titulo, onVolver }: { titulo: string; onVolver: () => void }) {
  return (
    <View className="flex-row items-center gap-4 border-b border-[#EDEFEB] px-5 py-5">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Volver"
        onPress={onVolver}
        className="h-10 w-10 items-center justify-center rounded-full border border-[#E3E6E0] active:bg-[#4A5720]"
      >
        {({ pressed }) => <Icono d={ICONOS.volver} size={16} color={pressed ? "#fff" : C.tinta} strokeWidth={2} />}
      </Pressable>
      <Texto className="flex-1 pr-10 text-center text-[17px] font-bold text-[#16202E]">{titulo}</Texto>
    </View>
  );
}
