import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

import Mapa from "@/components/mapa";
import PanelMapa from "@/components/movil/panel-mapa";
import TarjetaCercano from "@/components/movil/tarjeta-cercano";
import Texto from "@/components/ui/texto";
import { IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";

// ============ MAPA TRANSPORTISTA (clientes disponibles) ============
// Misma estructura y línea gráfica que el mapa del cliente
export default function MapaTransportista() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="h-[440px] bg-neutral-100">
        <Mapa />
        <PanelMapa placeholder="¿Dónde buscas carga hoy?" oportunidad="3 clientes en La Romana" onVer={() => router.push("/flota")} />
      </View>

      <ScrollView
        style={SOMBRA.panel}
        className="z-10 -mt-8 flex-1 rounded-t-[38px] bg-white"
        contentContainerClassName="px-5 pb-4 pt-7"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <Texto className="text-[19px] font-bold text-[#16202E]">Clientes cercanos</Texto>
          <Pressable accessibilityRole="button" className="active:scale-105">
            <Texto className="text-[14px] font-semibold text-[#4A5720]">Ver todos</Texto>
          </Pressable>
        </View>

        <TarjetaCercano
          img={IMAGENES["/images/image_home/image_home_10.png"]}
          titulo="Ing. Ricardo P."
          detalle="10m³ de Grava hacia Verón"
          conPin
          precio="RD$ 3,800"
          chip="Disponible"
        />
        <TarjetaCercano
          img={IMAGENES["/images/image_home/image_home_11.png"]}
          titulo="Constructora García"
          detalle="Blocks hacia Punta Cana"
          conPin
          precio="RD$ 12,800"
          chip="En 45 min"
          tono="espera"
        />
      </ScrollView>
    </View>
  );
}
