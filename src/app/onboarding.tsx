import { useRef, useState, type ComponentRef } from "react";
import { Pressable, ScrollView, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { C } from "@/lib/estilos";
import { IMAGENES } from "@/lib/imagenes";

const slides = [
  {
    img: IMAGENES["/images/image_mobile/Logística Inteligente.png"],
    titulo: "La Logística inteligente en RD",
    texto:
      "Optimizamos el transporte, gestion de productos y servicios, apertura al mercado y conectar con quienes te necesitan.",
  },
  {
    img: IMAGENES["/images/image_mobile/Para Productores.png"],
    titulo: "Para Productores",
    texto: "Optimiza tus viajes de retorno. Publica tu disponibilidad y nunca regreses con el camión vacío.",
  },
  {
    img: IMAGENES["/images/image_mobile/Para Clientes y Constructores.png"],
    titulo: "Para Clientes y Constructores",
    texto: "Solicita transporte de materiales en segundos. Encuentra camiones regresando vacíos y ahorra costos.",
  },
  {
    img: IMAGENES["/images/image_mobile/Para Transportistas.png"],
    titulo: "Para Transportistas",
    texto: "Optimiza tus viajes de retorno. Publica tu disponibilidad y nunca regreses con el camión vacío.",
  },
];

// ============ VISTA 2: ONBOARDING (carrusel) ============
export default function Onboarding() {
  const router = useRouter();
  // Tamaño real del área del carrusel (medido con onLayout: funciona igual en nativo y en el export web)
  const [{ width, height }, setTamano] = useState({ width: 0, height: 0 });
  const [slide, setSlide] = useState(0);
  const pista = useRef<ComponentRef<typeof ScrollView>>(null);
  const altoImagen = Math.min(470, Math.round(height * 0.68));
  const medir = (e: LayoutChangeEvent) => setTamano(e.nativeEvent.layout);

  function irA(i: number) {
    const destino = Math.max(0, Math.min(i, slides.length - 1));
    pista.current?.scrollTo({ x: destino * width, animated: true });
    setSlide(destino);
  }

  function alSoltar(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setSlide(Math.round(e.nativeEvent.contentOffset.x / width));
  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-white">
      {/* Mancha decorativa oficial (assets/images) */}
      <Image
        pointerEvents="none"
        source={IMAGENES["/images/BlobsVector_01_login.png"]}
        contentFit="contain"
        style={{ position: "absolute", top: -32, left: 118, width: 302, height: 302, zIndex: 20 }}
      />

      {/* Pista del carrusel: imagen + textos se desplazan juntos */}
      <View className="flex-1" onLayout={medir}>
        {width > 0 && (
        <ScrollView
          ref={pista}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={alSoltar}
          bounces={false}
          className="flex-1"
          contentContainerClassName="h-full"
        >
          {slides.map((s) => (
            <View key={s.titulo} style={{ width, height: "100%" }}>
              {/* Imagen a sangre con desvanecido hacia el fondo blanco */}
              <View style={{ height: altoImagen }} className="overflow-hidden rounded-b-[2.5rem]">
                <Image source={s.img} accessibilityLabel={s.titulo} contentFit="cover" style={{ width: "100%", height: "100%" }} />
                <LinearGradient
                  colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.85)", "#ffffff"]}
                  className="absolute inset-x-0 bottom-0 h-44"
                />
              </View>
              <View className="flex-1 items-center px-9 pt-14">
                <Texto className="text-center font-sans text-[26px] font-bold leading-tight text-caney-dark">{s.titulo}</Texto>
                <Texto className="mt-4 max-w-[16rem] text-center font-sans text-[13px] leading-relaxed text-caney-dark/55">{s.texto}</Texto>
              </View>
            </View>
          ))}
        </ScrollView>
        )}

        {/* Slicer: pastilla ancha = lámina activa */}
        <View style={{ top: altoImagen + 22 }} className="absolute inset-x-0 z-30 flex-row justify-center gap-2">
          {slides.map((_, i) => (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={`Lámina ${i + 1}`}
              accessibilityState={{ selected: i === slide }}
              onPress={() => irA(i)}
              className={`h-[7px] rounded-full bg-secondary4-600 ${i === slide ? "w-6" : "w-[7px] opacity-80"}`}
            />
          ))}
        </View>
      </View>

      {/* Botones */}
      <View className="z-30 flex-row items-center gap-4 px-8 pb-6 pt-2">
        {slide < slides.length - 1 ? (
          <>
            <Pressable accessibilityRole="button" onPress={() => router.replace("/rol")} className="active:scale-105">
              <Texto className="font-sans text-[15px] font-bold text-caney-dark">Omitir</Texto>
            </Pressable>
            <BotonPill color={C.olivaSuave} onPress={() => irA(slide + 1)} className="ml-auto flex-row gap-3 px-9 py-3.5">
              {(pressed) => (
                <View className="flex-row items-center gap-3">
                  <Texto className="font-sans text-[15px] font-medium" style={{ color: pressed ? C.olivaSuave : "#fff" }}>
                    Siguiente
                  </Texto>
                  <Icono d={ICONOS.flecha} size={16} color={pressed ? C.olivaSuave : "#fff"} strokeWidth={2} />
                </View>
              )}
            </BotonPill>
          </>
        ) : (
          <BotonPill color={C.olivaSuave} onPress={() => router.replace("/rol")} className="w-full px-9 py-3.5" textClassName="font-sans text-[15px] font-medium">
            Comenzar Ahora
          </BotonPill>
        )}
      </View>
    </SafeAreaView>
  );
}
