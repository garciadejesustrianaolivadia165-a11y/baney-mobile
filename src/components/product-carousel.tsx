import { useEffect, useRef, useState, type ComponentRef } from "react";
import { Pressable, ScrollView, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";

import ProductCard from "@/components/product-card";
import type { Product } from "@/types/product";

const CARD_MAX = 320; // w-80
const GAP = 24; // gap-6
const CLONES = 5; // tarjetas del inicio repetidas al final para el bucle sin salto

// Carrusel infinito: clones al final y salto silencioso al inicio real.
// Avanza cada 3,5 s; se pausa mientras el usuario arrastra.
export default function ProductCarousel({ items }: { items: Product[] }) {
  const [ancho, setAncho] = useState(0);
  const [index, setIndex] = useState(0);
  const [pausado, setPausado] = useState(false);
  const pista = useRef<ComponentRef<typeof ScrollView>>(null);
  const cardW = Math.min(CARD_MAX, Math.max(ancho - 64, 200));
  const PASO = cardW + GAP;

  const irA = (i: number, animado = true) => pista.current?.scrollTo({ x: i * PASO, animated: animado });

  useEffect(() => {
    if (pausado || ancho === 0) return;
    const timer = setInterval(() => setIndex((i) => Math.min(i + 1, items.length)), 3500);
    return () => clearInterval(timer);
  }, [pausado, items.length, ancho]);

  // Desplaza la pista al cambiar el índice; al llegar al clon de la primera
  // tarjeta, salta sin animación al inicio real justo después de la transición
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
    setIndex(Math.min(Math.round(e.nativeEvent.contentOffset.x / PASO), items.length));
  }

  const pistaItems = [...items, ...items.slice(0, CLONES)];

  return (
    <View onLayout={(e: LayoutChangeEvent) => setAncho(e.nativeEvent.layout.width)}>
      {ancho > 0 && (
        <ScrollView
          ref={pista}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={PASO}
          decelerationRate="fast"
          onScrollBeginDrag={() => setPausado(true)}
          onMomentumScrollEnd={alSoltar}
          contentContainerStyle={{ gap: GAP, paddingVertical: 8 }}
          className="mt-6 pb-4"
        >
          {pistaItems.map((p, i) => (
            <View key={`${p.id}-${i}`} style={{ width: cardW }}>
              <ProductCard product={p} />
            </View>
          ))}
        </ScrollView>
      )}

      {/* Puntos clicables */}
      <View className="mt-4 flex-row justify-center gap-2">
        {items.map((_, i) => (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={`Ir al producto ${i + 1}`}
            onPress={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full ${i === index % items.length ? "bg-secondary4-500" : "bg-neutral-300"}`}
          />
        ))}
      </View>
    </View>
  );
}
