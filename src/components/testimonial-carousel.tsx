import { useEffect, useRef, useState, type ComponentRef } from "react";
import { Pressable, ScrollView, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { Image } from "expo-image";

import Texto from "@/components/ui/texto";
import { imagen } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";

export type Testimonio = { img: string; texto: string; nombre: string; rol: string };

const SLIDE_MAX = 680;
const CLONES = 2;

// Carrusel de opiniones centrado: la tarjeta activa va en verde y las demás
// pequeñas y atenuadas. Infinito con clones, como en la web.
export default function TestimonialCarousel({ items }: { items: Testimonio[] }) {
  const [ancho, setAncho] = useState(0);
  const [index, setIndex] = useState(0);
  const [pausado, setPausado] = useState(false);
  const pista = useRef<ComponentRef<typeof ScrollView>>(null);
  const SLIDE_W = Math.min(SLIDE_MAX, Math.max(ancho - 32, 240));
  const estrecho = SLIDE_W < 520;
  const GAP = estrecho ? 16 : 32;
  const paso = SLIDE_W + GAP;
  const margen = Math.max(0, (ancho - SLIDE_W) / 2);

  const irA = (i: number, animado = true) => pista.current?.scrollTo({ x: i * paso, animated: animado });

  useEffect(() => {
    if (pausado || ancho === 0) return;
    const timer = setInterval(() => setIndex((i) => Math.min(i + 1, items.length)), 4000);
    return () => clearInterval(timer);
  }, [pausado, items.length, ancho]);

  useEffect(() => {
    if (ancho === 0) return;
    irA(index);
    if (index < items.length) return;
    const timer = setTimeout(() => {
      irA(0, false);
      setIndex(0);
    }, 720);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length, ancho]);

  function alSoltar(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setPausado(false);
    setIndex(Math.min(Math.round(e.nativeEvent.contentOffset.x / paso), items.length));
  }

  const pistaItems = [...items, ...items.slice(0, CLONES)];

  return (
    <View className="w-full py-6" onLayout={(e: LayoutChangeEvent) => setAncho(e.nativeEvent.layout.width)}>
      {ancho > 0 && (
        <ScrollView
          ref={pista}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={paso}
          decelerationRate="fast"
          onScrollBeginDrag={() => setPausado(true)}
          onMomentumScrollEnd={alSoltar}
          contentContainerStyle={{ gap: GAP, paddingHorizontal: margen, alignItems: "center" }}
        >
          {pistaItems.map((t, i) => {
            const activo = i === index;
            return (
              <Pressable
                key={`${t.nombre}-${i}`}
                accessibilityRole="button"
                disabled={activo}
                onPress={() => setIndex(i)}
                style={[{ width: SLIDE_W, transform: [{ scale: activo ? 1 : 0.9 }] }, activo ? SOMBRA.alta : SOMBRA.card]}
                className={`rounded-3xl ${estrecho ? "items-center gap-4 p-6" : "flex-row items-center gap-6 p-8"} ${activo ? "bg-secondary4-500" : "bg-secondary4-50 opacity-80"}`}
              >
                <Image source={imagen(t.img)} accessibilityLabel={t.nombre} contentFit="cover" style={estrecho ? { width: 80, height: 80, borderRadius: 40 } : { width: 128, height: 128, borderRadius: 64 }} />
                <View className="min-w-0 flex-1">
                  <Texto className={`font-sans text-sm leading-relaxed ${estrecho ? "text-center" : ""} ${activo ? "text-secondary-50" : "text-neutral-600"}`}>{t.texto}</Texto>
                  <Texto className={`mt-4 font-sans font-bold ${estrecho ? "text-center" : ""} ${activo ? "text-secondary-50" : "text-neutral-800"}`}>{t.nombre}</Texto>
                  <Texto className={`font-sans text-xs ${estrecho ? "text-center" : ""} ${activo ? "text-secondary-100" : "text-neutral-500"}`}>{t.rol}</Texto>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      <View className="mt-8 flex-row justify-center gap-2">
        {items.map((_, i) => (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={`Ver opinión ${i + 1}`}
            onPress={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full ${i === index % items.length ? "bg-secondary4-500" : "bg-neutral-300"}`}
          />
        ))}
      </View>
    </View>
  );
}
