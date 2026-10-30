import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import Texto from "@/components/ui/texto";

const ESPERA = 30;

/** "¿No te llegó? Reenviar (0:30)": el enlace se habilita cuando termina la cuenta atrás */
export default function Reenviar({ etiqueta = "Reenviar código", onReenviar }: { etiqueta?: string; onReenviar?: () => void }) {
  const [segundos, setSegundos] = useState(ESPERA);
  const [veces, setVeces] = useState(0);

  useEffect(() => {
    if (segundos === 0) return;
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundos]);

  function reenviar() {
    onReenviar?.();
    setVeces((v) => v + 1);
    setSegundos(ESPERA);
  }

  return (
    <View className="items-center gap-1">
      <View className="flex-row items-center">
        <Texto className="font-sans text-sm text-neutral-600">¿No te llegó? </Texto>
        {segundos > 0 ? (
          <Texto className="font-sans text-sm font-semibold text-neutral-400">{etiqueta} (0:{String(segundos).padStart(2, "0")})</Texto>
        ) : (
          <Pressable accessibilityRole="button" onPress={reenviar}>
            <Texto className="font-sans text-sm font-semibold text-primary-700">{etiqueta}</Texto>
          </Pressable>
        )}
      </View>
      {veces > 0 && <Texto accessibilityRole="alert" className="font-sans text-xs text-success-700">Enviado de nuevo ({veces})</Texto>}
    </View>
  );
}
