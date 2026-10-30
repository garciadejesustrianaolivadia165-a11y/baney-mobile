import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import CabeceraVolver from "@/components/movil/cabecera-volver";
import Icono, { ICONOS } from "@/components/ui/icono";
import SubirArchivo from "@/components/ui/subir-archivo";
import Texto from "@/components/ui/texto";
import { ESTADOS, quitarDocumento, subirDocumento, useDocumentos, type Documento } from "@/lib/documentos";
import { SOMBRA } from "@/lib/estilos";
import { imagen } from "@/lib/imagenes";
import { useSesion } from "@/lib/sesion";

const PDF = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 15h6M9 11h2";

/** Chip de estado del documento (Sin subir / En revisión / Aprobado / Rechazado) */
export function ChipEstadoDocumento({ estado }: { estado: Documento["estado"] }) {
  const e = ESTADOS[estado];
  return (
    <View className={`rounded-full px-3 py-1 ${e.fondo}`}>
      <Texto className={`text-[11px] font-semibold ${e.color}`}>{e.texto}</Texto>
    </View>
  );
}

// UC-USER-07 · Gestionar documentos: lista por rol con estado, subida y reemplazo.
export default function MisDocumentos() {
  const router = useRouter();
  const { rol } = useSesion();
  const docs = useDocumentos(rol);
  const aprobados = docs.filter((d) => d.estado === "aprobado").length;
  const obligatorios = docs.filter((d) => d.obligatorio);
  const faltan = obligatorios.filter((d) => d.estado === "pendiente" || d.estado === "rechazado").length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo="Mis documentos" onVolver={() => router.back()} />
      <ScrollView contentContainerClassName="gap-5 px-5 py-6" showsVerticalScrollIndicator={false}>
        <View style={SOMBRA.card} className="flex-row items-center gap-4 rounded-[1.5rem] bg-white px-5 py-4">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#F7F3E9]">
            <Icono d={ICONOS.empresa} size={24} color="#6B6237" strokeWidth={1.7} />
          </View>
          <View className="min-w-0 flex-1">
            <Texto className="font-sans text-[15px] font-bold text-[#415936]">{aprobados} de {docs.length} documentos aprobados</Texto>
            <Texto className="mt-0.5 text-[12px] text-neutral-500">
              {faltan > 0 ? `Te ${faltan === 1 ? "falta" : "faltan"} ${faltan} obligatorio${faltan === 1 ? "" : "s"} para verificar tu cuenta.` : "Tu cuenta tiene todo lo obligatorio."}
            </Texto>
          </View>
        </View>

        {docs.map((d) => (
          <View key={d.id} style={SOMBRA.card} className="rounded-[1.5rem] bg-white p-4">
            <View className="flex-row items-start gap-3.5">
              {d.archivo && d.archivo.tipo.startsWith("image/") && d.archivo.uri ? (
                <Image source={imagen(d.archivo.uri)} contentFit="cover" style={{ width: 56, height: 56, borderRadius: 14 }} />
              ) : (
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
                  <Icono d={PDF} size={26} color="#486440" strokeWidth={1.6} />
                </View>
              )}
              <View className="min-w-0 flex-1">
                <View className="flex-row items-center gap-2">
                  <Texto className="flex-1 text-[16px] font-bold leading-tight text-[#3F443D]">{d.titulo}</Texto>
                  <ChipEstadoDocumento estado={d.estado} />
                </View>
                <Texto className="mt-1 text-[13px] text-neutral-500">{d.detalle}</Texto>
                <View className="mt-2 flex-row flex-wrap gap-2">
                  <View className={`rounded-full px-3 py-1 ${d.obligatorio ? "bg-[#F7F3E9]" : "bg-neutral-100"}`}>
                    <Texto className="text-[11px] text-[#6B6237]">{d.obligatorio ? "Obligatorio" : "Opcional"}</Texto>
                  </View>
                  {d.vence && (
                    <View className="rounded-full bg-neutral-100 px-3 py-1">
                      <Texto className="text-[11px] text-neutral-600">Vence {d.vence}</Texto>
                    </View>
                  )}
                  {d.archivo?.nombre && (
                    <View className="rounded-full bg-neutral-100 px-3 py-1">
                      <Texto className="text-[11px] text-neutral-600" numberOfLines={1}>{d.archivo.nombre}</Texto>
                    </View>
                  )}
                </View>
                {d.motivo && <Texto className="mt-2 text-[12px] text-error-600">{d.motivo}</Texto>}
              </View>
            </View>

            <View className="mt-3 flex-row items-center gap-3">
              <SubirArchivo etiqueta={d.archivo ? "Reemplazar" : "Subir archivo"} onArchivo={(a) => subirDocumento(rol, d.id, a)} />
              {d.archivo && d.estado !== "aprobado" && (
                <Pressable accessibilityRole="button" accessibilityLabel={`Quitar ${d.titulo}`} onPress={() => quitarDocumento(rol, d.id)} className="rounded-full border border-error-200 px-4 py-2 active:bg-error-500">
                  {({ pressed }) => <Texto className="text-sm font-semibold" style={{ color: pressed ? "#fff" : "#ef4444" }}>Quitar</Texto>}
                </Pressable>
              )}
            </View>
          </View>
        ))}

        <Texto className="px-1 text-center text-[12px] leading-relaxed text-neutral-400">
          Aceptamos imágenes y PDF de hasta 10 MB. Revisamos los documentos en un máximo de 48 horas hábiles.
        </Texto>
      </ScrollView>
    </SafeAreaView>
  );
}
