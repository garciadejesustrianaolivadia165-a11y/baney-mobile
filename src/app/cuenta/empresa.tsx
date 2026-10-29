import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Campo } from "@/components/dashboard/campo";
import BotonPill from "@/components/movil/boton-pill";
import CabeceraVolver from "@/components/movil/cabecera-volver";
import { Interruptor } from "@/components/movil/entrada";
import FormularioPerfil, { Divisor } from "@/components/perfil/formulario-perfil";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { C, SOMBRA } from "@/lib/estilos";
import { descripcionCamion, eliminarCamion, useFlota } from "@/lib/flota";
import { imagen } from "@/lib/imagenes";
import { actualizarPerfil, useSesion } from "@/lib/sesion";

// Perfil → Mi Empresa. Cliente/proveedor: la sección "Información Mercantil" de Mi Perfil.
// Transportista: su empresa de transporte si pertenece a una (si no, solo sus
// vehículos y licencia), con mantenimientos, seguro y licencia de conducir.
export default function MiEmpresa() {
  const router = useRouter();
  const { rol, perfil } = useSesion();
  const flota = useFlota();
  const transportista = rol === "transportista";
  const [conEmpresa, setConEmpresa] = useState(perfil.empresa.nombre !== "");
  const [licencia, setLicencia] = useState(perfil.licencia);
  const [guardado, setGuardado] = useState(false);
  const setL = (k: keyof typeof licencia) => (v: string) => {
    setLicencia((l) => ({ ...l, [k]: v }));
    setGuardado(false);
  };

  const vacia = { nombre: "", rnc: "", correo: "", telefono: "", direccion: "", dueno: "" };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo="Mi Empresa" onVolver={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="gap-8 px-5 py-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {transportista && (
            <View style={SOMBRA.card} className="flex-row items-center gap-4 rounded-[1.5rem] bg-white px-5 py-4">
              <View className="min-w-0 flex-1">
                <Texto className="font-sans text-[15px] font-bold text-[#415936]">¿Perteneces a una empresa de transporte?</Texto>
                <Texto className="mt-1 text-[12px] text-neutral-500">Si trabajas por tu cuenta, deja esto apagado: solo verás tus vehículos y tu licencia.</Texto>
              </View>
              <Interruptor valor={conEmpresa} onCambio={(v) => { setConEmpresa(v); if (!v) actualizarPerfil({ empresa: vacia }); }} etiqueta="Pertenezco a una empresa" />
            </View>
          )}

          {(!transportista || conEmpresa) && (
            <>
              <Divisor titulo={transportista ? "Empresa de transporte" : "Información Mercantil"} />
              <FormularioPerfil inicial={perfil} secciones={["empresa"]} onGuardar={(v) => actualizarPerfil({ empresa: v.empresa })} />
            </>
          )}

          {transportista && (
            <>
              <Divisor titulo="Mis Vehículos" />
              <View className="gap-4">
                {flota.map((c) => (
                  <View key={c.id} style={SOMBRA.card} className="rounded-[1.5rem] bg-white p-4">
                    <View className="flex-row items-center gap-3.5">
                      {c.foto ? (
                        <Image source={imagen(c.foto)} contentFit="cover" style={{ width: 56, height: 56, borderRadius: 14 }} />
                      ) : (
                        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
                          <Icono d={ICONOS.camion} size={26} color={C.oliva} strokeWidth={1.7} />
                        </View>
                      )}
                      <View className="min-w-0 flex-1">
                        <Texto className="text-[16px] font-bold leading-tight text-[#3F443D]">{c.alias}</Texto>
                        <Texto className="mt-0.5 text-[13px] text-neutral-500">{descripcionCamion(c)} · {c.marca} {c.anio}</Texto>
                        <Texto className="mt-0.5 text-[12px] font-semibold uppercase tracking-wide text-neutral-400">Placa {c.placa}</Texto>
                      </View>
                      <Pressable accessibilityRole="button" accessibilityLabel={`Eliminar ${c.alias}`} onPress={() => eliminarCamion(c.id)} hitSlop={8} className="h-9 w-9 items-center justify-center rounded-full border border-error-200 active:bg-error-500">
                        {({ pressed }) => <Icono d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" size={16} color={pressed ? "#fff" : "#ef4444"} />}
                      </Pressable>
                    </View>
                    <View className="mt-3 flex-row flex-wrap gap-2">
                      <View className="rounded-full bg-neutral-100 px-3 py-1">
                        <Texto className="text-[11px] text-neutral-600">Mantenimiento: {c.ultimoMantenimiento}</Texto>
                      </View>
                      <View className="rounded-full bg-neutral-100 px-3 py-1">
                        <Texto className="text-[11px] text-neutral-600">Seguro: {c.seguro}</Texto>
                      </View>
                      {c.condiciones.map((x) => (
                        <View key={x} className="rounded-full bg-success-100 px-3 py-1">
                          <Texto className="text-[11px] font-semibold text-success-700">{x}</Texto>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
                <BotonPill color="#486440" variante="borde" textoColor="#364a2d" onPress={() => router.push("/camion/nuevo")} className="w-full py-3.5" sinSombra>
                  {(pressed) => (
                    <View className="flex-row items-center gap-2">
                      <Icono d={ICONOS.mas} size={16} color={pressed ? "#fff" : "#364a2d"} strokeWidth={2.2} />
                      <Texto className="font-sans text-[15px] font-semibold" style={{ color: pressed ? "#fff" : "#364a2d" }}>Agregar camión / medio de transporte</Texto>
                    </View>
                  )}
                </BotonPill>
              </View>

              <Divisor titulo="Licencia de Conducir" />
              <View className="gap-5">
                <Campo label="Número de licencia" value={licencia.numero} onChange={setL("numero")} keyboardType="numbers-and-punctuation" />
                <Campo label="Categoría" value={licencia.categoria} onChange={setL("categoria")} />
                <Campo label="Vencimiento" value={licencia.vencimiento} onChange={setL("vencimiento")} placeholder="MM/AAAA" keyboardType="numbers-and-punctuation" />
              </View>
              <View className="gap-4">
                <BotonPill color="#364a2d" textoColor="#fdf8f0" onPress={() => { actualizarPerfil({ licencia }); setGuardado(true); }} className="w-full py-3.5" textClassName="font-sans text-[15px] font-semibold">
                  Guardar licencia
                </BotonPill>
                {guardado && (
                  <View accessibilityRole="alert" className="self-center rounded-full bg-success-100 px-4 py-2">
                    <Texto className="text-xs font-semibold text-success-700">Cambios guardados</Texto>
                  </View>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
