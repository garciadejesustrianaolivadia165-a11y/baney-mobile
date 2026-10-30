import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import AppleButton from "@/components/ui/apple-button";
import Button from "@/components/ui/button";
import GoogleButton from "@/components/ui/google-button";
import InputField from "@/components/ui/input";
import Texto from "@/components/ui/texto";
import { usePreferencias } from "@/lib/preferencias";
import { desbloquear, destinoPorRol, intentoFallido, MAX_INTENTOS, useSesion } from "@/lib/sesion";

type LoginErrors = { nombre?: string; correo?: string; contrasena?: string };

/** Separador "OR" entre el formulario y los botones de Google */
export function SeparadorOr() {
  return (
    <View className="flex-row items-center gap-4">
      <View className="h-px flex-1 bg-neutral-200" />
      <Texto className="font-sans text-sm font-semibold text-neutral-400">OR</Texto>
      <View className="h-px flex-1 bg-neutral-200" />
    </View>
  );
}

export default function Login() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const { rol, bloqueada, intentos } = useSesion();
  const { dosPasos } = usePreferencias();
  const entrar = () => {
    desbloquear();
    router.replace(rol ? destinoPorRol() : "/home");
  };

  function enviar() {
    if (bloqueada) {
      router.replace("/bloqueada");
      return;
    }
    // Vista "Error de Acceso": los mensajes aparecen bajo cada campo inválido
    const next: LoginErrors = {};
    if (!nombre.trim()) next.nombre = "Nombre incorrecto";
    if (!/^\S+@\S+\.\S+$/.test(correo)) next.correo = "Correo electrónico incorrecto";
    if (contrasena.length < 6) next.contrasena = "Contraseña incorrecta";
    setErrors(next);

    if (Object.keys(next).length > 0) {
      // UC-AUTH-11: al agotar los intentos la cuenta queda bloqueada
      if (intentoFallido()) router.replace("/bloqueada");
      return;
    }
    // TODO: llamar a la API real; por ahora simula el acceso exitoso.
    // UC-AUTH-07: con verificación en dos pasos activa se pide el código antes de entrar.
    if (dosPasos) router.push({ pathname: "/codigo", params: { flujo: "login", correo } });
    else entrar();
  }

  const restantes = MAX_INTENTOS - intentos;

  return (
    <View className="gap-3">
      <Texto className="text-center font-sans text-2xl font-bold text-neutral-900">Inicio de Sección</Texto>

      <InputField label="Nombre" placeholder="Ingrese su nombre completo" value={nombre} onChange={setNombre} error={errors.nombre} />
      <InputField label="Correo Electrónico" type="email" placeholder="Ingrese su correo electrónico" value={correo} onChange={setCorreo} error={errors.correo} />
      <InputField label="Contraseña" type="password" placeholder="Ingrese su contraseña" value={contrasena} onChange={setContrasena} error={errors.contrasena} returnKeyType="go" onSubmitEditing={enviar} />

      <Pressable accessibilityRole="link" onPress={() => router.push("/olvide")} className="self-end">
        <Texto className="font-sans text-sm font-semibold text-primary-700">¿Olvidaste tu contraseña?</Texto>
      </Pressable>

      {intentos > 0 && restantes > 0 && (
        <Texto accessibilityRole="alert" className="text-center font-sans text-xs text-error-600">
          Te {restantes === 1 ? "queda" : "quedan"} {restantes} {restantes === 1 ? "intento" : "intentos"} antes de bloquear la cuenta.
        </Texto>
      )}

      <Button onPress={enviar} className="w-56 self-center py-2.5" textClassName="text-sm">
        Iniciar Sección
      </Button>

      <View className="flex-row justify-center">
        <Texto className="font-sans text-sm text-neutral-600">¿No tienes una cuenta? </Texto>
        <Pressable accessibilityRole="link" onPress={() => router.replace("/register")}>
          <Texto className="font-sans text-sm font-semibold text-neutral-900">Regístrate</Texto>
        </Pressable>
      </View>

      <SeparadorOr />

      <View className="flex-row flex-wrap justify-center gap-3">
        <GoogleButton label="Continuar con Google" onPress={entrar} />
        <AppleButton label="Continuar con Apple" onPress={entrar} />
      </View>
    </View>
  );
}
