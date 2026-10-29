import type { StyleProp, ViewStyle } from "react-native";
import Presionable from "@/components/ui/presionable";
import type { ReactNode } from "react";

import { SOMBRA } from "@/lib/estilos";

// Tarjeta seleccionable (tipo de carga, programación, unidad, condiciones, camión, horario):
// activa = borde secondary4-400 + fondo secondary4-50; inactiva = borde #EDEFEB + sombra.
export default function TarjetaSeleccion({
  activo,
  onPress,
  children,
  className = "",
  style,
  accessibilityLabel,
}: {
  activo: boolean;
  onPress: () => void;
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  return (
    <Presionable
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      estilo={(pressed) => [!activo && SOMBRA.suave, pressed && { transform: [{ translateY: -2 }] }, style]}
      className={`rounded-2xl border-2 ${activo ? "border-secondary4-400 bg-secondary4-50" : "border-[#EDEFEB] bg-white"} ${className}`}
    >
      {children}
    </Presionable>
  );
}

/** Colores de ícono/texto según el estado de la tarjeta */
export const TONO = { activo: "#3F4A20", inactivo: "#5D6B84" } as const;
