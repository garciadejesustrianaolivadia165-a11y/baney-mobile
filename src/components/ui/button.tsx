import { Pressable, Text, type ViewStyle } from "react-native";
import { useRouter, type Href } from "expo-router";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  /** Si se pasa, al pulsar navega a esa ruta (equivale al `to` de la web). */
  href?: Href;
  variant?: "primary" | "outline" | "soft";
  className?: string;
  textClassName?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

// Mismo contrato que components/ui/button.tsx de la web. En móvil no hay hover:
// el "clic con colores invertidos" se aplica al estado `pressed` del Pressable.
const variantes = {
  primary: {
    base: "bg-primary-600",
    pressed: "bg-transparent border-2 border-primary-800",
    texto: "text-secondary-50",
    textoPressed: "text-primary-800",
  },
  outline: {
    base: "border-2 border-primary-500 bg-white/70",
    pressed: "border-2 border-primary-600 bg-primary-600",
    texto: "text-primary-600",
    textoPressed: "text-white",
  },
  soft: {
    base: "bg-white/40",
    pressed: "bg-primary-600",
    texto: "text-neutral-900",
    textoPressed: "text-white",
  },
} as const;

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  textClassName = "",
  onPress,
  disabled,
  style,
}: ButtonProps) {
  const router = useRouter();
  const v = variantes[variant];

  function manejarPress() {
    onPress?.();
    if (href) router.push(href);
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={manejarPress}
      style={style}
      className={`flex-row items-center justify-center gap-2 rounded-full px-8 py-3 active:scale-95 ${className}`}
    >
      {({ pressed }) => (
        <>
          {/* Fondo/borde en una capa propia para que el borde del estado pulsado no mueva el contenido */}
          <Pressable
            pointerEvents="none"
            className={`absolute inset-0 rounded-full ${pressed ? v.pressed : v.base} ${disabled ? "opacity-50" : ""}`}
          />
          {typeof children === "string" ? (
            <Text className={`font-sans font-semibold ${pressed ? v.textoPressed : v.texto} ${textClassName}`}>
              {children}
            </Text>
          ) : (
            children
          )}
        </>
      )}
    </Pressable>
  );
}
