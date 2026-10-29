import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BotonPill from "@/components/movil/boton-pill";
import CabeceraVolver from "@/components/movil/cabecera-volver";
import ProgramarCard, { PROGRAMACION_VACIA, type Programacion } from "@/components/movil/programar";
import TarjetaSeleccion, { TONO } from "@/components/movil/tarjeta-seleccion";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { C } from "@/lib/estilos";
import { IMAGENES } from "@/lib/imagenes";
import { descripcionCamion, useFlota } from "@/lib/flota";

const RUTA = [
  { label: "Origen (Punto de descarga actual)", valor: "La Romana, Rep. Dom.", icono: IMAGENES["/images/image_rutas/from_icon.png"] },
  { label: "Destino Final (Donde quieres volver)", valor: "Santo Domingo", icono: IMAGENES["/images/image_rutas/where_icon.png"] },
];
const HORARIOS = [
  { n: "Ahora mismo", d: ICONOS.reloj },
  { n: "Más tarde", d: ICONOS.calendario },
];

function Paso({ children }: { children: string }) {
  return <Texto className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#16202E]">{children}</Texto>;
}

// ============ VISTA 13: PUBLICAR DISPONIBILIDAD ============
export default function Flota() {
  const router = useRouter();
  const flota = useFlota();
  const [camion, setCamion] = useState(flota[0]?.alias ?? "");
  const [horario, setHorario] = useState("Ahora mismo");
  const [programacion, setProgramacion] = useState<Programacion>(PROGRAMACION_VACIA);
  const [precio, setPrecio] = useState("");
  const [enfocado, setEnfocado] = useState(false);
  const volver = () => router.navigate("/transportista");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo="Publicar Disponibilidad" onVolver={volver} />

      <ScrollView contentContainerClassName="gap-7 px-5 py-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* 1. Seleccionar camión */}
        <View>
          <Paso>1. Seleccionar camión</Paso>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="mt-4 gap-4">
            {flota.map((c) => {
              const activo = camion === c.alias;
              return (
                <TarjetaSeleccion key={c.id} activo={activo} onPress={() => setCamion(c.alias)} className="h-[122px] w-[152px] items-center justify-center gap-1.5">
                  <Icono d={ICONOS.camion} size={28} color={activo ? TONO.activo : "#B9C0CB"} strokeWidth={1.7} />
                  <Texto className="text-[16px] font-bold text-[#16202E]">{c.alias}</Texto>
                  <Texto className={`text-[13px] ${activo ? "text-[#7C8757]" : "text-[#8A93A2]"}`}>{descripcionCamion(c)}</Texto>
                </TarjetaSeleccion>
              );
            })}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Agregar camión"
              onPress={() => router.push("/camion/nuevo")}
              className="h-[122px] w-[152px] items-center justify-center rounded-2xl border-2 border-dashed border-[#D8DCD5] active:border-secondary4-400"
            >
              {({ pressed }) => <Icono d={ICONOS.mas} size={28} color={pressed ? "#747d24" : "#C9CFC6"} />}
            </Pressable>
          </ScrollView>
        </View>

        {/* 2. Ruta de retorno — mismos íconos de origen/destino que la tarjeta de ruta de la web */}
        <View>
          <Paso>2. Ruta de retorno</Paso>
          {RUTA.map((campo) => (
            <View key={campo.label} className="mt-4">
              <Texto className="text-[13px] text-[#8A93A2]">{campo.label}</Texto>
              <View className="mt-2 flex-row items-center gap-3 rounded-2xl bg-[#F1F4F2] px-5 py-4">
                <Image source={campo.icono} contentFit="contain" style={{ width: 24, height: 24 }} />
                <Texto className="text-[15px] text-[#16202E]">{campo.valor}</Texto>
              </View>
            </View>
          ))}
        </View>

        {/* 3. Horario */}
        <View>
          <Paso>3. Horario</Paso>
          <View className="mt-4 flex-row gap-4">
            {HORARIOS.map((h) => {
              const activo = horario === h.n;
              return (
                <TarjetaSeleccion key={h.n} activo={activo} onPress={() => setHorario(h.n)} className="h-[92px] flex-1 items-center justify-center gap-2">
                  <Icono d={h.d} size={20} color={activo ? TONO.activo : C.tinta} strokeWidth={1.7} />
                  <Texto className={`text-[15px] font-semibold ${activo ? "text-[#7C8757]" : "text-[#16202E]"}`}>{h.n}</Texto>
                </TarjetaSeleccion>
              );
            })}
          </View>
          {horario === "Más tarde" && <ProgramarCard valor={programacion} onCambio={setProgramacion} />}
        </View>

        {/* 4. Precio base */}
        <View>
          <Paso>4. Precio base (opcional)</Paso>
          <TextInput
            value={precio}
            onChangeText={setPrecio}
            placeholder="RD$ 0.00"
            placeholderTextColor="#9AA69C"
            keyboardType="decimal-pad"
            onFocus={() => setEnfocado(true)}
            onBlur={() => setEnfocado(false)}
            className={`mt-4 w-full rounded-2xl border-2 bg-[#F1F4F2] px-5 py-4 font-inter text-[15px] text-[#16202E] ${enfocado ? "border-secondary4-400" : "border-transparent"}`}
          />
        </View>
      </ScrollView>

      <View className="border-t border-[#EDEFEB] bg-white px-5 py-5">
        <BotonPill color={C.olivaOscuro} onPress={volver} className="w-full py-4" textClassName="text-[17px]" style={{ shadowColor: "#EC8A3C", shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } }}>
          Publicar Disponibilidad
        </BotonPill>
      </View>
    </SafeAreaView>
  );
}
