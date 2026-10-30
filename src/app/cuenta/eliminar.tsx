import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BotonPill from "@/components/movil/boton-pill";
import CabeceraVolver from "@/components/movil/cabecera-volver";
import Entrada, { Paso } from "@/components/movil/entrada";
import TarjetaSeleccion, { TONO } from "@/components/movil/tarjeta-seleccion";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { actualizarSesion, cerrarSesion } from "@/lib/sesion";

const MOTIVOS = ["Ya no lo necesito", "Tengo otra cuenta", "Problemas con pedidos o pagos", "Privacidad de mis datos", "Otro"];

// UC-USER-11 · Eliminar cuenta: motivo, confirmación con contraseña y despedida.
export default function EliminarCuenta() {
  const router = useRouter();
  const [motivo, setMotivo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [entiendo, setEntiendo] = useState(false);
  const [eliminada, setEliminada] = useState(false);

  function eliminar() {
    // TODO: DELETE /users/me con la contraseña; aquí se cierra la sesión y se olvida el rol
    setEliminada(true);
  }

  if (eliminada) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-8">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-50">
          <Icono d={ICONOS.check} size={36} color="#486440" strokeWidth={2.5} />
        </View>
        <Texto className="mt-5 text-center font-sans text-2xl font-bold text-neutral-900">Cuenta eliminada</Texto>
        <Texto className="mt-2 text-center font-sans text-sm leading-relaxed text-neutral-600">
          Gracias por haber sido parte de BANEY. Tus datos se borrarán por completo en los próximos 30 días. Si cambias de opinión, puedes crear una cuenta nueva cuando quieras.
        </Texto>
        <BotonPill color="#2F3E17" onPress={() => { cerrarSesion(); actualizarSesion({ rol: null, busca: null }); router.replace("/"); }} className="mt-8 w-full py-4" textClassName="text-[16px]">
          Volver al inicio
        </BotonPill>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo="Eliminar mi cuenta" onVolver={() => router.back()} />
      <ScrollView contentContainerClassName="gap-7 px-5 py-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={SOMBRA.card} className="flex-row items-start gap-4 rounded-[1.5rem] bg-error-50 px-5 py-4">
          <Icono d={ICONOS.alertas} size={24} color="#dc2626" strokeWidth={1.7} />
          <View className="min-w-0 flex-1">
            <Texto className="font-sans text-[15px] font-bold text-error-700">Esta acción no se puede deshacer</Texto>
            <Texto className="mt-1 text-[13px] leading-snug text-error-700/80">Perderás tu historial, tus direcciones, tus métodos de pago y, si eres proveedor, tu catálogo de productos.</Texto>
          </View>
        </View>

        <View>
          <Paso>¿Por qué te vas?</Paso>
          <View className="mt-4 gap-2.5">
            {MOTIVOS.map((m) => {
              const activo = motivo === m;
              return (
                <TarjetaSeleccion key={m} activo={activo} onPress={() => setMotivo(m)} className="px-4 py-3">
                  <Texto className="text-[14px] font-semibold" style={{ color: activo ? TONO.activo : TONO.inactivo }}>{m}</Texto>
                </TarjetaSeleccion>
              );
            })}
          </View>
          {motivo === "Otro" && <Entrada className="mt-4" value={detalle} onChange={setDetalle} placeholder="Cuéntanos un poco más (opcional)" multiline />}
        </View>

        <View className="gap-4">
          <Paso>Confirma que eres tú</Paso>
          <Entrada label="Contraseña" value={contrasena} onChange={setContrasena} placeholder="••••••••" autoCapitalize="none" secreto />
          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: entiendo }} onPress={() => setEntiendo((v) => !v)} className="flex-row items-start gap-3">
            <View className={`mt-0.5 h-5 w-5 items-center justify-center rounded-md border-2 ${entiendo ? "border-[#4A5720] bg-[#4A5720]" : "border-neutral-300"}`}>
              {entiendo && <Icono d={ICONOS.check} size={12} color="#fff" strokeWidth={3} />}
            </View>
            <Texto className="flex-1 text-[13px] leading-snug text-neutral-600">Entiendo que mi cuenta y mis datos se eliminarán de forma permanente.</Texto>
          </Pressable>
        </View>

        <BotonPill color="#E9564F" disabled={motivo === "" || contrasena.length < 6 || !entiendo} onPress={eliminar} className="w-full py-4" textClassName="text-[16px]">
          Eliminar mi cuenta
        </BotonPill>
        <BotonPill color="#2F3E17" variante="borde" textoColor="#2F3E17" onPress={() => router.back()} className="w-full py-3.5" textClassName="text-[15px]" sinSombra>
          Conservar mi cuenta
        </BotonPill>
      </ScrollView>
    </SafeAreaView>
  );
}
