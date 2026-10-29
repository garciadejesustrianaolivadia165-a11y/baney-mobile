import { useState } from "react";
import { ScrollView, View, type LayoutChangeEvent } from "react-native";
import { Image } from "expo-image";

import FooterLanding from "@/components/footer-landing";
import Navbar from "@/components/navbar";
import Button from "@/components/ui/button";
import Texto from "@/components/ui/texto";
import { IMAGENES } from "@/lib/imagenes";

// 00 - Landing (home SIN login). "Cerrar Sección" navega aquí.
export default function Landing() {
  const [{ width, height }, setTamano] = useState({ width: 0, height: 0 });
  const ancha = width >= 1024;

  return (
    <View className="flex-1 bg-white" onLayout={(e: LayoutChangeEvent) => setTamano(e.nativeEvent.layout)}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero: campo de fondo + granjero con camiones a la derecha (solo en pantallas anchas) */}
        <View style={{ minHeight: height }} className="overflow-hidden bg-primary-100">
          <Image source={IMAGENES["/images/Fondo_login.jpg"]} contentFit="cover" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
          <View className="absolute inset-0 bg-white/15" />
          {ancha && (
            <Image
              source={IMAGENES["/images/granjero.png"]}
              accessibilityLabel="Productor BANEY usando la plataforma"
              contentFit="contain"
              contentPosition="bottom"
              style={{ position: "absolute", bottom: 0, right: "6%", height: "88%", width: "45%", zIndex: 10 }}
            />
          )}

          <View className="z-20 w-full px-8 pb-16 pt-36">
            <Texto className="max-w-2xl font-sans text-5xl font-bold leading-tight text-[#5F4829]">
              Vender, mover y cumplir el mercado dominicano a un clic
            </Texto>
            <Texto className="mt-7 max-w-xl font-sans text-lg text-neutral-800">
              Plataforma integral que virtualiza el mercado, conecta MIPYMES y productores con la demanda, optimiza logística y pagos, y simplifica la formalización fiscal.
            </Texto>
            <View className="mt-10 flex-row flex-wrap gap-6">
              <Button href="/login">Inicia Sección</Button>
              <Button href="/register" variant="soft">Regístrate gratis Aqui »</Button>
            </View>
          </View>
        </View>

        <FooterLanding />
      </ScrollView>

      <Navbar />
    </View>
  );
}
