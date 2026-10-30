import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import Button from "@/components/ui/button";
import InputField from "@/components/ui/input";
import Texto from "@/components/ui/texto";

// UC-AUTH-05 · Forgot password: se pide el correo y se envía un código de 6 dígitos.
export default function OlvideContrasena() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");

  function enviar() {
    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      setError("Correo electrónico incorrecto");
      return;
    }
    setError("");
    // TODO: POST /auth/forgot-password; por ahora pasa directo al código
    router.push({ pathname: "/codigo", params: { flujo: "reset", correo } });
  }

  return (
    <View className="gap-4">
      <Texto className="text-center font-sans text-2xl font-bold text-neutral-900">¿Olvidaste tu contraseña?</Texto>
      <Texto className="text-center font-sans text-sm leading-relaxed text-neutral-600">
        Escribe el correo con el que te registraste y te enviaremos un código para crear una contraseña nueva.
      </Texto>

      <InputField label="Correo Electrónico" type="email" placeholder="Ingrese su correo electrónico" value={correo} onChange={setCorreo} error={error} returnKeyType="send" onSubmitEditing={enviar} />

      <Button onPress={enviar} className="w-56 self-center py-2.5" textClassName="text-sm">
        Enviar código
      </Button>

      <View className="flex-row justify-center">
        <Texto className="font-sans text-sm text-neutral-600">¿La recordaste? </Texto>
        <Pressable accessibilityRole="link" onPress={() => router.replace("/login")}>
          <Texto className="font-sans text-sm font-semibold text-neutral-900">Iniciar sesión</Texto>
        </Pressable>
      </View>
    </View>
  );
}
