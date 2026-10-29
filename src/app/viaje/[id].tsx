import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Mapa from "@/components/mapa";
import BotonPill from "@/components/movil/boton-pill";
import CabeceraVolver from "@/components/movil/cabecera-volver";
import { Paso } from "@/components/movil/entrada";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { C, SOMBRA } from "@/lib/estilos";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { buscarViaje, pesos } from "@/lib/viajes";
import { useSesion } from "@/lib/sesion";

const ICONO_MATERIAL: Record<string, string> = {
  Materiales: "M4 9h16v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9zM8 9V7a4 4 0 0 1 8 0v2",
  Agregados: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z",
  Maquinaria: "M7 8h13l-3-3M17 16H4l3 3",
  Otro: "M5 12h.01M12 12h.01M19 12h.01",
};
const ICONO_CONDICION: Record<string, string> = {
  "Material delicado o frágil": "M12 2l9 5v6c0 5-3.8 8.4-9 9-5.2-.6-9-4-9-9V7l9-5z",
  "Comestible o perecedero": "M7 3v8a3 3 0 0 0 6 0V3M10 11v10M17 3c-1.5 2-2 4-2 6h4c0-2-.5-4-2-6zM17 9v12",
  Refrigeración: "M12 2v20M4 7l16 10M20 7L4 17M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3",
  "Material peligroso": "M12 3l9.5 16.5H2.5L12 3zM12 10v4M12 17h.01",
  Ninguna: ICONOS.check,
};

function Tarjeta({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <View style={SOMBRA.suave} className={`rounded-2xl border border-[#EDEFEB] bg-white p-4 ${className}`}>
      {children}
    </View>
  );
}

function Fila({ k, v, fuerte }: { k: string; v: string; fuerte?: boolean }) {
  return (
    <View className="flex-row items-center justify-between gap-4 py-2">
      <Texto className={`text-[14px] ${fuerte ? "font-bold text-[#16202E]" : "text-[#6B7688]"}`}>{k}</Texto>
      <Texto className={`text-[14px] text-[#16202E] ${fuerte ? "font-bold" : ""}`}>{v}</Texto>
    </View>
  );
}

// Transportista → detalle de la solicitud de un cliente cercano: ruta, carga
// (material, peso, condiciones especiales, notas) y pago, con aceptar/rechazar.
export default function DetalleViaje() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const viaje = buscarViaje(id);
  const { rol } = useSesion();
  const historico = !!viaje?.estado;

  if (!viaje) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <CabeceraVolver titulo="Detalle del viaje" onVolver={() => router.back()} />
        <View className="flex-1 items-center justify-center px-8">
          <Texto className="text-center text-[14px] text-[#6B7688]">Esta solicitud ya no está disponible.</Texto>
        </View>
      </SafeAreaView>
    );
  }

  const total = viaje.precio + viaje.servicio + viaje.seguro;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo="Detalle del viaje" onVolver={() => router.back()} />
      <ScrollView contentContainerClassName="gap-5 px-5 py-5" showsVerticalScrollIndicator={false}>
        {/* Mapa con el destino */}
        <View className="h-[200px] overflow-hidden rounded-2xl bg-neutral-100">
          <Mapa />
          <View pointerEvents="none" style={SOMBRA.boton} className="absolute bottom-4 left-4 flex-row items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#4A5720]">
              <Icono d={ICONOS.pin} size={16} color="#fff" relleno />
            </View>
            <View>
              <Texto className="text-[10px] uppercase tracking-wide text-[#9AA3AF]">Destino</Texto>
              <Texto className="text-[13px] font-bold text-[#16202E]">{viaje.destino}</Texto>
            </View>
          </View>
          <View className={`absolute right-4 top-4 rounded-md px-2.5 py-1 ${viaje.estado === "Cancelado" ? "bg-error-100" : viaje.tono === "ok" ? "bg-success-100" : "bg-warning-100"}`}>
            <Texto className={`text-[11px] font-semibold ${viaje.estado === "Cancelado" ? "text-error-600" : viaje.tono === "ok" ? "text-success-700" : "text-warning-800"}`}>{viaje.chip}</Texto>
          </View>
        </View>

        {/* Cliente */}
        <Tarjeta>
          <View className="flex-row items-center gap-3.5">
            <Image source={imagen(viaje.img)} accessibilityLabel={viaje.cliente} contentFit="cover" style={{ width: 56, height: 56, borderRadius: 28 }} />
            <View className="min-w-0 flex-1">
              <Texto className="text-[17px] font-bold leading-tight text-[#16202E]">{viaje.cliente}</Texto>
              <Texto className="mt-0.5 text-[13px] text-[#6B7688]">{viaje.empresa}</Texto>
              <Texto className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#9AA3AF]">{historico ? viaje.fecha : `Publicado ${viaje.publicado}`}</Texto>
              {viaje.transportista && <Texto className="mt-1 text-[12px] text-[#4A5720]">Transportista: {viaje.transportista}</Texto>}
            </View>
            {[
              { l: "Llamar", d: ICONOS.llamar },
              { l: "Mensaje", d: ICONOS.mensaje },
            ].map((b) => (
              <Pressable key={b.l} accessibilityRole="button" accessibilityLabel={b.l} className="h-11 w-11 items-center justify-center rounded-2xl bg-[#FDE7E7] active:scale-110">
                <Icono d={b.d} size={18} color={C.rojo} />
              </Pressable>
            ))}
          </View>
        </Tarjeta>

        {/* Ruta */}
        <View>
          <Paso>Ruta</Paso>
          <Tarjeta className="mt-3 gap-3">
            {[
              { label: "Origen", valor: viaje.origen, icono: IMAGENES["/images/image_rutas/from_icon.png"] },
              { label: "Destino", valor: viaje.destino, icono: IMAGENES["/images/image_rutas/where_icon.png"] },
            ].map((p) => (
              <View key={p.label} className="flex-row items-center gap-3">
                <Image source={p.icono} contentFit="contain" style={{ width: 28, height: 28 }} />
                <View className="min-w-0 flex-1">
                  <Texto className="text-[11px] font-bold uppercase tracking-wide text-[#9AA3AF]">{p.label}</Texto>
                  <Texto className="text-[15px] text-[#16202E]">{p.valor}</Texto>
                </View>
              </View>
            ))}
            <View className="mt-1 flex-row flex-wrap gap-2 border-t border-[#EDEFEB] pt-3">
              <View className="flex-row items-center gap-1.5 rounded-md bg-[#F1F3F0] px-2 py-1">
                <Icono d={ICONOS.pin} size={12} color="#6B7688" relleno />
                <Texto className="text-[11px] text-[#6B7688]">{viaje.distancia}</Texto>
              </View>
              <View className="flex-row items-center gap-1.5 rounded-md bg-[#F1F3F0] px-2 py-1">
                <Icono d={viaje.programacion.startsWith("Ahora") ? ICONOS.reloj : ICONOS.calendario} size={12} color="#6B7688" strokeWidth={2} />
                <Texto className="text-[11px] text-[#6B7688]">{viaje.programacion}</Texto>
              </View>
            </View>
          </Tarjeta>
        </View>

        {/* Carga */}
        <View>
          <Paso>Carga</Paso>
          <Tarjeta className="mt-3">
            <View className="flex-row items-center gap-3.5">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-secondary4-50">
                <Icono d={ICONO_MATERIAL[viaje.material]} size={24} color="#3F4A20" strokeWidth={1.7} />
              </View>
              <View className="min-w-0 flex-1">
                <Texto className="text-[15px] font-bold text-[#16202E]">{viaje.detalle}</Texto>
                <Texto className="text-[13px] text-[#6B7688]">{viaje.material} · {viaje.peso} {viaje.unidad} · requiere {viaje.transporte}</Texto>
              </View>
            </View>
            <Texto className="mt-4 text-[11px] font-bold uppercase tracking-wide text-[#9AA3AF]">Condiciones especiales</Texto>
            <View className="mt-2 flex-row flex-wrap gap-2">
              {viaje.condiciones.map((c) => (
                <View key={c} className={`flex-row items-center gap-1.5 rounded-xl border-2 px-3 py-2 ${c === "Ninguna" ? "border-[#EDEFEB] bg-white" : "border-secondary4-400 bg-secondary4-50"}`}>
                  <Icono d={ICONO_CONDICION[c] ?? ICONOS.check} size={16} color={c === "Ninguna" ? "#5D6B84" : "#3F4A20"} strokeWidth={1.8} />
                  <Texto className="text-[13px] font-semibold" style={{ color: c === "Ninguna" ? "#5D6B84" : "#3F4A20" }}>{c}</Texto>
                </View>
              ))}
            </View>
            {viaje.notas !== "" && (
              <>
                <Texto className="mt-4 text-[11px] font-bold uppercase tracking-wide text-[#9AA3AF]">Detalles adicionales</Texto>
                <View className="mt-2 rounded-2xl bg-[#F1F4F2] px-4 py-3">
                  <Texto className="text-[14px] leading-relaxed text-[#16202E]">{viaje.notas}</Texto>
                </View>
              </>
            )}
          </Tarjeta>
        </View>

        {/* Pago */}
        <View>
          <Paso>Pago</Paso>
          <Tarjeta className="mt-3">
            <Fila k={`Transporte de ${viaje.material.toLowerCase()}`} v={pesos(viaje.precio)} />
            <Fila k="Servicio de plataforma" v={pesos(viaje.servicio)} />
            <Fila k="Seguro de carga" v={pesos(viaje.seguro)} />
            <View className="mt-1 border-t border-[#EDEFEB]">
              <Fila k="Total del viaje" v={pesos(total)} fuerte />
            </View>
            <View className="mt-2 flex-row items-center justify-between rounded-2xl bg-[#E6EAE0] px-4 py-3">
              <Texto className="text-[13px] text-[#3F4A20]">{rol === "transportista" ? "Tu ganancia estimada" : historico ? (viaje.estado === "Cancelado" ? "Sin cargo" : "Total pagado") : "Total a pagar"}</Texto>
              <Texto className="text-[18px] font-bold text-[#4A5720]">{rol === "transportista" ? pesos(viaje.precio) : viaje.estado === "Cancelado" ? pesos(0) : pesos(total)}</Texto>
            </View>
          </Tarjeta>
        </View>
      </ScrollView>

      <View className="flex-row gap-3 border-t border-[#EDEFEB] bg-white px-5 py-5">
        {historico ? (
          <>
            <BotonPill color={C.oliva} onPress={() => router.push(rol === "transportista" ? "/flota" : "/solicitud")} className="flex-1 py-4" textClassName="text-[15px]">
              {rol === "transportista" ? "Publicar disponibilidad" : "Pedir de nuevo"}
            </BotonPill>
            <BotonPill color="#EDEFEB" variante="borde" textoColor={C.tinta} onPress={() => router.back()} className="px-6 py-4" textClassName="text-[15px]" sinSombra>
              Volver
            </BotonPill>
          </>
        ) : (
          <>
            <BotonPill color={C.oliva} onPress={() => router.replace("/transportista-mapa")} className="flex-1 py-4" textClassName="text-[15px]">
              Aceptar viaje
            </BotonPill>
            <BotonPill color="#E9564F" variante="borde" textoColor="#E9564F" onPress={() => router.back()} className="px-6 py-4" textClassName="text-[15px]" sinSombra>
              Rechazar
            </BotonPill>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
