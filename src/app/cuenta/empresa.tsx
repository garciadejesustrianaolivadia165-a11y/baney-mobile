import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BotonPill from "@/components/movil/boton-pill";
import CabeceraVolver from "@/components/movil/cabecera-volver";
import Entrada, { Interruptor, Paso } from "@/components/movil/entrada";
import PieGuardar from "@/components/movil/pie-guardar";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { C, SOMBRA } from "@/lib/estilos";
import { descripcionCamion, eliminarCamion, useFlota } from "@/lib/flota";
import { imagen } from "@/lib/imagenes";
import { actualizarPerfil, useSesion } from "@/lib/sesion";

// Perfil → Mi Empresa. Cliente/proveedor: datos mercantiles del negocio.
// Transportista: su empresa de transporte si pertenece a una (si no la registró,
// solo sus vehículos y licencia), con la flota, mantenimientos y licencia de conducir.
export default function MiEmpresa() {
  const router = useRouter();
  const { rol, perfil } = useSesion();
  const flota = useFlota();
  const transportista = rol === "transportista";
  const [conEmpresa, setConEmpresa] = useState(perfil.empresa.nombre !== "");
  const [empresa, setEmpresa] = useState(perfil.empresa);
  const [licencia, setLicencia] = useState(perfil.licencia);
  const [guardado, setGuardado] = useState(false);
  const setE = (k: keyof typeof empresa) => (v: string) => {
    setEmpresa((e) => ({ ...e, [k]: v }));
    setGuardado(false);
  };
  const setL = (k: keyof typeof licencia) => (v: string) => {
    setLicencia((l) => ({ ...l, [k]: v }));
    setGuardado(false);
  };

  function guardar() {
    actualizarPerfil({ empresa: conEmpresa || !transportista ? empresa : { nombre: "", rnc: "", correo: "", telefono: "", direccion: "", dueno: "" }, licencia });
    setGuardado(true);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo="Mi Empresa" onVolver={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="gap-7 px-5 py-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {transportista && (
            <View style={SOMBRA.card} className="flex-row items-center gap-4 rounded-2xl border border-[#EDEFEB] bg-white px-5 py-4">
              <View className="min-w-0 flex-1">
                <Texto className="text-[15px] font-bold text-[#16202E]">¿Perteneces a una empresa de transporte?</Texto>
                <Texto className="mt-1 text-[12px] text-[#6B7688]">Si trabajas por tu cuenta, deja esto apagado: solo verás tus vehículos y tu licencia.</Texto>
              </View>
              <Interruptor valor={conEmpresa} onCambio={(v) => { setConEmpresa(v); setGuardado(false); }} etiqueta="Pertenezco a una empresa" />
            </View>
          )}

          {(!transportista || conEmpresa) && (
            <View className="gap-4">
              <Paso>{transportista ? "Empresa de transporte" : "Información mercantil"}</Paso>
              <Entrada label={transportista ? "Nombre de la empresa" : "Nombre de negocio"} value={empresa.nombre} onChange={setE("nombre")} placeholder="Ej: Transportes del Este SRL" />
              <Entrada label="RNC" value={empresa.rnc} onChange={setE("rnc")} keyboardType="numbers-and-punctuation" />
              <Entrada label="Correo corporativo" value={empresa.correo} onChange={setE("correo")} keyboardType="email-address" autoCapitalize="none" />
              <Entrada label={transportista ? "Teléfono de la empresa" : "Número telefónico del negocio"} value={empresa.telefono} onChange={setE("telefono")} keyboardType="phone-pad" />
              <Entrada label={transportista ? "Dirección" : "Dirección del negocio"} value={empresa.direccion} onChange={setE("direccion")} />
              <Entrada label={transportista ? "Responsable / dueño" : "Dueño del negocio"} value={empresa.dueno} onChange={setE("dueno")} />
            </View>
          )}

          {transportista && (
            <>
              <View>
                <View className="flex-row items-center justify-between">
                  <Paso>Mis vehículos</Paso>
                  <Pressable accessibilityRole="button" accessibilityLabel="Agregar camión" onPress={() => router.push("/camion/nuevo")} className="h-9 w-9 items-center justify-center rounded-full bg-[#4A5720] active:scale-110">
                    <Icono d={ICONOS.mas} size={16} color="#fff" strokeWidth={2.2} />
                  </Pressable>
                </View>
                <View className="mt-4 gap-4">
                  {flota.map((c) => (
                    <View key={c.id} style={SOMBRA.suave} className="rounded-2xl border border-[#EDEFEB] bg-white p-4">
                      <View className="flex-row items-center gap-3.5">
                        {c.foto ? (
                          <Image source={imagen(c.foto)} contentFit="cover" style={{ width: 56, height: 56, borderRadius: 14 }} />
                        ) : (
                          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F4F2]">
                            <Icono d={ICONOS.camion} size={26} color={C.oliva} strokeWidth={1.7} />
                          </View>
                        )}
                        <View className="min-w-0 flex-1">
                          <Texto className="text-[16px] font-bold leading-tight text-[#16202E]">{c.alias}</Texto>
                          <Texto className="mt-0.5 text-[13px] text-[#6B7688]">{descripcionCamion(c)} · {c.marca} {c.anio}</Texto>
                          <Texto className="mt-0.5 text-[12px] font-semibold uppercase tracking-wide text-[#9AA3AF]">Placa {c.placa}</Texto>
                        </View>
                        <Pressable accessibilityRole="button" accessibilityLabel={`Eliminar ${c.alias}`} onPress={() => eliminarCamion(c.id)} hitSlop={8} className="h-9 w-9 items-center justify-center rounded-xl border border-[#EDEFEB] active:bg-error-500">
                          {({ pressed }) => <Icono d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" size={16} color={pressed ? "#fff" : "#8A93A2"} />}
                        </Pressable>
                      </View>
                      <View className="mt-3 flex-row flex-wrap gap-2">
                        <View className="rounded-md bg-[#F1F3F0] px-2 py-1">
                          <Texto className="text-[11px] text-[#6B7688]">Mantenimiento: {c.ultimoMantenimiento}</Texto>
                        </View>
                        <View className="rounded-md bg-[#F1F3F0] px-2 py-1">
                          <Texto className="text-[11px] text-[#6B7688]">Seguro: {c.seguro}</Texto>
                        </View>
                        {c.condiciones.map((x) => (
                          <View key={x} className="rounded-md bg-secondary4-50 px-2 py-1">
                            <Texto className="text-[11px] font-semibold text-[#3F4A20]">{x}</Texto>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                  <BotonPill color={C.oliva} variante="borde" textoColor={C.oliva} onPress={() => router.push("/camion/nuevo")} className="w-full py-3.5" textClassName="text-[15px]" sinSombra>
                    {(pressed) => (
                      <View className="flex-row items-center gap-2">
                        <Icono d={ICONOS.mas} size={16} color={pressed ? "#fff" : C.oliva} strokeWidth={2.2} />
                        <Texto className="text-[15px] font-bold" style={{ color: pressed ? "#fff" : C.oliva }}>Registrar otro vehículo</Texto>
                      </View>
                    )}
                  </BotonPill>
                </View>
              </View>

              <View className="gap-4">
                <Paso>Licencia de conducir</Paso>
                <Entrada label="Número de licencia" value={licencia.numero} onChange={setL("numero")} keyboardType="numbers-and-punctuation" />
                <Entrada label="Categoría" value={licencia.categoria} onChange={setL("categoria")} />
                <Entrada label="Vencimiento" value={licencia.vencimiento} onChange={setL("vencimiento")} placeholder="MM/AAAA" keyboardType="numbers-and-punctuation" />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <PieGuardar texto="Guardar cambios" onPress={guardar} guardado={guardado} />
    </SafeAreaView>
  );
}
