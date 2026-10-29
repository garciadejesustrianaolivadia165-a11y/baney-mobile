import { View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { C, SOMBRA } from "@/lib/estilos";

const DATOS: [string, string, string][] = [
  ["ID de Pedido", "#TR-882190", "#16202E"],
  ["Transporte", "Volteo 12m³", "#16202E"],
  ["Precio Final", "RD$ 4,500.00", "#4A5720"],
];

// ============ VISTA 8: SOLICITUD CONFIRMADA ============
export default function Confirmada() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6 py-8">
        {/* Check con anillos concéntricos */}
        <View className="h-[104px] w-[104px] items-center justify-center rounded-full bg-[#EAF8EE]">
          <View className="h-[82px] w-[82px] items-center justify-center rounded-full bg-[#D7F2DF]">
            <View className="h-[62px] w-[62px] items-center justify-center rounded-full bg-[#16A34A]">
              <Icono d={ICONOS.check} size={28} color="#fff" strokeWidth={2.6} />
            </View>
          </View>
        </View>

        <Texto className="mt-7 text-[25px] font-bold text-[#16202E]">¡Solicitud Confirmada!</Texto>
        <Texto className="mt-3.5 max-w-[19rem] text-center text-[14px] leading-relaxed text-[#6B7688]">
          Hemos enviado tu solicitud a los transportistas disponibles. Te avisaremos en cuanto uno acepte el viaje.
        </Texto>

        <View style={SOMBRA.suave} className="mt-8 w-full rounded-2xl border border-[#EDEFEB] bg-white px-5 py-1">
          {DATOS.map(([k, v, c], i) => (
            <View key={k} className={`flex-row items-center justify-between py-4 ${i < DATOS.length - 1 ? "border-b border-[#EDEFEB]" : ""}`}>
              <Texto className="text-[14px] text-[#8A93A2]">{k}</Texto>
              <Texto className="text-[15px] font-bold" style={{ color: c }}>{v}</Texto>
            </View>
          ))}
        </View>

        <BotonPill color={C.oliva} onPress={() => router.replace("/tracking")} className="mt-8 w-full py-4" textClassName="text-[15px]">
          Seguir mi pedido
        </BotonPill>
        <BotonPill color="#EDEFEB" variante="borde" textoColor={C.tinta} onPress={() => router.replace("/mapa")} className="mt-4 w-full py-4" textClassName="text-[15px]">
          {(pressed) => (
            <Texto className="text-[15px] font-bold" style={{ color: pressed ? "#fff" : C.tinta }}>Volver al Inicio</Texto>
          )}
        </BotonPill>
      </View>
    </SafeAreaView>
  );
}
