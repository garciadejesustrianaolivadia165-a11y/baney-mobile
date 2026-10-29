import { useState } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";

/** Campo de formulario del dashboard: etiqueta gris + borde verde lima #9EAA31 */
export function Campo({
  label,
  value,
  onChange,
  placeholder,
  redondo = true,
  multiline,
  keyboardType,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  /** rounded-full (perfil) o rounded-2xl (productos) */
  redondo?: boolean;
  multiline?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  className?: string;
}) {
  const [enfocado, setEnfocado] = useState(false);
  return (
    <View className={className}>
      <Texto className="mb-2 text-sm text-[#3F443D]">{label}</Texto>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="rgba(65,89,54,0.5)"
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? "top" : "center"}
        keyboardType={keyboardType}
        onFocus={() => setEnfocado(true)}
        onBlur={() => setEnfocado(false)}
        className={`w-full border bg-white px-5 py-3.5 font-inter text-[15px] text-[#415936] ${redondo ? "rounded-full" : "rounded-2xl"} ${enfocado ? "border-primary-400" : "border-[#9EAA31]"} ${multiline ? "min-h-[88px]" : ""}`}
      />
    </View>
  );
}

/** Desplegable con borde verde lima (categoría, unidad, estado…) */
export function Desplegable({
  valor,
  opciones,
  onCambio,
  etiqueta,
  label,
  className = "",
}: {
  valor: string;
  opciones: readonly string[];
  onCambio: (v: string) => void;
  etiqueta: string;
  label?: string;
  className?: string;
}) {
  const [abierto, setAbierto] = useState(false);
  return (
    <View className={className} style={{ zIndex: abierto ? 30 : 1 }}>
      {label && <Texto className="mb-2 text-sm text-[#3F443D]">{label}</Texto>}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={etiqueta}
        accessibilityState={{ expanded: abierto }}
        onPress={() => setAbierto((a) => !a)}
        className={`w-full flex-row items-center justify-between gap-2 border border-[#9EAA31] bg-white px-4 py-3 ${label ? "rounded-2xl px-5" : "rounded-full"}`}
      >
        <Texto className="text-[13px] text-[#415936]" numberOfLines={1}>{valor}</Texto>
        <View style={{ transform: [{ rotate: abierto ? "180deg" : "0deg" }] }}>
          <Icono d="M6 9l6 6 6-6" size={16} color="#415936" strokeWidth={2} />
        </View>
      </Pressable>
      {abierto && (
        <View style={SOMBRA.alta} className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-primary-200 bg-white">
          {opciones.map((o) => (
            <Pressable
              key={o}
              accessibilityRole="button"
              onPress={() => {
                onCambio(o);
                setAbierto(false);
              }}
              className="px-4 py-2.5 active:bg-primary-50"
            >
              <Texto className={`text-[13px] ${valor === o ? "font-bold text-primary-600" : "text-[#3F443D]"}`}>{o}</Texto>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
