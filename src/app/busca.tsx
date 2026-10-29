import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import AvisoRol from "@/components/movil/aviso-rol";
import CardOpcion from "@/components/movil/card-opcion";
import FondoCampo from "@/components/movil/fondo-campo";
import Texto from "@/components/ui/texto";
import { IMAGENES } from "@/lib/imagenes";
import { actualizarSesion } from "@/lib/sesion";

// ============ VISTA 5: ¿QUÉ BUSCAS? (cliente) ============
export default function Busca() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FondoCampo />
      <ScrollView contentContainerClassName="flex-grow px-6 pb-6 pt-8" showsVerticalScrollIndicator={false}>
        <Texto className="z-10 font-sans text-[30px] font-bold leading-[1.2] text-[#3D4D18]">
          ¡Excelente! ¿Cuéntanos, qué estás buscando?
        </Texto>
        <Texto className="z-10 mt-3 text-[15px] text-[#7E8A80]">¿Cómo planeas usar Baney RD?</Texto>

        <View className="z-10 -mx-3 mt-8 gap-5">
          <CardOpcion
            img={IMAGENES["/images/image_mobile/truck image.png"]}
            titulo="Logística Inteligente"
            texto="Tengo camiones o equipos y quiero ofrecer mis servicios."
            onPress={() => {
              actualizarSesion({ busca: "transportista" });
              router.push("/auth");
            }}
          />
          <CardOpcion
            img={IMAGENES["/images/image_home/image_home_01.png"]}
            titulo="Productos y Servicios"
            texto="Deseo ofrecer mis productos y abrir mi marca al mercado."
            onPress={() => {
              actualizarSesion({ busca: "productor" });
              router.push("/auth");
            }}
          />
        </View>

        <View className="mt-8 flex-1 justify-end">
          <AvisoRol />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
