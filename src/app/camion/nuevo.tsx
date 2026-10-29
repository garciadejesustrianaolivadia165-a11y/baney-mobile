import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import CabeceraVolver from "@/components/movil/cabecera-volver";
import Entrada, { Paso } from "@/components/movil/entrada";
import PieGuardar from "@/components/movil/pie-guardar";
import TarjetaSeleccion, { TONO } from "@/components/movil/tarjeta-seleccion";
import Icono, { ICONOS } from "@/components/ui/icono";
import SubirFoto from "@/components/ui/subir-foto";
import Texto from "@/components/ui/texto";
import { agregarCamion, CONDICIONES_VEHICULO, TIPOS_VEHICULO, UNIDADES_CAPACIDAD, type Camion } from "@/lib/flota";
import { imagen } from "@/lib/imagenes";

const ICONO_TIPO: Record<(typeof TIPOS_VEHICULO)[number], string> = {
  Volteo: ICONOS.camion,
  "Cama / Plataforma": "M2 16V6h14v10M16 10h3l3 4v2h-6M6 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 6 19zM17 19a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z",
  Furgón: "M2 16V5h13v11M15 8h4l3 4v4h-7M6 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 6 19zM17 19a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z",
  Refrigerado: "M12 2v20M4 7l16 10M20 7L4 17M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3",
  Cisterna: "M3 9a4 4 0 0 1 4-4h10a4 4 0 0 1 0 8H7a4 4 0 0 1-4-4zM6 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 6 19zM17 19a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2zM7 13v3M17 13v3",
  Otro: "M5 12h.01M12 12h.01M19 12h.01",
};
const ICONO_CONDICION: Record<string, string> = {
  Refrigeración: "M12 2v20M4 7l16 10M20 7L4 17M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3",
  "Material frágil": "M12 2l9 5v6c0 5-3.8 8.4-9 9-5.2-.6-9-4-9-9V7l9-5z",
  Perecederos: "M7 3v8a3 3 0 0 0 6 0V3M10 11v10M17 3c-1.5 2-2 4-2 6h4c0-2-.5-4-2-6zM17 9v12",
  "Material peligroso": "M12 3l9.5 16.5H2.5L12 3zM12 10v4M12 17h.01",
};

// Transportista → nuevo camión / medio de transporte. Misma línea gráfica que
// "Publicar disponibilidad": pasos numerados y tarjetas seleccionables.
export default function NuevoCamion() {
  const router = useRouter();
  const [tipo, setTipo] = useState<Camion["tipo"]>("Volteo");
  const [alias, setAlias] = useState("");
  const [marca, setMarca] = useState("");
  const [anio, setAnio] = useState("");
  const [placa, setPlaca] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [unidad, setUnidad] = useState<Camion["unidad"]>("m³");
  const [condiciones, setCondiciones] = useState<string[]>([]);
  const [seguro, setSeguro] = useState("");
  const [mantenimiento, setMantenimiento] = useState("");
  const [foto, setFoto] = useState<string | undefined>();

  const valido = alias.trim() !== "" && placa.trim() !== "" && capacidad.trim() !== "";

  function guardar() {
    if (!valido) return;
    agregarCamion({ alias: alias.trim(), tipo, marca: marca.trim(), anio: anio.trim(), placa: placa.trim().toUpperCase(), capacidad: capacidad.trim(), unidad, condiciones, seguro: seguro.trim(), ultimoMantenimiento: mantenimiento.trim() || "Sin registro", foto });
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo="Nuevo camión" onVolver={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="gap-7 px-5 py-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* 1. Tipo */}
          <View>
            <Paso>1. Tipo de vehículo</Paso>
            <View className="mt-4 flex-row flex-wrap justify-between gap-y-4">
              {TIPOS_VEHICULO.map((t) => {
                const activo = tipo === t;
                return (
                  <TarjetaSeleccion key={t} activo={activo} onPress={() => setTipo(t)} className="h-[96px] w-[47.5%] items-center justify-center gap-2">
                    <Icono d={ICONO_TIPO[t]} size={26} color={activo ? TONO.activo : TONO.inactivo} strokeWidth={1.7} />
                    <Texto className="text-[14px] font-semibold" style={{ color: activo ? TONO.activo : TONO.inactivo }}>{t}</Texto>
                  </TarjetaSeleccion>
                );
              })}
            </View>
          </View>

          {/* 2. Datos */}
          <View className="gap-4">
            <Paso>2. Datos del vehículo</Paso>
            <Entrada label="Nombre o alias" value={alias} onChange={setAlias} placeholder="Ej: Mack #23" />
            <Entrada label="Marca y modelo" value={marca} onChange={setMarca} placeholder="Ej: Mack Granite" />
            <View className="flex-row gap-3">
              <Entrada className="flex-1" label="Año" value={anio} onChange={(t) => setAnio(t.replace(/\D/g, "").slice(0, 4))} placeholder="2021" keyboardType="number-pad" />
              <Entrada className="flex-1" label="Placa" value={placa} onChange={setPlaca} placeholder="L123456" autoCapitalize="characters" />
            </View>
            <View>
              <Texto className="mb-2 text-[13px] text-[#8A93A2]">Capacidad</Texto>
              <View className="flex-row items-center gap-3 rounded-2xl bg-[#F1F4F2] px-5 py-4">
                <Entrada value={capacidad} onChange={(t) => setCapacidad(t.replace(/[^\d.]/g, ""))} placeholder="0" keyboardType="decimal-pad" className="flex-1 -mx-5 -my-4" />
                <Texto className="text-[15px] font-semibold text-[#8A93A2]">{unidad}</Texto>
              </View>
              <View className="mt-3 flex-row gap-3">
                {UNIDADES_CAPACIDAD.map((u) => (
                  <TarjetaSeleccion key={u} activo={unidad === u} onPress={() => setUnidad(u)} className="flex-1 items-center rounded-xl py-2.5">
                    <Texto className="text-[14px] font-semibold" style={{ color: unidad === u ? TONO.activo : TONO.inactivo }}>{u}</Texto>
                  </TarjetaSeleccion>
                ))}
              </View>
            </View>
          </View>

          {/* 3. Condiciones */}
          <View>
            <Paso>3. Cargas que puede transportar</Paso>
            <Texto className="mt-1.5 text-[13px] text-[#6B7688]">Marca las condiciones especiales que cumple el vehículo.</Texto>
            <View className="mt-4 gap-3">
              {CONDICIONES_VEHICULO.map((c) => {
                const activo = condiciones.includes(c);
                return (
                  <TarjetaSeleccion key={c} activo={activo} onPress={() => setCondiciones((prev) => (activo ? prev.filter((x) => x !== c) : [...prev, c]))} className="w-full flex-row items-center gap-3.5 px-4 py-4">
                    <Icono d={ICONO_CONDICION[c]} size={24} color={activo ? TONO.activo : TONO.inactivo} strokeWidth={1.7} />
                    <Texto className="flex-1 text-[15px] font-bold text-[#16202E]">{c}</Texto>
                    <View className={`h-5 w-5 items-center justify-center rounded-md border-2 ${activo ? "border-secondary4-400 bg-[#4A5720]" : "border-[#D6DAD2] bg-white"}`}>
                      {activo && <Icono d={ICONOS.check} size={12} color="#fff" strokeWidth={3.5} />}
                    </View>
                  </TarjetaSeleccion>
                );
              })}
            </View>
          </View>

          {/* 4. Documentos y mantenimiento */}
          <View className="gap-4">
            <Paso>4. Seguro y mantenimiento</Paso>
            <Entrada label="Seguro (aseguradora y vencimiento)" value={seguro} onChange={setSeguro} placeholder="Ej: Seguros Universal · 06/2027" />
            <Entrada label="Último mantenimiento" value={mantenimiento} onChange={setMantenimiento} placeholder="DD/MM/AAAA" keyboardType="numbers-and-punctuation" />
          </View>

          {/* 5. Foto */}
          <View>
            <Paso>5. Foto del vehículo (opcional)</Paso>
            <View className="mt-4 flex-row items-center gap-4">
              {foto ? (
                <Image source={imagen(foto)} contentFit="cover" style={{ width: 96, height: 96, borderRadius: 16 }} />
              ) : (
                <View className="h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-[#D8DCD5]">
                  <Icono d={ICONOS.camion} size={30} color="#C9CFC6" strokeWidth={1.7} />
                </View>
              )}
              <SubirFoto etiqueta={foto ? "Cambiar foto" : "Subir foto"} onFoto={setFoto} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <PieGuardar texto="Guardar camión" onPress={guardar} disabled={!valido} />
    </SafeAreaView>
  );
}
