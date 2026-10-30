import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BotonPill from "@/components/movil/boton-pill";
import CabeceraVolver from "@/components/movil/cabecera-volver";
import Entrada, { FilaOpcion, Interruptor, Paso } from "@/components/movil/entrada";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { actualizarPreferencias, usePreferencias } from "@/lib/preferencias";
import { cerrarSesion, SALIDA } from "@/lib/sesion";
import { contrasenaValida, RequisitosContrasena } from "../(auth)/restablecer";

/** Notificaciones y seguridad (lo comparten Perfil → Configuración y el menú del cliente) */
export function ConfiguracionContenido() {
  const router = useRouter();
  const { push, correo, ofertas, ubicacion, dosPasos } = usePreferencias();
  const setPush = (v: boolean) => actualizarPreferencias({ push: v });
  const setCorreo = (v: boolean) => actualizarPreferencias({ correo: v });
  const setOfertas = (v: boolean) => actualizarPreferencias({ ofertas: v });
  const setUbicacion = (v: boolean) => actualizarPreferencias({ ubicacion: v });
  const setDosPasos = (v: boolean) => actualizarPreferencias({ dosPasos: v });
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [cambiada, setCambiada] = useState(false);

  return (
    <>
        <View>
          <Paso>Notificaciones</Paso>
          <View style={SOMBRA.alta} className="mt-4 overflow-hidden rounded-[24px] bg-white">
            <FilaOpcion icono={ICONOS.alertas} titulo="Notificaciones push" detalle="Nuevas oportunidades y estado de tus viajes">
              <Interruptor valor={push} onCambio={setPush} etiqueta="Notificaciones push" />
            </FilaOpcion>
            <FilaOpcion icono={ICONOS.correo} titulo="Correo electrónico" detalle="Resumen semanal y facturas">
              <Interruptor valor={correo} onCambio={setCorreo} etiqueta="Correo electrónico" />
            </FilaOpcion>
            <FilaOpcion icono={ICONOS.fuego} titulo="Ofertas y promociones" detalle="Descuentos de camiones de retorno">
              <Interruptor valor={ofertas} onCambio={setOfertas} etiqueta="Ofertas y promociones" />
            </FilaOpcion>
            <FilaOpcion icono={ICONOS.pin} titulo="Compartir ubicación" detalle="Necesaria para ver camiones y clientes cercanos">
              <Interruptor valor={ubicacion} onCambio={setUbicacion} etiqueta="Compartir ubicación" />
            </FilaOpcion>
          </View>
        </View>

        <View>
          <Paso>Seguridad</Paso>
          <View style={SOMBRA.alta} className="mt-4 overflow-hidden rounded-[24px] bg-white">
            <FilaOpcion icono={ICONOS.clave} titulo="Verificación en dos pasos" detalle="Código por SMS al iniciar sesión">
              <Interruptor valor={dosPasos} onCambio={setDosPasos} etiqueta="Verificación en dos pasos" />
            </FilaOpcion>
          </View>
          <View className="mt-4 gap-4">
            <Entrada label="Contraseña actual" value={actual} onChange={setActual} placeholder="••••••••" autoCapitalize="none" secreto />
            <Entrada label="Nueva contraseña" value={nueva} onChange={(v) => { setNueva(v); setCambiada(false); }} placeholder="Mínimo 8 caracteres" autoCapitalize="none" secreto />
            {nueva !== "" && <RequisitosContrasena valor={nueva} />}
            <BotonPill color="#3D4D18" disabled={actual === "" || !contrasenaValida(nueva)} onPress={() => { setActual(""); setNueva(""); setCambiada(true); }} className="w-full py-3.5" textClassName="text-[15px]" sinSombra>
              Cambiar contraseña
            </BotonPill>
            {cambiada && (
              <View accessibilityRole="alert" className="self-center rounded-full bg-success-100 px-4 py-1.5">
                <Texto className="text-[12px] font-semibold text-success-700">Contraseña actualizada</Texto>
              </View>
            )}
          </View>
        </View>

        <View>
          <Paso>Cuenta</Paso>
          <View style={SOMBRA.alta} className="mt-4 overflow-hidden rounded-[24px] bg-white">
            <Pressable accessibilityRole="link" onPress={() => router.push("/cuenta/direcciones")} className="active:bg-primary-400/10">
              <FilaOpcion icono={ICONOS.pin} titulo="Mis direcciones" detalle="Lugares de entrega y recogida">
                <Icono d={ICONOS.chevron} size={16} color="#B9C0CB" strokeWidth={1.6} />
              </FilaOpcion>
            </Pressable>
            <Pressable accessibilityRole="link" onPress={() => router.push("/cuenta/documentos")} className="active:bg-primary-400/10">
              <FilaOpcion icono={ICONOS.empresa} titulo="Mis documentos" detalle="Cédula, licencia, seguro y RNC">
                <Icono d={ICONOS.chevron} size={16} color="#B9C0CB" strokeWidth={1.6} />
              </FilaOpcion>
            </Pressable>
            <Pressable accessibilityRole="link" onPress={() => router.push("/cuenta/eliminar")} className="active:bg-error-50">
              <FilaOpcion icono={ICONOS.cerrar} titulo="Eliminar mi cuenta" detalle="Borra tus datos de BANEY de forma permanente">
                <Icono d={ICONOS.chevron} size={16} color="#B9C0CB" strokeWidth={1.6} />
              </FilaOpcion>
            </Pressable>
          </View>
        </View>

        <BotonPill color="#E9564F" variante="borde" textoColor="#E9564F" onPress={() => { cerrarSesion(); router.replace(SALIDA); }} className="w-full py-3.5" textClassName="text-[15px]" sinSombra>
          Cerrar sesión
        </BotonPill>
    </>
  );
}

// Perfil → Configuración: notificaciones y seguridad
export default function Configuracion() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo="Configuración" onVolver={() => router.back()} />
      <ScrollView contentContainerClassName="gap-7 px-5 py-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <ConfiguracionContenido />
      </ScrollView>
    </SafeAreaView>
  );
}
