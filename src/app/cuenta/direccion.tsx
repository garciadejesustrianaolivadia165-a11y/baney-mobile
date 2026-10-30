import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BuscadorLugar from "@/components/movil/buscador-lugar";
import CabeceraVolver from "@/components/movil/cabecera-volver";
import Entrada, { Interruptor, Paso } from "@/components/movil/entrada";
import PieGuardar from "@/components/movil/pie-guardar";
import TarjetaSeleccion, { TONO } from "@/components/movil/tarjeta-seleccion";
import Texto from "@/components/ui/texto";
import { buscarDireccion, DIRECCION_VACIA, ETIQUETAS, guardarDireccion, type Etiqueta } from "@/lib/direcciones";
import { IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import { useSesion } from "@/lib/sesion";

// Alta y edición de una dirección (con ?id= edita la existente).
export default function Direccion() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { perfil } = useSesion();
  const existente = id ? buscarDireccion(id) : undefined;
  const [d, setD] = useState(existente ?? { ...DIRECCION_VACIA, contacto: `${perfil.nombres} ${perfil.apellidos}`, telefono: perfil.telefono });
  const set = <K extends keyof typeof d>(k: K) => (v: (typeof d)[K]) => setD((x) => ({ ...x, [k]: v }));

  function guardar() {
    guardarDireccion({ etiqueta: d.etiqueta, direccion: d.direccion.trim(), provincia: d.provincia.trim(), referencia: d.referencia.trim(), contacto: d.contacto.trim(), telefono: d.telefono.trim(), predeterminada: d.predeterminada }, existente?.id);
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo={existente ? "Editar dirección" : "Nueva dirección"} onVolver={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="gap-7 px-5 py-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View>
            <Paso>1. ¿Qué lugar es?</Paso>
            <View className="mt-4 flex-row flex-wrap gap-2.5">
              {ETIQUETAS.map((e: Etiqueta) => {
                const activo = d.etiqueta === e;
                return (
                  <TarjetaSeleccion key={e} activo={activo} onPress={() => set("etiqueta")(e)} className="px-4 py-2.5">
                    <Texto className="text-[14px] font-semibold" style={{ color: activo ? TONO.activo : TONO.inactivo }}>{e}</Texto>
                  </TarjetaSeleccion>
                );
              })}
            </View>
          </View>

          <View style={[SOMBRA.suave, { zIndex: 20 }]} className="gap-4 rounded-2xl border border-[#EDEFEB] bg-white px-5 py-5">
            <Paso>2. Dirección</Paso>
            <BuscadorLugar etiqueta="Dirección" valor={d.direccion} onCambio={set("direccion")} placeholder="Calle, número, sector" icono={IMAGENES["/images/image_rutas/where_icon.png"]} />
            <Entrada label="Provincia" value={d.provincia} onChange={set("provincia")} placeholder="Santo Domingo" />
            <Entrada label="Referencia para el chofer" value={d.referencia} onChange={set("referencia")} placeholder="Portón verde, frente al colmado…" multiline />
          </View>

          <View className="gap-4">
            <Paso>3. ¿Quién recibe?</Paso>
            <Entrada label="Nombre de contacto" value={d.contacto} onChange={set("contacto")} placeholder="Nombre y apellido" />
            <Entrada label="Teléfono" value={d.telefono} onChange={set("telefono")} placeholder="+1 (809) 000-0000" keyboardType="phone-pad" />
          </View>

          <View style={SOMBRA.card} className="flex-row items-center gap-4 rounded-[1.5rem] bg-white px-5 py-4">
            <View className="min-w-0 flex-1">
              <Texto className="font-sans text-[15px] font-bold text-[#415936]">Usar como predeterminada</Texto>
              <Texto className="mt-1 text-[12px] text-neutral-500">Se propone primero al pedir transporte o comprar.</Texto>
            </View>
            <Interruptor valor={d.predeterminada} onCambio={set("predeterminada")} etiqueta="Dirección predeterminada" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <PieGuardar texto={existente ? "Guardar cambios" : "Guardar dirección"} onPress={guardar} disabled={d.direccion.trim() === "" || d.contacto.trim() === ""} />
    </SafeAreaView>
  );
}
