import { Pressable, Text } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function GoogleButton({
  label = "Sign up with Google",
  className = "",
  translucido = false,
  onPress,
}: {
  label?: string;
  className?: string;
  /** Fondo semitransparente (versión sobre la foto del campo) */
  translucido?: boolean;
  onPress?: () => void;
}) {
  const fondo = translucido
    ? "border-white/60 bg-white/70 active:bg-white/85"
    : "border-neutral-200 bg-white active:bg-neutral-50";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`flex-row items-center gap-2 rounded-xl border px-3 py-2 shadow-sm ${fondo} ${className}`}
    >
      <Svg viewBox="0 0 24 24" width={20} height={20}>
        <Path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
        />
        <Path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
        />
        <Path
          fill="#FBBC05"
          d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z"
        />
        <Path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 12 1 11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
        />
      </Svg>
      <Text className="font-sans text-xs text-neutral-700">{label}</Text>
    </Pressable>
  );
}
