import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Image } from "expo-image";

import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";

export const LUGARES = [
  "Av. Abraham Lincoln, Santo Domingo",
  "Santo Domingo Este, Rep. Dom.",
  "Santiago de los Caballeros",
  "La Romana, Rep. Dom.",
  "Punta Cana, Rep. Dom.",
  "San Pedro de Macorís",
  "Haina, San Cristóbal",
  "Higüey, La Altagracia",
  "Puerto Plata, Rep. Dom.",
  "Baní, Peravia",
  "San Francisco de Macorís",
  "Bávaro, Verón",
];

/** Buscador de lugares con sugerencias filtradas mientras se escribe */
export default function BuscadorLugar({
  etiqueta,
  valor,
  onCambio,
  placeholder,
  icono,
}: {
  etiqueta: string;
  valor: string;
  onCambio: (v: string) => void;
  placeholder: string;
  icono: number;
}) {
  const [abierto, setAbierto] = useState(false);
  const filtro = valor.trim().toLowerCase();
  const sugerencias = LUGARES.filter((l) => l.toLowerCase().includes(filtro)).slice(0, 5);

  return (
    <View className="relative z-10" style={{ zIndex: abierto ? 30 : 1 }}>
      <Texto className="text-[11px] font-bold uppercase tracking-wide text-[#9AA3AF]">{etiqueta}</Texto>
      <View className="mt-2 flex-row items-center gap-3 rounded-2xl bg-[#F1F4F2] px-4 py-3.5">
        <Image source={icono} contentFit="contain" style={{ width: 20, height: 20 }} />
        <TextInput
          value={valor}
          placeholder={placeholder}
          placeholderTextColor="#9AA69C"
          onChangeText={(t) => {
            onCambio(t);
            setAbierto(true);
          }}
          onFocus={() => setAbierto(true)}
          onBlur={() => setTimeout(() => setAbierto(false), 150)}
          className="flex-1 font-inter text-[15px] text-[#16202E]"
          style={{ paddingVertical: 0 }}
        />
        {valor !== "" && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Borrar ${etiqueta.toLowerCase()}`}
            onPress={() => onCambio("")}
            hitSlop={8}
          >
            <Icono d={ICONOS.cerrar} size={14} color="#9AA3AF" strokeWidth={2} />
          </Pressable>
        )}
      </View>

      {abierto && sugerencias.length > 0 && (
        <View
          style={[SOMBRA.alta, { zIndex: 30 }]}
          className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-2xl border border-[#EDEFEB] bg-white"
        >
          {sugerencias.map((l) => (
            <Pressable
              key={l}
              accessibilityRole="button"
              onPress={() => {
                onCambio(l);
                setAbierto(false);
              }}
              className="flex-row items-center gap-3 px-4 py-3 active:bg-primary-400/10"
            >
              <Icono d={ICONOS.pin} size={14} color="#8B9A3A" relleno />
              <Texto className="text-[14px] text-[#16202E]">{l}</Texto>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
