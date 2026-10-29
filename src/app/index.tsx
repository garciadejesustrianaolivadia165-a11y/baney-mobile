import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/button";
import GoogleButton from "@/components/ui/google-button";
import LoadingScreen from "@/components/loading-screen";
import { IMAGENES } from "@/lib/imagenes";
import { CATALOGO } from "@/lib/productos";

// Pantalla inicial provisional de la Fase 1: comprueba que fuentes, paleta,
// assets, datos y primitivas funcionan. La reemplazan las pantallas de la Fase 3
// (carga → onboarding → rol → auth), partidas desde routes/mobile.tsx de la web.
export default function Inicio() {
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setCargando(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (cargando) return <LoadingScreen />;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center gap-6 px-6">
        <Image
          source={IMAGENES["/logos/Logo_Horizontal_baney_png.png"]}
          contentFit="contain"
          accessibilityLabel="BANEY"
          style={{ width: 220, height: 72 }}
        />
        <Text className="text-center font-sans text-3xl font-bold text-primary-600">
          Vender, mover y cumplir
        </Text>
        <Text className="text-center font-sans text-base text-neutral-700">
          Marketplace agropecuario y de logística de República Dominicana.
        </Text>
        <Text className="font-inter text-sm text-secondary4-500">
          {CATALOGO.length} productos de ejemplo cargados
        </Text>

        <View className="mt-4 w-full gap-3">
          <Button>Iniciar sesión</Button>
          <Button variant="outline">Crear cuenta</Button>
          <GoogleButton label="Continuar con Google" className="self-center" />
        </View>
      </View>
    </SafeAreaView>
  );
}
