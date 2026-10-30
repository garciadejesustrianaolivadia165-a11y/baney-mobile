import { Pressable, Text } from "react-native";
import Svg, { Path } from "react-native-svg";

/** Botón "Continuar con Apple" (mismo tamaño y radio que GoogleButton; negro como pide Apple) */
export default function AppleButton({ label = "Sign up with Apple", className = "", onPress }: { label?: string; className?: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} className={`flex-row items-center gap-2 rounded-xl border border-black bg-black px-3 py-2 shadow-sm active:bg-neutral-800 ${className}`}>
      <Svg viewBox="0 0 24 24" width={20} height={20}>
        <Path fill="#fff" d="M16.37 12.73c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.61-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.75-.78-2.87-.76-1.48.02-2.84.86-3.6 2.18-1.54 2.67-.39 6.62 1.1 8.79.73 1.06 1.6 2.25 2.75 2.21 1.1-.04 1.52-.72 2.86-.72 1.33 0 1.71.72 2.88.7 1.19-.02 1.94-1.08 2.67-2.15.84-1.23 1.19-2.42 1.21-2.48-.03-.01-2.32-.89-2.37-3.53zM14.19 6.27c.6-.74 1.01-1.76.9-2.77-.87.04-1.93.58-2.55 1.31-.56.65-1.05 1.7-.92 2.7.97.08 1.96-.5 2.57-1.24z" />
      </Svg>
      <Text className="font-sans text-xs text-white">{label}</Text>
    </Pressable>
  );
}
