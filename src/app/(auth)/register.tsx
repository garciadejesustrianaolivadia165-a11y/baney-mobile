import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import AppleButton from "@/components/ui/apple-button";
import Button from "@/components/ui/button";
import GoogleButton from "@/components/ui/google-button";
import InputField from "@/components/ui/input";
import Texto from "@/components/ui/texto";
import { SeparadorOr } from "./login";
import { actualizarPerfil, actualizarSesion, destinoPorRol, useSesion } from "@/lib/sesion";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: "", apellido: "", correo: "", cedula: "", telefono: "", contrasena: "" });
  const [errores, setErrores] = useState<Partial<typeof form>>({});
  const { rol } = useSesion();

  function setField(field: keyof typeof form) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  function enviar() {
    const e: Partial<typeof form> = {};
    if (!form.nombre.trim()) e.nombre = "Escribe tu nombre";
    if (!form.apellido.trim()) e.apellido = "Escribe tu apellido";
    if (!/^\S+@\S+\.\S+$/.test(form.correo)) e.correo = "Correo electrónico incorrecto";
    if (form.contrasena.length < 8) e.contrasena = "Mínimo 8 caracteres";
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    // TODO: llamar a la API real; por ahora simula el registro exitoso.
    // UC-AUTH-10: la cuenta queda pendiente hasta verificar el correo.
    actualizarPerfil({ nombres: form.nombre.trim(), apellidos: form.apellido.trim(), correo: form.correo.trim(), cedula: form.cedula.trim(), telefono: form.telefono.trim() });
    actualizarSesion({ correoPendiente: form.correo });
    router.replace({ pathname: "/verifica", params: { correo: form.correo } });
  }

  // Registro con Google/Apple: el proveedor ya verificó el correo, se pasa a completar el perfil
  const social = () => router.replace(rol ? "/cuenta/completar" : destinoPorRol());

  return (
    <View className="gap-3">
      <Texto className="text-center font-sans text-2xl font-bold text-neutral-900">Crea tu cuenta</Texto>

      <View className="flex-row gap-3">
        <InputField className="flex-1" label="Nombre" placeholder="Ingrese su nombre" value={form.nombre} onChange={setField("nombre")} error={errores.nombre} />
        <InputField className="flex-1" label="Apellido" placeholder="Ingrese su apellido" value={form.apellido} onChange={setField("apellido")} error={errores.apellido} />
      </View>

      <InputField label="Correo Electrónico" type="email" placeholder="Ingrese su correo electronico" value={form.correo} onChange={setField("correo")} error={errores.correo} />

      <View className="flex-row gap-3">
        <InputField className="flex-1" label="Cedula" placeholder="Ingrese su cedula" value={form.cedula} onChange={setField("cedula")} />
        <InputField className="flex-1" label="Numero Telefónico" type="number" placeholder="Ingrese su numero telefónico" value={form.telefono} onChange={setField("telefono")} />
      </View>

      <InputField label="Contraseña" type="password" placeholder="Ingrese su contraseña" value={form.contrasena} onChange={setField("contrasena")} error={errores.contrasena} returnKeyType="go" onSubmitEditing={enviar} />

      <Button onPress={enviar} className="w-56 self-center py-2.5" textClassName="text-sm">
        Registrarme
      </Button>

      <View className="flex-row justify-center">
        <Texto className="font-sans text-sm text-neutral-600">Ya tienes una cuenta? </Texto>
        <Pressable accessibilityRole="link" onPress={() => router.replace("/login")}>
          <Texto className="font-sans text-sm font-semibold text-neutral-900">Log in</Texto>
        </Pressable>
      </View>

      <SeparadorOr />

      <View className="flex-row flex-wrap justify-center gap-3">
        <GoogleButton label="Registrarme con Google" onPress={social} />
        <AppleButton label="Registrarme con Apple" onPress={social} />
      </View>
    </View>
  );
}
