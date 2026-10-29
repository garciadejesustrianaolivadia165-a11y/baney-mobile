import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

import Mapa from "@/components/mapa";
import PanelMapa from "@/components/movil/panel-mapa";
import TarjetaCercano from "@/components/movil/tarjeta-cercano";
import Texto from "@/components/ui/texto";
import { IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";

// ============ VISTA 6: MAPA CLIENTE ============
export default function MapaCliente() {
  const router = useRouter();
  const abrirSolicitud = () => router.push("/solicitud");

  return (
    <View className="flex-1 bg-white">
      <View className="h-[440px] bg-neutral-100">
        <Mapa />
        <PanelMapa placeholder="¿A dónde enviamos hoy?" oportunidad="3 camiones en La Romana" onVer={abrirSolicitud} />
      </View>

      {/* Panel de camiones cercanos */}
      <ScrollView
        style={SOMBRA.panel}
        className="z-10 -mt-8 flex-1 rounded-t-[38px] bg-white"
        contentContainerClassName="px-5 pb-4 pt-7"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <Texto className="text-[19px] font-bold text-[#16202E]">Camiones cercanos</Texto>
          <Pressable accessibilityRole="button" className="active:scale-105">
            <Texto className="text-[14px] font-semibold text-[#4A5720]">Ver todos</Texto>
          </Pressable>
        </View>

        <TarjetaCercano
          img={IMAGENES["/images/image_mobile/truck image.png"]}
          titulo="Camión Volteo (12m³)"
          detalle="Santo Domingo Este • 2km"
          conPin
          precio="RD$ 4,500"
          chip="Disponible"
          onPress={abrirSolicitud}
        />
        <TarjetaCercano titulo="Plataforma (20 Tons)" detalle="Camino a Santiago" chip={"En 45\nmin"} tono="espera" />
      </ScrollView>
    </View>
  );
}
