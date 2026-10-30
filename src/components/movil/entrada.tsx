import { useState } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";

/** Campo de texto del prototipo móvil (fondo #F1F4F2, borde lima al enfocar) */
export default function Entrada({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  keyboardType,
  className = "",
  autoCapitalize,
  secreto,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  className?: string;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  /** Oculta el texto (contraseñas) */
  secreto?: boolean;
}) {
  const [enfocado, setEnfocado] = useState(false);
  return (
    <View className={className}>
      {label && <Texto className="mb-2 text-[13px] text-[#8A93A2]">{label}</Texto>}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9AA69C"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secreto}
        onFocus={() => setEnfocado(true)}
        onBlur={() => setEnfocado(false)}
        className={`w-full rounded-2xl border-2 bg-[#F1F4F2] px-5 py-4 font-inter text-[15px] text-[#16202E] ${enfocado ? "border-secondary4-400" : "border-transparent"} ${multiline ? "min-h-[100px]" : ""}`}
      />
    </View>
  );
}

/** Título de sección numerada ("1. Tipo de vehículo"), como en Publicar disponibilidad */
export function Paso({ children }: { children: string }) {
  return <Texto className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#16202E]">{children}</Texto>;
}

/** Interruptor verde del prototipo */
export function Interruptor({ valor, onCambio, etiqueta }: { valor: boolean; onCambio: (v: boolean) => void; etiqueta: string }) {
  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: valor }} accessibilityLabel={etiqueta} onPress={() => onCambio(!valor)} className={`h-7 w-12 justify-center rounded-full p-1 ${valor ? "bg-[#4A5720]" : "bg-[#D6DAD2]"}`}>
      <View className={`h-5 w-5 rounded-full bg-white ${valor ? "self-end" : "self-start"}`} />
    </Pressable>
  );
}

/** Fila "ícono + título + descripción + interruptor" de Configuración */
export function FilaOpcion({ titulo, detalle, icono, children }: { titulo: string; detalle: string; icono: string; children: React.ReactNode }) {
  return (
    <View className="flex-row items-center gap-4 border-b border-[#EFF1ED] px-5 py-4">
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#F7F3E9]">
        <Icono d={icono} size={22} color="#6B6237" strokeWidth={1.7} />
      </View>
      <View className="min-w-0 flex-1">
        <Texto className="text-[15px] font-bold leading-tight text-[#16202E]">{titulo}</Texto>
        <Texto className="mt-1 text-[13px] text-[#6B7688]">{detalle}</Texto>
      </View>
      {children}
    </View>
  );
}
