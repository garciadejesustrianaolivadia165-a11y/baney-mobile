import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";

const COMPLETADOS = [
  { n: "Arena Azul – 12m³", f: "15 Oct 2023 • 09:45 AM", de: "La Romana, Rep. Dom.", a: "Santo Domingo Este, Rep. Dom.", p: "RD$ 5,200.00" },
  { n: 'Blocks 6" – 2,000 unid.', f: "12 Oct 2023 • 14:20 PM", de: "Santiago De Los Caballeros", a: "Punta Cana, Rep. Dom.", p: "RD$ 12,800.00" },
];
const CANCELADOS = [
  { n: "Grava – 8m³", f: "3 Oct 2023 • 10:10 AM", de: "Haina, Rep. Dom.", a: "Baní, Rep. Dom.", p: "RD$ 3,100.00" },
];

// ============ VISTA 10: HISTORIAL ============
export default function Historial() {
  const [tab, setTab] = useState<"Completados" | "Cancelados">("Completados");
  const viajes = tab === "Completados" ? COMPLETADOS : CANCELADOS;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FBFBFA]">
      <Texto className="px-5 pt-8 text-[28px] font-bold text-[#16202E]">Historial de Viajes</Texto>

      <View className="mt-6 flex-row border-b border-[#EDEFEB] bg-white">
        {(["Completados", "Cancelados"] as const).map((t) => (
          <Pressable
            key={t}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === t }}
            onPress={() => setTab(t)}
            className={`flex-1 items-center border-b-[3px] pb-3.5 ${tab === t ? "border-[#4A5720]" : "border-transparent"}`}
          >
            <Texto className={`text-[16px] ${tab === t ? "font-bold text-[#4A5720]" : "text-[#8A93A2]"}`}>{t}</Texto>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerClassName="px-5 pb-6" showsVerticalScrollIndicator={false}>
        <Texto className="pt-6 text-[12px] font-bold uppercase tracking-[0.08em] text-[#9AA3AF]">Octubre 2023</Texto>

        <View className="gap-5 pt-4">
          {viajes.map((v) => (
            <View key={v.n} style={SOMBRA.suave} className="rounded-2xl border border-[#EDEFEB] bg-white px-5 py-5">
              <View className="flex-row items-start gap-3.5">
                <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#FDE7E7]">
                  <Icono d={ICONOS.camion} size={22} color="#4A5720" strokeWidth={1.7} />
                </View>
                <View className="min-w-0 flex-1">
                  <Texto className="text-[17px] font-bold leading-tight text-[#16202E]">{v.n}</Texto>
                  <Texto className="mt-1 text-[13px] text-[#8A93A2]">{v.f}</Texto>
                </View>
                <View className={`rounded-full px-3 py-1 ${tab === "Completados" ? "bg-success-100" : "bg-error-100"}`}>
                  <Texto className={`text-[12px] font-semibold ${tab === "Completados" ? "text-success-700" : "text-error-600"}`}>
                    {tab === "Completados" ? "Entregado" : "Cancelado"}
                  </Texto>
                </View>
              </View>

              <View className="mt-5 pl-1">
                <View className="absolute left-[6px] top-3 h-6 w-[2px] bg-[#D8DCD5]" />
                <View className="flex-row items-center gap-3">
                  <View className="h-[9px] w-[9px] rounded-full bg-[#C9CFC6]" />
                  <Texto className="text-[14px] text-[#8A93A2]">De:</Texto>
                  <Texto className="flex-1 text-[14px] text-[#4A5568]">{v.de}</Texto>
                </View>
                <View className="mt-4 flex-row items-center gap-3">
                  <View className="h-[9px] w-[9px] rounded-full bg-[#4A5720]" />
                  <Texto className="text-[14px] text-[#8A93A2]">A:</Texto>
                  <Texto className="flex-1 text-[14px] text-[#4A5568]">{v.a}</Texto>
                </View>
              </View>

              <View className="mt-5 flex-row items-center justify-between border-t border-[#EDEFEB] pt-4">
                <Texto className="text-[19px] font-bold text-[#16202E]">{v.p}</Texto>
                <BotonPill color="#8B9A3A" variante="borde" textoColor="#4A5720" className="px-6 py-2.5" textClassName="text-[14px] font-semibold" sinSombra>
                  Detalles
                </BotonPill>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
