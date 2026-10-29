import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BotonPill from "@/components/movil/boton-pill";
import CabeceraVolver from "@/components/movil/cabecera-volver";
import Entrada, { FilaOpcion, Interruptor, Paso } from "@/components/movil/entrada";
import { ICONOS } from "@/components/ui/icono";
import { SOMBRA } from "@/lib/estilos";
import { cerrarSesion } from "@/lib/sesion";

/** Notificaciones y seguridad (lo comparten Perfil → Configuración y el menú del cliente) */
export function ConfiguracionContenido() {
  const router = useRouter();
  const [push, setPush] = useState(true);
  const [correo, setCorreo] = useState(true);
  const [ofertas, setOfertas] = useState(false);
  const [ubicacion, setUbicacion] = useState(true);
  const [dosPasos, setDosPasos] = useState(false);
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");

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
            <Entrada label="Contraseña actual" value={actual} onChange={setActual} placeholder="••••••••" autoCapitalize="none" />
            <Entrada label="Nueva contraseña" value={nueva} onChange={setNueva} placeholder="Mínimo 8 caracteres" autoCapitalize="none" />
            <BotonPill color="#3D4D18" disabled={actual === "" || nueva.length < 8} onPress={() => { setActual(""); setNueva(""); }} className="w-full py-3.5" textClassName="text-[15px]" sinSombra>
              Cambiar contraseña
            </BotonPill>
          </View>
        </View>

        <BotonPill color="#E9564F" variante="borde" textoColor="#E9564F" onPress={() => { cerrarSesion(); router.replace("/"); }} className="w-full py-3.5" textClassName="text-[15px]" sinSombra>
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
