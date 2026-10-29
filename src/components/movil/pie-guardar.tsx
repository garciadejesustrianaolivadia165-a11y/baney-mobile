import { View } from "react-native";

import BotonPill from "@/components/movil/boton-pill";
import Texto from "@/components/ui/texto";
import { C } from "@/lib/estilos";

/** Pie fijo con el botón principal (y aviso "Cambios guardados") de las pantallas de cuenta */
export default function PieGuardar({ texto, onPress, guardado, disabled }: { texto: string; onPress: () => void; guardado?: boolean; disabled?: boolean }) {
  return (
    <View className="border-t border-[#EDEFEB] bg-white px-5 py-5">
      {guardado && (
        <View accessibilityRole="alert" className="mb-3 self-center rounded-full bg-success-100 px-4 py-1.5">
          <Texto className="text-[12px] font-semibold text-success-700">Cambios guardados</Texto>
        </View>
      )}
      <BotonPill color={C.olivaOscuro} onPress={onPress} disabled={disabled} className="w-full py-4" textClassName="text-[17px]">
        {texto}
      </BotonPill>
    </View>
  );
}
