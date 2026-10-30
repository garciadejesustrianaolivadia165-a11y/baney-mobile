import { useRef, useState, type ComponentRef } from "react";
import { Pressable, TextInput, View } from "react-native";

import Texto from "@/components/ui/texto";

export const LARGO_CODIGO = 6;

/**
 * Seis casillas para el código de verificación. Un solo TextInput invisible
 * recibe el teclado (así el pegado y el autocompletado de SMS funcionan) y
 * las casillas solo pintan cada dígito.
 */
export default function EntradaCodigo({ valor, onCambio, error }: { valor: string; onCambio: (v: string) => void; error?: string }) {
  const ref = useRef<ComponentRef<typeof TextInput>>(null);
  const [enfocado, setEnfocado] = useState(false);
  const digitos = valor.padEnd(LARGO_CODIGO, " ").split("").slice(0, LARGO_CODIGO);

  return (
    <View className="items-center">
      <Pressable accessibilityRole="button" accessibilityLabel="Código de verificación" onPress={() => ref.current?.focus()} className="flex-row gap-2.5">
        {digitos.map((d, i) => {
          const activa = enfocado && (i === valor.length || (valor.length === LARGO_CODIGO && i === LARGO_CODIGO - 1));
          const borde = error ? "border-error-400" : activa ? "border-primary-500" : d.trim() ? "border-[#9EAA31]" : "border-transparent";
          return (
            <View key={i} className={`h-14 w-11 items-center justify-center rounded-xl border-2 bg-neutral-100 ${borde}`}>
              <Texto className="font-sans text-2xl font-bold text-neutral-900">{d.trim()}</Texto>
            </View>
          );
        })}
      </Pressable>
      <TextInput
        ref={ref}
        value={valor}
        onChangeText={(t) => onCambio(t.replace(/\D/g, "").slice(0, LARGO_CODIGO))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={LARGO_CODIGO}
        onFocus={() => setEnfocado(true)}
        onBlur={() => setEnfocado(false)}
        accessibilityLabel="Escribe el código de 6 dígitos"
        style={{ position: "absolute", opacity: 0, height: 56, width: "100%" }}
      />
      {error ? <Texto accessibilityRole="alert" className="mt-3 font-sans text-sm text-error-600">{error}</Texto> : null}
    </View>
  );
}
