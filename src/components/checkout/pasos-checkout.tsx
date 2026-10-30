import { View } from "react-native";

import Texto from "@/components/ui/texto";

const PASOS = ["Carrito", "Entrega y pago", "Confirmación"];

/** Indicador 1 · 2 · 3 del checkout (mismo dibujo que los pasos de Solicitar transporte) */
export default function PasosCheckout({ actual }: { actual: 1 | 2 | 3 }) {
  return (
    <View className="flex-row items-center gap-2">
      {PASOS.map((p, i) => {
        const n = i + 1;
        const activo = n === actual;
        const hecho = n < actual;
        return (
          <View key={p} className={`flex-row items-center gap-2 ${i < PASOS.length - 1 ? "flex-1" : ""}`}>
            <View className={`h-7 w-7 items-center justify-center rounded-full ${activo || hecho ? "bg-[#4A5720]" : "bg-[#E3E6E0]"}`}>
              <Texto className={`text-[12px] font-bold ${activo || hecho ? "text-white" : "text-[#8A93A2]"}`}>{n}</Texto>
            </View>
            <Texto className={`text-[13px] ${activo ? "font-bold text-[#16202E]" : "text-[#8A93A2]"}`}>{p}</Texto>
            {i < PASOS.length - 1 && <View className={`h-px flex-1 ${hecho ? "bg-[#4A5720]" : "bg-[#E3E6E0]"}`} />}
          </View>
        );
      })}
    </View>
  );
}
