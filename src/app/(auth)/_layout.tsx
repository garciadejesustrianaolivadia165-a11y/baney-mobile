import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View, type LayoutChangeEvent } from "react-native";
import { Image } from "expo-image";
import { Slot, useRouter } from "expo-router";

import Texto from "@/components/ui/texto";
import { IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";

// Port de routes/auth/layout.tsx: fondo de campo con velo, Navbar y tarjeta
// blanca con las manchas decorativas. El panel azul con el granjero solo
// aparece a partir de 1024 px de ancho (lg), igual que en la web.
export default function AuthLayout() {
  const router = useRouter();
  const [ancho, setAncho] = useState(0);
  const ancha = ancho >= 1024;

  return (
    <View className="flex-1 bg-primary-100" onLayout={(e: LayoutChangeEvent) => setAncho(e.nativeEvent.layout.width)}>
      <Image source={IMAGENES["/images/Fondo_login.jpg"]} contentFit="cover" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
      <View className="absolute inset-0 bg-white/50" />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="flex-grow items-center justify-center px-4 pb-10 pt-28" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={SOMBRA.alta} className={`w-full max-w-5xl overflow-hidden rounded-3xl bg-white ${ancha ? "min-h-[620px] flex-row" : ""}`}>
            {ancha && (
              <View className="relative w-1/2 overflow-hidden bg-caney-sky">
                <Image source={IMAGENES["/images/Image_login.png"]} contentFit="cover" contentPosition="bottom" style={{ position: "absolute", bottom: 0, left: 0, width: "115%", height: "60%" }} />
                <Image source={IMAGENES["/images/granjero.png"]} accessibilityLabel="Productor BANEY usando la plataforma" contentFit="contain" contentPosition="bottom" style={{ position: "absolute", bottom: 0, right: 64, width: "70%", height: "82%" }} />
                <Pressable accessibilityRole="link" onPress={() => router.push("/home")} className="absolute left-5 top-4">
                  <Image source={IMAGENES["/logos/Logo_Horizontal_baney_png.png"]} accessibilityLabel="BANEY" contentFit="contain" style={{ width: 120, height: 36 }} />
                </Pressable>
              </View>
            )}

            <View className={`relative overflow-hidden bg-white ${ancha ? "-ml-24 flex-1 rounded-l-3xl" : ""}`}>
              <Image pointerEvents="none" source={IMAGENES["/images/BlobsVector_01_login.png"]} contentFit="contain" contentPosition="top right" style={{ position: "absolute", right: 0, top: 0, width: 224, height: 224 }} />
              <Image pointerEvents="none" source={IMAGENES["/images/BlobsVector_02_login.png"]} contentFit="contain" contentPosition="bottom right" style={{ position: "absolute", right: 0, bottom: 8, width: 176, height: 176 }} />

              <View className="flex-1 justify-center px-8 py-8">
                <Slot />
                <Texto className="mt-6 text-center font-sans text-sm text-neutral-500">Derechos reservados BANEY RD</Texto>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Mobile: sin la cabecera pública de la web, solo el logotipo */}
      <View pointerEvents="none" className="absolute left-5 top-12">
        <Image source={IMAGENES["/logos/Logo_Horizontal_baney_png.png"]} accessibilityLabel="BANEY" contentFit="contain" style={{ width: 120, height: 36 }} />
      </View>
    </View>
  );
}
