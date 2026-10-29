import { View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import Mapa from "@/components/mapa";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { IMAGENES } from "@/lib/imagenes";
import { DatosCliente } from "../bandeja/pedidos/[id]";
import { AccionesOrden } from "./index";

export default function RouteDetail() {
  const { pedidoId } = useLocalSearchParams<{ pedidoId: string }>();
  const router = useRouter();

  return (
    <Pagina>
      <TituloSeccion titulo={`Pedido #${pedidoId}`} enlace="Volver Atras" href="/dashboard/rutas" />

      <View style={SOMBRA.card} className="rounded-3xl bg-white p-2">
        <View className="min-h-[560px] overflow-hidden rounded-[1.25rem] bg-neutral-200">
          <Mapa />

          {/* Chip de destino */}
          <View pointerEvents="none" style={SOMBRA.boton} className="absolute right-4 top-4 flex-row items-center gap-3 rounded-full bg-white py-2 pl-2 pr-6">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-600">
              <Icono d={ICONOS.pin} size={16} color="#fff" relleno />
            </View>
            <View>
              <Texto className="text-[10px] uppercase tracking-wide text-neutral-400">Destino</Texto>
              <Texto className="text-sm font-bold tracking-wide text-neutral-900">MELLOS'S COLMADO</Texto>
            </View>
          </View>

          {/* Panel de la ruta, como la referencia */}
          <View style={SOMBRA.alta} className="absolute bottom-4 left-4 right-4 rounded-[1.75rem] bg-white p-6">
            <View className="mb-4 h-1.5 w-14 self-center rounded-full bg-neutral-300" />
            <Texto className="font-sans text-[22px] font-bold text-primary-600">25 min  (15 km)</Texto>
            <Texto className="mt-1.5 font-sans text-sm leading-relaxed text-neutral-500">Ruta más rápida ahora debido a las condiciones del tráfico.</Texto>

            {/* Recorrido: flecha (liner) sobre la pista */}
            <View className="mt-6 justify-center">
              <View className="h-3 w-full rounded-full bg-[#dfe3d3]" />
              <View className="absolute left-0 h-3 w-16 rounded-full bg-primary-600" />
              <Image source={IMAGENES["/images/image_rutas/liner.png"]} contentFit="contain" style={{ position: "absolute", left: 24, width: 56, height: 56 }} />
            </View>

            <View className="my-6 h-px bg-neutral-200" />

            <View className="gap-1">
              <View className="flex-row items-center gap-4">
                <Image source={IMAGENES["/images/image_rutas/from_icon.png"]} contentFit="contain" style={{ width: 40, height: 40 }} />
                <View className="flex-1 rounded-full border border-neutral-300 px-5 py-3">
                  <Texto className="text-center font-sans text-sm font-semibold text-primary-600">Haina, San Cristóbal</Texto>
                </View>
              </View>
              <View className="ml-[19px] h-5 justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <View key={i} className="h-1 w-1 rounded-full bg-primary-700" />
                ))}
              </View>
              <View className="flex-row items-center gap-4">
                <Image source={IMAGENES["/images/image_rutas/where_icon.png"]} contentFit="contain" style={{ width: 40, height: 40 }} />
                <View className="flex-1 rounded-full border border-neutral-300 px-3 py-3">
                  <Texto numberOfLines={1} className="text-center font-sans text-sm font-semibold text-primary-600">Av. 27 de feb, Santo Domingo</Texto>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="gap-6 px-3 py-6">
          <DatosCliente titulo="Pedido de" redondo={false} />
          <AccionesOrden onDetalles={() => router.push({ pathname: "/dashboard/bandeja/pedidos/[id]", params: { id: pedidoId ?? "" } })} />
        </View>
      </View>
    </Pagina>
  );
}
