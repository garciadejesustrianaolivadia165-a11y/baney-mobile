import { useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, PanResponder, Pressable, ScrollView, View, type LayoutChangeEvent } from "react-native";

import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";

const ALTURA_MIN = 96; // asa + fila del título

/**
 * Hoja inferior desplegable de las vistas de mapa: el mapa ocupa todo el fondo y
 * el panel blanco se arrastra (o se toca en el asa) para ocultarlo y ver solo el
 * mapa, o desplegarlo y ver la lista de camiones/clientes cercanos.
 */
export default function PanelDesplegable({
  fondo,
  titulo,
  accion,
  onAccion,
  children,
  fraccion = 0.56,
}: {
  /** Mapa y capas que van detrás del panel */
  fondo: ReactNode;
  titulo: string;
  accion?: string;
  onAccion?: () => void;
  children: ReactNode;
  /** Parte de la pantalla que ocupa el panel desplegado */
  fraccion?: number;
}) {
  const [abierto, setAbierto] = useState(true);
  const altura = useRef(new Animated.Value(ALTURA_MIN)).current;
  const alturaActual = useRef(ALTURA_MIN);
  const alturaMax = useRef(ALTURA_MIN);
  const inicio = useRef(ALTURA_MIN);

  function animar(abrir: boolean) {
    setAbierto(abrir);
    Animated.spring(altura, { toValue: abrir ? alturaMax.current : ALTURA_MIN, useNativeDriver: false, bounciness: 2 }).start();
  }

  function medir(e: LayoutChangeEvent) {
    const max = Math.max(ALTURA_MIN + 80, Math.round(e.nativeEvent.layout.height * fraccion));
    const primera = alturaMax.current === ALTURA_MIN;
    alturaMax.current = max;
    if (primera || abierto) altura.setValue(max);
  }

  // Animated.Value no expone su valor: se sigue con un listener para arrancar el arrastre donde está
  useEffect(() => {
    const id = altura.addListener(({ value }) => {
      alturaActual.current = value;
    });
    return () => altura.removeListener(id);
  }, [altura]);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        inicio.current = alturaActual.current;
      },
      onPanResponderMove: (_, g) => {
        altura.setValue(Math.min(alturaMax.current, Math.max(ALTURA_MIN, inicio.current - g.dy)));
      },
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dy) < 6) {
          // Toque en el asa: alterna
          animar(inicio.current < (ALTURA_MIN + alturaMax.current) / 2);
          return;
        }
        const final = inicio.current - g.dy;
        const abrir = g.vy < -0.3 || (g.vy <= 0.3 && final > (ALTURA_MIN + alturaMax.current) / 2);
        animar(abrir);
      },
    }),
  ).current;

  return (
    <View className="flex-1 bg-neutral-100" onLayout={medir}>
      <View className="absolute inset-0">{fondo}</View>

      <Animated.View style={[{ height: altura, position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 10, backgroundColor: "#ffffff", borderTopLeftRadius: 38, borderTopRightRadius: 38, overflow: "hidden" }, SOMBRA.panel]}>
        {/* Asa + título: zona de arrastre */}
        <View {...pan.panHandlers} className="px-5 pb-3 pt-3">
          <Pressable accessibilityRole="button" accessibilityLabel={abierto ? "Ocultar panel" : "Mostrar panel"} onPress={() => animar(!abierto)} hitSlop={10} className="items-center pb-3">
            <View className="h-1.5 w-14 rounded-full bg-[#E3E6E0]" />
          </Pressable>
          <View className="flex-row items-center justify-between">
            <Texto className="text-[19px] font-bold text-[#16202E]">{titulo}</Texto>
            {accion && (
              <Pressable accessibilityRole="button" onPress={onAccion ?? (() => animar(true))} className="active:scale-105">
                <Texto className="text-[14px] font-semibold text-[#4A5720]">{accion}</Texto>
              </Pressable>
            )}
          </View>
        </View>

        <ScrollView scrollEnabled={abierto} showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-6">
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
