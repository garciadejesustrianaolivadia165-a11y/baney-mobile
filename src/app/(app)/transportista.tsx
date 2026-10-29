import { Pressable, ScrollView, View } from "react-native";
import Presionable from "@/components/ui/presionable";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { C, SOMBRA } from "@/lib/estilos";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { VIAJES } from "@/lib/viajes";

// ============ VISTA 12: DASHBOARD TRANSPORTISTA ============
export default function DashboardTransportista() {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <ScrollView contentContainerClassName="p-5 pb-8" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-start justify-between">
          <View>
            <Texto className="text-[14px] text-[#8A93A2]">Hola, José</Texto>
            <Texto className="text-[26px] font-bold leading-tight text-[#16202E]">Dashboard</Texto>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="items-end">
              <Texto className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#9AA3AF]">Estado</Texto>
              <View className="flex-row items-center gap-1.5">
                <View className="h-2 w-2 rounded-full bg-success-500" />
                <Texto className="text-[13px] font-semibold text-success-600">Conectado</Texto>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ver notificaciones"
              onPress={() => router.navigate("/alertas")}
              className="h-10 w-10 items-center justify-center rounded-full active:bg-[#4A5720]"
            >
              {({ pressed }) => (
                <>
                  <Icono d={ICONOS.alertas} size={24} color={pressed ? "#fff" : C.tinta} />
                  <View className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-error-500" />
                </>
              )}
            </Pressable>
          </View>
        </View>

        {/* Misma forma e ícono que las tarjetas de Finanzas de la web, en verde */}
        <View style={{ ...SOMBRA.alta, shadowColor: "#5A6A20" }} className="mt-6 rounded-[1.5rem] bg-[#5A6A20] p-5">
          <View className="flex-row items-center gap-3">
            <Image source={IMAGENES["/icons/icon_01.png"]} contentFit="contain" style={{ width: 44, height: 44 }} />
            <Texto className="flex-1 text-[14px] text-white/85">Ingresos de hoy</Texto>
            <View className="flex-row items-center gap-1 rounded-full bg-white/20 px-2.5 py-1">
              <Texto className="text-[12px] font-medium text-white">20%</Texto>
              <Icono d={ICONOS.tendencia} size={12} color="#fff" strokeWidth={2} />
            </View>
          </View>
          <Texto className="mt-4 text-[32px] font-bold leading-none text-white">RD$ 15,200.00</Texto>
          <View className="mt-5 flex-row gap-3">
            {[
              { k: "Viajes", v: "4" },
              { k: "Calificación", v: "4.98" },
            ].map((s) => (
              <View key={s.k} className="flex-1 rounded-2xl bg-white/15 px-4 py-3">
                <Texto className="text-[10px] font-bold uppercase tracking-[0.06em] text-white/80">{s.k}</Texto>
                <Texto className="mt-0.5 text-[24px] font-bold text-white">{s.v}</Texto>
              </View>
            ))}
          </View>
        </View>

        <Texto className="mt-7 text-[12px] font-bold uppercase tracking-[0.08em] text-[#9AA3AF]">Acciones rápidas</Texto>
        <View className="mt-3 flex-row gap-4">
          <BotonPill color={C.arenaBoton} onPress={() => router.push("/flota")} className="flex-1 rounded-3xl py-7">
            {(pressed) => (
              <View className="items-center gap-2">
                <Icono d={ICONOS.subirBajar} size={28} color={pressed ? C.arenaBoton : "#3F3A28"} strokeWidth={1.9} />
                <Texto className="text-[15px] font-bold" style={{ color: pressed ? C.arenaBoton : "#3F3A28" }}>Publicar viaje</Texto>
              </View>
            )}
          </BotonPill>
          <Presionable
            accessibilityRole="button"
            onPress={() => router.push("/flota")}
            estilo={(pressed) => [SOMBRA.card, pressed && { transform: [{ scale: 1.03 }] }]}
            className="flex-1 items-center justify-center gap-2 rounded-3xl bg-white py-7 active:bg-[#4A5720]"
          >
            {(pressed) => (
              <>
                <Icono d={ICONOS.camion} size={28} color={pressed ? "#fff" : C.oliva} />
                <Texto className="text-[15px] font-bold" style={{ color: pressed ? "#fff" : C.tinta }}>Mi Flota</Texto>
              </>
            )}
          </Presionable>
        </View>

        <View className="mt-7 flex-row items-center justify-between">
          <Texto className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#9AA3AF]">Solicitudes cercanas</Texto>
          <View className="rounded-full bg-[#4A5720] px-3 py-1">
            <Texto className="text-[11px] font-bold text-white">{VIAJES.length} Nuevos</Texto>
          </View>
        </View>

        {VIAJES.map((v) => (
          <Pressable key={v.id} accessibilityRole="button" accessibilityLabel={`Ver solicitud de ${v.cliente}`} onPress={() => router.push({ pathname: "/viaje/[id]", params: { id: v.id } })} style={SOMBRA.card} className="mt-4 rounded-2xl border border-[#EDEFEB] bg-white p-4 active:bg-neutral-50">
            <View className="flex-row items-center gap-3">
              <Image source={imagen(v.img)} accessibilityLabel={v.cliente} contentFit="cover" style={{ width: 44, height: 44, borderRadius: 22 }} />
              <View className="min-w-0 flex-1">
                <Texto className="text-[15px] font-bold leading-tight text-[#16202E]">{v.cliente}</Texto>
                <Texto className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#9AA3AF]">{v.origen.split(",")[0]} • {v.publicado}</Texto>
              </View>
              <Texto className="text-[16px] font-bold text-[#4A5720]">RD$ {v.precio.toLocaleString("en-US")}</Texto>
            </View>
            <Texto className="mt-3 text-[13px] text-[#6B7688]">Transporte de {v.detalle} hacia {v.destino.split(",")[0]}.</Texto>
            {v.condiciones.filter((c) => c !== "Ninguna").length > 0 && (
              <View className="mt-2 flex-row flex-wrap gap-2">
                {v.condiciones.map((c) => (
                  <View key={c} className="rounded-md bg-secondary4-50 px-2 py-1">
                    <Texto className="text-[11px] font-semibold text-[#3F4A20]">{c}</Texto>
                  </View>
                ))}
              </View>
            )}
            <View className="mt-4 flex-row gap-3">
              <BotonPill color={C.oliva} onPress={() => router.navigate("/transportista-mapa")} className="flex-1 py-3" textClassName="text-[15px]" sinSombra>
                Aceptar
              </BotonPill>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Rechazar solicitud"
                className="h-11 w-11 items-center justify-center rounded-xl border border-[#EDEFEB] bg-white active:bg-error-500"
              >
                {({ pressed }) => <Icono d={ICONOS.cerrar} size={16} color={pressed ? "#fff" : "#8A93A2"} strokeWidth={2} />}
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
