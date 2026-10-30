import { View } from "react-native";
import { useRouter } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import FormularioTarjeta from "@/components/movil/formulario-tarjeta";
import { MarcasTarjeta } from "@/components/movil/pago";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";

// 06 · Agregar tarjeta: el mismo formulario de la pasarela; la tarjeta queda guardada
// en Métodos de pago y se vuelve al paso de pago.
export default function AgregarTarjeta() {
  const router = useRouter();
  return (
    <Pagina>
      <TituloSeccion titulo="Agregar tarjeta" enlace="Volver al pago" href="/cliente/pago" />
      <View style={SOMBRA.card} className="rounded-[1.5rem] bg-white p-5">
        <View className="flex-row items-center justify-between">
          <Texto className="text-[14px] font-bold text-[#16202E]">Tarjeta Débito/Crédito</Texto>
          <MarcasTarjeta />
        </View>
        <View className="mt-5">
          <FormularioTarjeta textoBoton="Guardar tarjeta" guardar onListo={() => router.back()} />
        </View>
        <Texto className="mt-4 text-center text-[12px] text-neutral-400">Tus datos se cifran y nunca se guardan completos en BANEY.</Texto>
      </View>
    </Pagina>
  );
}
