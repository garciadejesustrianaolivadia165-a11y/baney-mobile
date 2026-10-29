import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

import Texto from "@/components/ui/texto";
import { IMAGENES } from "@/lib/imagenes";

// ============ VISTA 1: CARGA (splash) ============
// Pasa sola al onboarding a los 2,5 s, como en el prototipo web.
export default function Carga() {
  const router = useRouter();
  const { destino } = useLocalSearchParams<{ destino?: string }>();
  const giro = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(giro, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true }),
    );
    anim.start();
    const t = setTimeout(() => router.replace(destino === "login" ? "/login" : "/onboarding"), 2500);
    return () => {
      anim.stop();
      clearTimeout(t);
    };
  }, [giro, router, destino]);

  const rotate = giro.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View className="flex-1 items-center bg-caney-dark px-8">
      {/* Bloque central: hoja + BANEY + lema */}
      <View className="-mt-16 flex-1 items-center justify-center">
        <Image source={IMAGENES["/logos/Logotipo_BANEY.png"]} contentFit="contain" style={{ width: 128, height: 128 }} />
        <Image
          source={IMAGENES["/images/image_mobile/baney_white.png"]}
          accessibilityLabel="BANEY"
          contentFit="contain"
          style={{ width: 200, height: 64, marginTop: 24 }}
        />
        <Texto className="mt-5 text-[15px] text-neutral-300">Logística inteligente.</Texto>
      </View>

      {/* Spinner inferior */}
      <View className="items-center gap-3 pb-16">
        <Animated.View style={{ transform: [{ rotate }] }} accessibilityRole="progressbar" accessibilityLabel="Cargando">
          <Svg viewBox="0 0 56 56" width={44} height={44}>
            <Defs>
              <LinearGradient id="spin-m" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#6b4926" />
                <Stop offset="55%" stopColor="#cdaf86" />
                <Stop offset="100%" stopColor="#f5ede0" />
              </LinearGradient>
            </Defs>
            <Circle cx="28" cy="28" r="22" fill="none" stroke="url(#spin-m)" strokeWidth="6" strokeLinecap="round" strokeDasharray="104 34" />
          </Svg>
        </Animated.View>
        <Texto className="text-sm text-neutral-400">Cargando…</Texto>
      </View>
    </View>
  );
}
