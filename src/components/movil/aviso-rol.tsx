import { View } from "react-native";

import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";

// Aviso inferior de las vistas de rol y de búsqueda
export default function AvisoRol() {
  return (
    <View
      style={SOMBRA.card}
      className="z-10 mt-auto flex-row items-start gap-2.5 rounded-2xl bg-[#F1F4EF]/95 px-4 py-3.5"
    >
      <View className="mt-px h-4 w-4 items-center justify-center rounded-full bg-secondary4-500">
        <Texto className="text-[10px] font-bold leading-none text-white">i</Texto>
      </View>
      <Texto className="flex-1 text-[12px] leading-relaxed text-[#6B7688]">
        Podrás cambiar de rol o registrar flotas adicionales más tarde desde tu perfil de
        configuración.
      </Texto>
    </View>
  );
}
