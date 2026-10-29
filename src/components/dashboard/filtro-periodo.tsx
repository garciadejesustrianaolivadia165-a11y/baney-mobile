import { useState } from "react";
import { Pressable, View } from "react-native";

import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";

export default function FiltroPeriodo({
  valor,
  onCambio,
  opciones = ["Semana", "Mes", "Año"],
}: {
  valor: string;
  onCambio: (v: string) => void;
  opciones?: string[];
}) {
  const [abierto, setAbierto] = useState(false);

  return (
    <View style={{ zIndex: abierto ? 40 : 1 }}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: abierto }} onPress={() => setAbierto((o) => !o)} className="flex-row items-center gap-1">
        <Texto className="text-xs font-medium text-neutral-600">{valor}</Texto>
        <View style={{ transform: [{ rotate: abierto ? "180deg" : "0deg" }] }}>
          <Icono d="M6 9l6 6 6-6" size={12} color="#696e64" strokeWidth={2} />
        </View>
      </Pressable>

      {abierto && (
        <View style={SOMBRA.alta} className="absolute right-0 top-6 w-28 rounded-xl bg-white py-1.5">
          {opciones.map((p) => (
            <Pressable
              key={p}
              accessibilityRole="button"
              onPress={() => {
                onCambio(p);
                setAbierto(false);
              }}
              className="px-4 py-1.5 active:bg-primary-400/10"
            >
              <Texto className={`text-xs ${valor === p ? "font-semibold text-primary-600" : "text-neutral-600"}`}>{p}</Texto>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// Factores compartidos para escalar los números según el período elegido
export const FACTORES_PERIODO: Record<string, number> = { Semana: 0.25, Mes: 1, Año: 12 };

export function formatearPeriodo(base: number, periodo: string) {
  return Math.round(base * (FACTORES_PERIODO[periodo] ?? 1)).toLocaleString("en-US");
}
