import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import AvisoRol from "@/components/movil/aviso-rol";
import CardOpcion from "@/components/movil/card-opcion";
import FondoCampo from "@/components/movil/fondo-campo";
import Texto from "@/components/ui/texto";
import { IMAGENES } from "@/lib/imagenes";
import { actualizarSesion, type Rol } from "@/lib/sesion";

const OPCIONES: { rol: Rol; titulo: string; texto: string; img: keyof typeof IMAGENES }[] = [
  {
    rol: "cliente",
    titulo: "Soy Cliente",
    texto: "Necesito transportar materiales, adquirir productos o encontrar suplidores.",
    img: "/images/image_home/image_home_02.png",
  },
  {
    rol: "transportista",
    titulo: "Soy Transportista",
    texto: "Tengo camiones o equipos y quiero ofrecer mis servicios.",
    img: "/images/image_mobile/truck image.png",
  },
  {
    rol: "proveedor",
    titulo: "Soy Proveedor",
    texto: "Deseo ofrecer mis productos y abrir mi marca al mercado.",
    img: "/images/image_home/image_home_01.png",
  },
];

// ============ VISTA 3: ROL ============
export default function RolScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FondoCampo />
      <ScrollView contentContainerClassName="flex-grow px-6 pb-6 pt-8" showsVerticalScrollIndicator={false}>
        <Texto className="z-10 font-sans text-[30px] font-bold leading-[1.2] text-[#3D4D18]">Cuéntanos un poco sobre ti</Texto>
        <Texto className="z-10 mt-3 text-[15px] text-[#7E8A80]">¿Cómo planeas usar Baney RD?</Texto>

        <View className="z-10 -mx-3 mt-8 gap-5">
          {OPCIONES.map((c) => (
            <CardOpcion
              key={c.titulo}
              img={IMAGENES[c.img]}
              titulo={c.titulo}
              texto={c.texto}
              onPress={() => {
                actualizarSesion({ rol: c.rol, busca: null });
                router.push(c.rol === "cliente" ? "/busca" : "/register");
              }}
            />
          ))}
        </View>

        <View className="mt-8 flex-1 justify-end">
          <AvisoRol />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
