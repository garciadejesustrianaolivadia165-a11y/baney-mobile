import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BotonPill from "@/components/movil/boton-pill";
import CabeceraVolver from "@/components/movil/cabecera-volver";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { eliminarDireccion, hacerPredeterminada, useDirecciones, type Direccion } from "@/lib/direcciones";
import { SOMBRA } from "@/lib/estilos";

const ICONO_ETIQUETA: Record<Direccion["etiqueta"], string> = {
  Casa: ICONOS.inicio,
  Trabajo: ICONOS.empresa,
  Finca: "M3 21h18M5 21V10l7-6 7 6v11M9 21v-6h6v6",
  Almacén: "M3 21V8l9-5 9 5v13M3 21h18M7 21v-7h10v7M7 14h10",
  Otra: ICONOS.pin,
};

/** Tarjeta de una dirección guardada (lista y selector en la solicitud) */
export function TarjetaDireccion({ d, onPress, compacta }: { d: Direccion; onPress?: () => void; compacta?: boolean }) {
  return (
    <Pressable accessibilityRole={onPress ? "button" : undefined} onPress={onPress} disabled={!onPress} className={onPress ? "active:opacity-70" : ""}>
      <View className="flex-row items-start gap-3.5">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#F7F3E9]">
          <Icono d={ICONO_ETIQUETA[d.etiqueta]} size={22} color="#6B6237" strokeWidth={1.7} />
        </View>
        <View className="min-w-0 flex-1">
          <View className="flex-row items-center gap-2">
            <Texto className="text-[16px] font-bold leading-tight text-[#3F443D]">{d.etiqueta}</Texto>
            {d.predeterminada && (
              <View className="rounded-full bg-success-100 px-2.5 py-0.5">
                <Texto className="text-[11px] font-semibold text-success-700">Predeterminada</Texto>
              </View>
            )}
          </View>
          <Texto className="mt-1 text-[14px] leading-snug text-[#16202E]">{d.direccion}</Texto>
          {!compacta && (
            <>
              {d.referencia !== "" && <Texto className="mt-1 text-[12px] text-neutral-500">{d.referencia}</Texto>}
              <Texto className="mt-1 text-[12px] text-neutral-500">{[d.contacto, d.telefono].filter(Boolean).join(" · ")}</Texto>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}

// UC-USER-08 · Gestionar direcciones: lista con predeterminada, editar y eliminar.
export default function MisDirecciones() {
  const router = useRouter();
  const direcciones = useDirecciones();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo="Mis direcciones" onVolver={() => router.back()} />
      <ScrollView contentContainerClassName="gap-4 px-5 py-6" showsVerticalScrollIndicator={false}>
        {direcciones.length === 0 && (
          <View className="items-center gap-2 py-10">
            <Icono d={ICONOS.pin} size={40} color="#B9C0CB" strokeWidth={1.4} />
            <Texto className="text-[15px] font-semibold text-neutral-500">Todavía no tienes direcciones</Texto>
            <Texto className="text-center text-[13px] text-neutral-400">Guarda tu casa, finca o almacén para elegirlos en un toque al pedir transporte.</Texto>
          </View>
        )}

        {direcciones.map((d) => (
          <View key={d.id} style={SOMBRA.card} className="rounded-[1.5rem] bg-white p-4">
            <TarjetaDireccion d={d} />
            <View className="mt-3 flex-row flex-wrap items-center gap-2">
              <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: "/cuenta/direccion", params: { id: d.id } })} className="flex-row items-center gap-1.5 rounded-full border-2 border-primary-500 px-4 py-2 active:bg-primary-600">
                {({ pressed }) => (
                  <>
                    <Icono d={ICONOS.lapiz} size={14} color={pressed ? "#fff" : "#364a2d"} />
                    <Texto className="text-[13px] font-semibold" style={{ color: pressed ? "#fff" : "#364a2d" }}>Editar</Texto>
                  </>
                )}
              </Pressable>
              {!d.predeterminada && (
                <Pressable accessibilityRole="button" onPress={() => hacerPredeterminada(d.id)} className="rounded-full border border-neutral-300 px-4 py-2 active:bg-neutral-700">
                  {({ pressed }) => <Texto className="text-[13px] font-semibold" style={{ color: pressed ? "#fff" : "#3F443D" }}>Usar como predeterminada</Texto>}
                </Pressable>
              )}
              <Pressable accessibilityRole="button" accessibilityLabel={`Eliminar ${d.etiqueta}`} onPress={() => eliminarDireccion(d.id)} hitSlop={8} className="ml-auto h-9 w-9 items-center justify-center rounded-full border border-error-200 active:bg-error-500">
                {({ pressed }) => <Icono d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" size={16} color={pressed ? "#fff" : "#ef4444"} />}
              </Pressable>
            </View>
          </View>
        ))}

        <BotonPill color="#486440" variante="borde" textoColor="#364a2d" onPress={() => router.push("/cuenta/direccion")} className="w-full py-3.5" sinSombra>
          {(pressed) => (
            <View className="flex-row items-center gap-2">
              <Icono d={ICONOS.mas} size={16} color={pressed ? "#fff" : "#364a2d"} strokeWidth={2.2} />
              <Texto className="font-sans text-[15px] font-semibold" style={{ color: pressed ? "#fff" : "#364a2d" }}>Agregar dirección</Texto>
            </View>
          )}
        </BotonPill>
      </ScrollView>
    </SafeAreaView>
  );
}
