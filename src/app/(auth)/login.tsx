import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import Button from "@/components/ui/button";
import GoogleButton from "@/components/ui/google-button";
import InputField from "@/components/ui/input";
import Texto from "@/components/ui/texto";

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

  function enviar() {
    // Vista "Error de Acceso": los mensajes aparecen bajo cada campo inválido
    const next: LoginErrors = {};
    if (!nombre.trim()) next.nombre = "Nombre incorrecto";
    if (!/^\S+@\S+\.\S+$/.test(correo)) next.correo = "Correo electrónico incorrecto";
    if (contrasena.length < 6) next.contrasena = "Contraseña incorrecta";
    setErrors(next);

    if (Object.keys(next).length === 0) {
      // TODO: llamar a la API real; por ahora simula el acceso exitoso
      router.replace("/home");
    }
  }

  return (
    <View className="gap-3">
      <Texto className="text-center font-sans text-2xl font-bold text-neutral-900">Inicio de Sección</Texto>

      <InputField label="Nombre" placeholder="Ingrese su nombre completo" value={nombre} onChange={setNombre} error={errors.nombre} />
      <InputField label="Correo Electrónico" type="email" placeholder="Ingrese su correo electrónico" value={correo} onChange={setCorreo} error={errors.correo} />
      <InputField label="Contraseña" type="password" placeholder="Ingrese su contraseña" value={contrasena} onChange={setContrasena} error={errors.contrasena} returnKeyType="go" onSubmitEditing={enviar} />

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

      <View className="flex-row justify-center gap-4">
        <GoogleButton />
        <GoogleButton />
      </View>
    </View>
  );
}
