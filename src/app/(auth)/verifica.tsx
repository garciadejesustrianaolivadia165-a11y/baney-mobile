import { Pressable, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import Reenviar from "@/components/auth/reenviar";
import Button from "@/components/ui/button";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { useSesion } from "@/lib/sesion";

// UC-AUTH-10 · Verificación de email: pantalla "Revisa tu correo" tras el registro.
// El enlace del correo abrirá baney://codigo?flujo=correo; aquí también se puede escribir el código.
export default function VerificaCorreo() {
  const router = useRouter();
  const { correoPendiente } = useSesion();
  const params = useLocalSearchParams<{ correo?: string }>();
  const correo = params.correo || correoPendiente;

  return (
    <View className="items-center gap-4">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-50">
        <Icono d={ICONOS.correo} size={36} color="#486440" strokeWidth={1.6} />
      </View>
      <Texto className="text-center font-sans text-2xl font-bold text-neutral-900">Revisa tu correo</Texto>
      <Texto className="text-center font-sans text-sm leading-relaxed text-neutral-600">
        Te enviamos un enlace y un código de 6 dígitos a{"\n"}
        <Texto className="font-sans text-sm font-semibold text-neutral-900">{correo || "tu correo"}</Texto>
        {"\n"}para confirmar que la cuenta es tuya.
      </Texto>

      <Button onPress={() => router.push({ pathname: "/codigo", params: { flujo: "correo", correo } })} className="w-56 py-2.5" textClassName="text-sm">
        Ingresar código
      </Button>

      <Reenviar etiqueta="Reenviar correo" />

      <View className="flex-row justify-center">
        <Texto className="font-sans text-sm text-neutral-600">¿Correo equivocado? </Texto>
        <Pressable accessibilityRole="link" onPress={() => router.replace("/register")}>
          <Texto className="font-sans text-sm font-semibold text-neutral-900">Cambiar correo</Texto>
        </Pressable>
      </View>
    </View>
  );
}
