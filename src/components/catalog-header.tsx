import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { CATEGORIAS } from "@/lib/productos";

/** Barra de áreas del marketplace (pastilla con divisores verdes + menú) */
export function BarraCategorias({ activa, onCambio }: { activa: string; onCambio: (c: string) => void }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <View style={{ zIndex: abierto ? 30 : 1 }}>
      <View className="flex-row items-stretch overflow-hidden rounded-[2rem] border border-primary-400">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1" contentContainerClassName="items-stretch">
          {CATEGORIAS.map((c, i) => (
            <Pressable
              key={c}
              accessibilityRole="button"
              accessibilityState={{ selected: activa === c }}
              onPress={() => onCambio(c)}
              className={`justify-center px-4 py-3.5 ${i > 0 ? "border-l border-primary-400" : ""} ${activa === c ? "bg-primary-50" : "active:bg-primary-50"}`}
            >
              <Texto className={`font-sans text-sm ${activa === c ? "font-bold text-primary-600" : "font-medium text-primary-500"}`}>{c}</Texto>
            </Pressable>
          ))}
        </ScrollView>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Más áreas"
          accessibilityState={{ expanded: abierto }}
          onPress={() => setAbierto((a) => !a)}
          className="w-14 items-center justify-center border-l border-primary-400 active:bg-primary-50"
        >
          <Icono d="M4 7h16M4 12h16M4 17h16" size={20} color="#364a2d" strokeWidth={2} />
        </Pressable>
      </View>

      {abierto && (
        <View style={SOMBRA.alta} className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-primary-200 bg-white">
          {["Lácteos", "Carnes y Reces", "Apicultura", "Veterinaria"].map((c) => (
            <Pressable
              key={c}
              accessibilityRole="button"
              onPress={() => {
                onCambio(c);
                setAbierto(false);
              }}
              className="px-5 py-3 active:bg-primary-50"
            >
              <Texto className="font-sans text-sm font-medium text-primary-600">{c}</Texto>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

/** Título + interruptor de temporada + desplegable de filtro */
export function EncabezadoCatalogo({
  temporada,
  onTemporada,
  filtro,
  onFiltro,
}: {
  temporada: boolean;
  onTemporada: (v: boolean) => void;
  filtro: string;
  onFiltro: (v: string) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const opciones = ["Filtrar Por", "Menor precio", "Mayor precio", "Mejor valorados"];

  return (
    <View style={{ zIndex: abierto ? 20 : 0 }}>
      <Texto className="mt-8 font-sans text-2xl font-bold text-neutral-900">Catalogo de Productos BANEY</Texto>

      <View className="mt-5 flex-row flex-wrap items-center gap-5">
        <View className="flex-row items-center gap-3">
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: temporada }}
            accessibilityLabel="Productos de temporada"
            onPress={() => onTemporada(!temporada)}
            className={`h-7 w-14 justify-center rounded-full p-1 ${temporada ? "bg-primary-600" : "bg-primary-100"}`}
          >
            <View style={SOMBRA.suave} className={`h-5 w-5 rounded-full bg-primary-700 ${temporada ? "self-end" : "self-start"}`} />
          </Pressable>
          <Texto className="font-sans text-sm text-neutral-800">Productos de temporada</Texto>
        </View>

        <View>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: abierto }}
            onPress={() => setAbierto((a) => !a)}
            className="w-56 flex-row items-center justify-between gap-3 rounded-full border border-primary-400 px-6 py-3 active:scale-105"
          >
            <Texto className="font-sans text-sm font-medium text-neutral-800">{filtro}</Texto>
            <View style={{ transform: [{ rotate: abierto ? "180deg" : "0deg" }] }}>
              <Icono d="M6 9l6 6 6-6" size={16} color="#343730" strokeWidth={2} />
            </View>
          </Pressable>
          {abierto && (
            <View style={SOMBRA.alta} className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-primary-200 bg-white">
              {opciones.map((o) => (
                <Pressable
                  key={o}
                  accessibilityRole="button"
                  onPress={() => {
                    onFiltro(o);
                    setAbierto(false);
                  }}
                  className="px-5 py-3 active:bg-primary-50"
                >
                  <Texto className={`font-sans text-sm ${filtro === o ? "font-bold text-primary-600" : "text-neutral-700"}`}>{o}</Texto>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export { ICONOS };
