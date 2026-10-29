import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { Image } from "expo-image";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

import { IMAGENES } from "@/lib/imagenes";

// Port de components/loading-screen.tsx: fondo caney-dark, logotipo blanco y el
// anillo degradado con punta redondeada (Component 1 del Figma) girando.
export default function LoadingScreen() {
  const giro = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(giro, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true }),
    );
    anim.start();
    return () => anim.stop();
  }, [giro]);

  const rotate = giro.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View className="absolute inset-0 z-50 items-center justify-center gap-10 bg-caney-dark">
      <Image
        source={IMAGENES["/images/image_mobile/baney_white.png"]}
        accessibilityLabel="BANEY"
        contentFit="contain"
        style={{ width: 144, height: 144 }}
      />
      <Animated.View style={{ transform: [{ rotate }] }} accessibilityRole="progressbar" accessibilityLabel="Cargando">
        <Svg viewBox="0 0 56 56" width={64} height={64}>
          <Defs>
            <LinearGradient id="spinner-baney" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#6b4926" />
              <Stop offset="55%" stopColor="#cdaf86" />
              <Stop offset="100%" stopColor="#f5ede0" />
            </LinearGradient>
          </Defs>
          <Circle
            cx="28"
            cy="28"
            r="22"
            fill="none"
            stroke="url(#spinner-baney)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="104 34"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
