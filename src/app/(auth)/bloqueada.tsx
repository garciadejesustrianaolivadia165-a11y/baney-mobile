import { Linking, Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import Button from "@/components/ui/button";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { MAX_INTENTOS } from "@/lib/sesion";

// UC-AUTH-11 · Bloqueo de cuenta: se llega tras agotar los intentos de inicio de
// sesión (o cuando la API devuelva "cuenta bloqueada" por decisión administrativa).
export default function CuentaBloqueada() {
  const router = useRouter();
  return (
    <View className="items-center gap-4">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-error-50">
        <Icono d={ICONOS.clave} size={36} color="#dc2626" strokeWidth={1.6} />
      </View>
      <Texto className="text-center font-sans text-2xl font-bold text-neutral-900">Cuenta bloqueada</Texto>
      <Texto className="text-center font-sans text-sm leading-relaxed text-neutral-600">
        Por seguridad bloqueamos el acceso después de {MAX_INTENTOS} intentos fallidos. Restablece tu contraseña para volver a entrar o espera 30 minutos.
      </Texto>

      <Button onPress={() => router.replace("/olvide")} className="w-56 py-2.5" textClassName="text-sm">
        Restablecer contraseña
      </Button>
      <Button variant="outline" onPress={() => Linking.openURL("mailto:soporte@baney.do?subject=Cuenta%20bloqueada")} className="w-56 py-2.5" textClassName="text-sm">
        Contactar soporte
      </Button>

      <Pressable accessibilityRole="link" onPress={() => router.replace("/login")}>
        <Texto className="font-sans text-sm font-semibold text-neutral-900">Volver al inicio de sesión</Texto>
      </Pressable>
    </View>
  );
}
