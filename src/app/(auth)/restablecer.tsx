import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";

import Button from "@/components/ui/button";
import Icono, { ICONOS } from "@/components/ui/icono";
import InputField from "@/components/ui/input";
import Texto from "@/components/ui/texto";
import { desbloquear } from "@/lib/sesion";

export const REQUISITOS: { texto: string; cumple: (p: string) => boolean }[] = [
  { texto: "Mínimo 8 caracteres", cumple: (p) => p.length >= 8 },
  { texto: "Una letra mayúscula", cumple: (p) => /[A-ZÁÉÍÓÚÑ]/.test(p) },
  { texto: "Un número", cumple: (p) => /\d/.test(p) },
];

/** Lista de requisitos con su check (la comparten Restablecer y Cambiar contraseña) */
export function RequisitosContrasena({ valor }: { valor: string }) {
  return (
    <View className="gap-1.5">
      {REQUISITOS.map((r) => {
        const ok = r.cumple(valor);
        return (
          <View key={r.texto} className="flex-row items-center gap-2">
            <View className={`h-4 w-4 items-center justify-center rounded-full ${ok ? "bg-success-500" : "bg-neutral-200"}`}>
              {ok && <Icono d={ICONOS.check} size={10} color="#fff" strokeWidth={3} />}
            </View>
            <Texto className={`font-sans text-xs ${ok ? "text-success-700" : "text-neutral-500"}`}>{r.texto}</Texto>
          </View>
        );
      })}
    </View>
  );
}

export const contrasenaValida = (p: string) => REQUISITOS.every((r) => r.cumple(p));

// UC-AUTH-06 · Reset password: nueva contraseña tras validar el código de recuperación.
export default function Restablecer() {
  const router = useRouter();
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [lista, setLista] = useState(false);

  function guardar() {
    if (!contrasenaValida(nueva)) {
      setError("La contraseña no cumple los requisitos");
      return;
    }
    if (nueva !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }
    // TODO: POST /auth/reset-password
    desbloquear();
    setLista(true);
  }

  if (lista) {
    return (
      <View className="items-center gap-4">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-success-100">
          <Icono d={ICONOS.check} size={36} color="#15803d" strokeWidth={2.5} />
        </View>
        <Texto className="text-center font-sans text-2xl font-bold text-neutral-900">Contraseña actualizada</Texto>
        <Texto className="text-center font-sans text-sm leading-relaxed text-neutral-600">Ya puedes iniciar sesión con tu nueva contraseña.</Texto>
        <Button onPress={() => router.replace("/login")} className="w-56 py-2.5" textClassName="text-sm">
          Iniciar sesión
        </Button>
      </View>
    );
  }

  return (
    <View className="gap-4">
      <Texto className="text-center font-sans text-2xl font-bold text-neutral-900">Nueva contraseña</Texto>
      <Texto className="text-center font-sans text-sm leading-relaxed text-neutral-600">Crea una contraseña que no hayas usado antes en BANEY.</Texto>

      <InputField label="Nueva contraseña" type="password" placeholder="Ingrese su nueva contraseña" value={nueva} onChange={(v) => { setNueva(v); setError(""); }} />
      <RequisitosContrasena valor={nueva} />
      <InputField label="Confirmar contraseña" type="password" placeholder="Repita la contraseña" value={confirmar} onChange={(v) => { setConfirmar(v); setError(""); }} error={error} returnKeyType="go" onSubmitEditing={guardar} />

      <Button onPress={guardar} disabled={!contrasenaValida(nueva) || confirmar === ""} className="w-56 self-center py-2.5" textClassName="text-sm">
        Guardar contraseña
      </Button>
    </View>
  );
}
