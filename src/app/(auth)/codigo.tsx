import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import EntradaCodigo, { LARGO_CODIGO } from "@/components/auth/entrada-codigo";
import Reenviar from "@/components/auth/reenviar";
import Button from "@/components/ui/button";
import Texto from "@/components/ui/texto";
import { actualizarSesion, desbloquear, destinoPorRol } from "@/lib/sesion";

export type FlujoCodigo = "reset" | "correo" | "login";

const TEXTOS: Record<FlujoCodigo, { titulo: string; detalle: string; boton: string }> = {
  reset: { titulo: "Código de recuperación", detalle: "Enviamos un código de 6 dígitos a", boton: "Continuar" },
  correo: { titulo: "Verifica tu correo", detalle: "Escribe el código de 6 dígitos que enviamos a", boton: "Verificar correo" },
  login: { titulo: "Verificación en dos pasos", detalle: "Por tu seguridad enviamos un código por SMS y a", boton: "Entrar" },
};

// UC-AUTH-07 · OTP: una sola pantalla para recuperación (reset), verificación de
// correo tras el registro (correo) y segundo factor al iniciar sesión (login).
export default function Codigo() {
  const router = useRouter();
  const { flujo = "reset", correo = "" } = useLocalSearchParams<{ flujo?: FlujoCodigo; correo?: string }>();
  const t = TEXTOS[flujo] ?? TEXTOS.reset;
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [comprobando, setComprobando] = useState(false);

  function confirmar() {
    if (codigo.length < LARGO_CODIGO) {
      setError("Escribe los 6 dígitos del código");
      return;
    }
    setComprobando(true);
    // TODO: POST /auth/verify-otp. Simulación: "000000" es un código incorrecto.
    setTimeout(() => {
      setComprobando(false);
      if (codigo === "000000") {
        setError("Código incorrecto o vencido. Pide uno nuevo.");
        setCodigo("");
        return;
      }
      if (flujo === "reset") router.replace("/restablecer");
      else if (flujo === "correo") {
        actualizarSesion({ correoPendiente: "" });
        router.replace("/cuenta/completar");
      } else {
        desbloquear();
        router.replace(destinoPorRol());
      }
    }, 600);
  }

  // Al completar las 6 casillas se comprueba solo
  useEffect(() => {
    if (codigo.length === LARGO_CODIGO && !comprobando) confirmar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo]);

  return (
    <View className="gap-5">
      <Texto className="text-center font-sans text-2xl font-bold text-neutral-900">{t.titulo}</Texto>
      <Texto className="text-center font-sans text-sm leading-relaxed text-neutral-600">
        {t.detalle}
        {"\n"}
        <Texto className="font-sans text-sm font-semibold text-neutral-900">{correo || "tu correo"}</Texto>
      </Texto>

      <EntradaCodigo valor={codigo} onCambio={(v) => { setCodigo(v); setError(""); }} error={error} />

      <Button onPress={confirmar} disabled={comprobando} className="w-56 self-center py-2.5" textClassName="text-sm">
        {comprobando ? "Comprobando…" : t.boton}
      </Button>

      <Reenviar />

      <Pressable accessibilityRole="link" onPress={() => router.back()} className="self-center">
        <Texto className="font-sans text-sm font-semibold text-neutral-900">{flujo === "login" ? "Usar otra cuenta" : "Cambiar correo"}</Texto>
      </Pressable>
    </View>
  );
}
