import { useState } from "react";
import { Modal, Pressable, ScrollView, View, type LayoutChangeEvent } from "react-native";

import BotonPill from "@/components/movil/boton-pill";
import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import type { Rect } from "@/lib/guia";

export type PasoGuia = {
  titulo: string;
  texto: string;
  /** Lista de opciones explicadas (paso del menú lateral) */
  lista?: { icono: string; nombre: string; detalle: string }[];
};

const MARGEN = 8;

/**
 * Guía interactiva con foco: el fondo se oscurece con cuatro bloques alrededor
 * de la sección (`rect`, en coordenadas de ventana), que queda clara y con un
 * anillo verde como en la web. La tarjeta se coloca debajo del hueco o, si no
 * cabe, encima.
 */
export default function GuiaInteractiva({ pasos, paso, setPaso, rect }: { pasos: PasoGuia[]; paso: number; setPaso: (p: number | null) => void; rect: Rect | null }) {
  const info = pasos[paso];
  const [ventana, setVentana] = useState({ w: 0, h: 0 });
  const [altoTarjeta, setAltoTarjeta] = useState(0);
  const ultimo = paso >= pasos.length - 1;

  const hueco = rect ? { x: rect.x - MARGEN, y: rect.y - MARGEN, w: rect.w + MARGEN * 2, h: rect.h + MARGEN * 2 } : null;
  const espacioAbajo = hueco ? ventana.h - (hueco.y + hueco.h) : ventana.h;
  const abajo = !hueco || espacioAbajo >= altoTarjeta + 32 || hueco.y < altoTarjeta + 32;
  const topTarjeta = hueco ? (abajo ? Math.min(hueco.y + hueco.h + 16, ventana.h - altoTarjeta - 16) : Math.max(16, hueco.y - altoTarjeta - 16)) : ventana.h - altoTarjeta - 24;

  return (
    <Modal transparent animationType="fade" visible onRequestClose={() => setPaso(null)}>
      <View className="flex-1" onLayout={(e: LayoutChangeEvent) => setVentana({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
        {/* Oscurecido alrededor del hueco (o toda la pantalla si no hay sección que enfocar) */}
        {hueco && ventana.h > 0 ? (
          <>
            <Pressable accessibilityLabel="Cerrar guía" onPress={() => setPaso(null)} className="absolute left-0 right-0 top-0 bg-black/60" style={{ height: Math.max(0, hueco.y) }} />
            <Pressable accessibilityLabel="Cerrar guía" onPress={() => setPaso(null)} className="absolute left-0 right-0 bottom-0 bg-black/60" style={{ top: hueco.y + hueco.h }} />
            <Pressable accessibilityLabel="Cerrar guía" onPress={() => setPaso(null)} className="absolute left-0 bg-black/60" style={{ top: hueco.y, height: hueco.h, width: Math.max(0, hueco.x) }} />
            <Pressable accessibilityLabel="Cerrar guía" onPress={() => setPaso(null)} className="absolute right-0 bg-black/60" style={{ top: hueco.y, height: hueco.h, left: hueco.x + hueco.w }} />
            <View pointerEvents="none" className="absolute rounded-3xl border-4 border-primary-300" style={{ left: hueco.x, top: hueco.y, width: hueco.w, height: hueco.h }} />
          </>
        ) : (
          <Pressable accessibilityLabel="Cerrar guía" onPress={() => setPaso(null)} className="absolute inset-0 bg-black/60" />
        )}

        <View
          onLayout={(e: LayoutChangeEvent) => setAltoTarjeta(e.nativeEvent.layout.height)}
          style={[SOMBRA.alta, { top: Math.max(16, topTarjeta), maxHeight: ventana.h - 32, opacity: altoTarjeta ? 1 : 0 }]}
          className="absolute left-6 right-6 self-center rounded-2xl bg-white p-5"
        >
          <Texto className="font-sans text-base font-bold text-[#415936]">{info.titulo}</Texto>
          <Texto className="mt-2 text-sm leading-relaxed text-neutral-600">{info.texto}</Texto>
          {info.lista && (
            <ScrollView className="mt-3 max-h-72" showsVerticalScrollIndicator={false}>
              <View className="gap-2.5">
                {info.lista.map((o) => (
                  <View key={o.nombre} className="flex-row items-start gap-3">
                    <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-lg bg-[#F7F3E9]">
                      <Icono d={o.icono} size={16} color="#6B6237" strokeWidth={1.8} />
                    </View>
                    <View className="min-w-0 flex-1">
                      <Texto className="text-[13px] font-bold text-[#16202E]">{o.nombre}</Texto>
                      <Texto className="text-[12px] leading-snug text-neutral-500">{o.detalle}</Texto>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
          <View className="mt-4 flex-row items-center justify-between">
            <Texto className="text-xs font-medium text-neutral-400">Paso {paso + 1} de {pasos.length}</Texto>
            <View className="flex-row gap-2">
              {paso > 0 && (
                <BotonPill color="#bdc1b9" variante="borde" textoColor="#4d5148" onPress={() => setPaso(paso - 1)} className="px-4 py-1.5" textClassName="text-xs font-semibold" sinSombra>
                  Anterior
                </BotonPill>
              )}
              <BotonPill color="#364a2d" onPress={() => setPaso(ultimo ? null : paso + 1)} className="px-4 py-1.5" textClassName="text-xs font-semibold" sinSombra>
                {ultimo ? "Terminar" : "Siguiente"}
              </BotonPill>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
