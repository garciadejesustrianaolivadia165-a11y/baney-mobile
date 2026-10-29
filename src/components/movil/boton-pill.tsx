import type { StyleProp, ViewStyle } from "react-native";
import { useRouter, type Href } from "expo-router";
import Presionable from "@/components/ui/presionable";
import type { ReactNode } from "react";

import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";

type Props = {
  children: ReactNode | ((pressed: boolean) => ReactNode);
  /** Color de marca del botón (fondo en "lleno", borde/texto en "borde") */
  color: string;
  variante?: "lleno" | "borde";
  textoColor?: string;
  onPress?: () => void;
  /** Si se pasa, al pulsar navega a esa ruta */
  href?: Href;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
  sinSombra?: boolean;
};

// Botón redondeado del prototipo con el efecto de la web al pulsar:
// "lleno" invierte a fondo transparente + borde del color; "borde" se rellena.
export default function BotonPill({
  children,
  color,
  variante = "lleno",
  textoColor = "#ffffff",
  onPress,
  href,
  disabled,
  className = "",
  textClassName = "",
  style,
  sinSombra,
}: Props) {
  const router = useRouter();
  function colores(pressed: boolean) {
    if (disabled) return { fondo: "#D9DED2", borde: "#D9DED2", texto: "#8A93A2" };
    if (variante === "lleno") {
      return pressed
        ? { fondo: "transparent", borde: color, texto: color }
        : { fondo: color, borde: color, texto: textoColor };
    }
    return pressed
      ? { fondo: color, borde: color, texto: "#ffffff" }
      : { fondo: "#ffffff", borde: color, texto: textoColor === "#ffffff" ? "#16202E" : textoColor };
  }

  return (
    <Presionable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        onPress?.();
        if (href) router.push(href);
      }}
      estilo={(pressed) => {
        const c = colores(pressed);
        return [
          !sinSombra && !pressed && !disabled && SOMBRA.boton,
          { backgroundColor: c.fondo, borderColor: c.borde, borderWidth: 2 },
          pressed && !disabled && { transform: [{ scale: 0.97 }] },
          style,
        ];
      }}
      className={`items-center justify-center ${/\brounded-/.test(className) ? "" : "rounded-full"} ${className}`}
    >
      {(pressed) =>
        typeof children === "function" ? (
          children(pressed)
        ) : typeof children === "string" ? (
          <Texto style={{ color: colores(pressed).texto }} className={`font-bold ${textClassName}`}>
            {children}
          </Texto>
        ) : (
          children
        )
      }
    </Presionable>
  );
}
