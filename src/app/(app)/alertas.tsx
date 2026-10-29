import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";

const ETIQUETA = "M12.6 2H20a2 2 0 0 1 2 2v7.4a2 2 0 0 1-.6 1.4l-8.6 8.6a2 2 0 0 1-2.8 0l-7.4-7.4a2 2 0 0 1 0-2.8l8.6-8.6a2 2 0 0 1 1.4-.6zm4.9 3.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z";
const CHECK_CIRCULO = "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 14.3l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z";
const BURBUJA = "M12 3c5 0 9 3.4 9 7.6 0 4.2-4 7.6-9 7.6-.9 0-1.8-.1-2.6-.3L4 20l1.3-3.3C3.9 15.3 3 13.1 3 10.6 3 6.4 7 3 12 3z";

export function TarjetaAlerta({
  icono,
  fondoIcono,
  titulo,
  hora,
  texto,
  nueva,
  destacada,
  accion,
  italica,
}: {
  icono: React.ReactNode;
  fondoIcono: string;
  titulo: string;
  hora: string;
  texto: string;
  nueva?: boolean;
  destacada?: boolean;
  accion?: string;
  italica?: boolean;
}) {
  return (
    <View
      style={SOMBRA.card}
      className={`mt-3 rounded-2xl border p-5 ${destacada ? "border-[#F6D9D9] bg-[#FDF4F4]" : "border-[#EDEFEB] bg-white"}`}
    >
      <View className="flex-row items-start gap-3.5">
        <View className={`h-11 w-11 items-center justify-center rounded-xl ${fondoIcono}`}>{icono}</View>
        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <Texto className="flex-1 text-[17px] font-bold leading-tight text-[#16202E]">{titulo}</Texto>
            <View className="flex-row items-center gap-1 pt-0.5">
              <Texto className="text-[12px] text-[#8A93A2]">{hora}</Texto>
              {nueva && <View className="h-2 w-2 rounded-full bg-error-500" />}
            </View>
          </View>
          <Texto className={`mt-1.5 text-[14px] leading-relaxed text-[#6B7688] ${italica ? "italic" : ""}`}>{texto}</Texto>
          {accion && (
            <Pressable accessibilityRole="button" className="mt-3 flex-row items-center gap-1 self-start active:scale-105">
              <Texto className="text-[14px] font-semibold text-[#4A5720]">{accion}</Texto>
              <Icono d={ICONOS.chevron} size={14} color="#4A5720" strokeWidth={2} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

/** Lista de notificaciones (la comparten la pestaña Alertas y la campanita del cliente) */
export function ListaAlertas() {
  return (
    <>

        <Texto className="px-1 pt-6 text-[12px] font-bold uppercase tracking-[0.08em] text-[#9AA3AF]">Hoy</Texto>
        <TarjetaAlerta
          destacada
          nueva
          fondoIcono="bg-error-100"
          icono={<Icono d={ETIQUETA} size={20} color="#ef4444" relleno />}
          titulo="¡Nueva oportunidad!"
          hora="10:45 AM"
          texto="Hay 5 camiones regresando vacíos de La Romana. Solicita ahora y ahorra un 20%."
        />
        <TarjetaAlerta
          fondoIcono="bg-success-100"
          icono={<Icono d={CHECK_CIRCULO} size={20} color="#059669" relleno />}
          titulo="Viaje Completado"
          hora="09:12 AM"
          texto="Tu pedido #TR-882190 ha sido entregado exitosamente por José Rodríguez."
          accion="Calificar servicio"
        />

        <Texto className="px-1 pt-7 text-[12px] font-bold uppercase tracking-[0.08em] text-[#9AA3AF]">Ayer</Texto>
        <TarjetaAlerta
          fondoIcono="bg-warning-200"
          icono={<Icono d={BURBUJA} size={20} color="#92400e" relleno />}
          titulo="Mensaje de José R."
          hora="Ayer, 04:30 PM"
          texto={'"Ya llegué al punto de descarga, estoy esperando al encargado."'}
          italica
        />
        <TarjetaAlerta
          fondoIcono="bg-neutral-100"
          icono={<Icono d={ICONOS.ajustes} circulos={[[12, 12, 3]]} size={20} color="#696e64" />}
          titulo="Perfil verificado"
          hora="Ayer, 02:15 PM"
          texto="Tu cuenta ha sido verificada satisfactoriamente. ¡Bienvenido a Match Truck!"
        />
    </>
  );
}

// ============ VISTA 11: NOTIFICACIONES ============
export default function Alertas() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FBFBFA]">
      <ScrollView contentContainerClassName="px-4 pb-4 pt-8" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-1">
          <Texto className="text-[28px] font-bold text-[#16202E]">Notificaciones</Texto>
          <Pressable accessibilityRole="button" className="active:scale-105">
            <Texto className="text-[14px] font-semibold text-[#4A5720]">Marcar leídas</Texto>
          </Pressable>
        </View>
        <ListaAlertas />
      </ScrollView>
    </SafeAreaView>
  );
}
