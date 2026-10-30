import { useState, type ReactNode } from "react";
import { Pressable, TextInput, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { C } from "@/lib/estilos";

/** Marcas de tarjeta que acompañan a cada medio de pago */
export function MarcasTarjeta() {
  return (
    <View className="flex-row items-center gap-2">
      <Svg viewBox="0 0 48 30" width={29} height={18}>
        <Circle cx="19" cy="15" r="9" fill="#EB001B" />
        <Circle cx="29" cy="15" r="9" fill="#F79E1B" />
        <Path d="M24 8.4a9 9 0 0 0 0 13.2 9 9 0 0 0 0-13.2z" fill="#FF5F00" />
      </Svg>
      <Texto className="text-[13px] font-bold italic tracking-tight text-[#1A1F71]">VISA</Texto>
      <View className="rounded-[3px] bg-[#2E77BC] px-1 py-[3px]">
        <Texto className="text-center text-[5px] font-bold leading-[6px] text-white">AMERICAN{"\n"}EXPRESS</Texto>
      </View>
    </View>
  );
}

export function LogoPayPal({ size = 17 }: { size?: number }) {
  return (
    <Texto className="font-bold italic" style={{ fontSize: size }}>
      <Texto className="font-bold italic text-[#003087]" style={{ fontSize: size }}>Pay</Texto>
      <Texto className="font-bold italic text-[#009CDE]" style={{ fontSize: size }}>Pal</Texto>
    </Texto>
  );
}

export type Resumen = { lineas: { t: string; v: string }[]; subtotal: string; /** Líneas entre el subtotal y el total (ITBIS, envío) */ despues?: { t: string; v: string }[]; total: string };

/** Desglose del transporte (paso 3 de Solicitar transporte) */
export const resumenTransporte = (material: string): Resumen => ({
  lineas: [
    { t: `Transporte de ${material.toLowerCase()}`, v: "RD$ 3,800.00" },
    { t: "Servicio de plataforma", v: "RD$ 450.00" },
    { t: "Seguro de carga", v: "RD$ 250.00" },
  ],
  subtotal: "RD$ 4,500.00",
  total: "RD$ 4,500.00",
});

/** Desglose "Información de pago" (mismo formato que la pasarela web); lo usan transporte y checkout */
export function ResumenPago({ material = "Materiales", resumen }: { material?: string; resumen?: Resumen }) {
  const { lineas, subtotal, despues = [], total } = resumen ?? resumenTransporte(material);
  return (
    <View className="mt-4 bg-[#FBF7FA] px-4 py-3">
      {lineas.map((l) => (
        <View key={l.t} className="flex-row items-center justify-between gap-4 py-2">
          <Texto className="flex-1 text-[13px] text-[#16202E]">{l.t}</Texto>
          <Texto className="text-[13px] text-[#16202E]">{l.v}</Texto>
        </View>
      ))}
      <View className="flex-row items-center justify-between border-t border-[#D8CFD4] py-2">
        <Texto className="text-[13px] text-[#16202E]">Subtotal</Texto>
        <Texto className="text-[13px] text-[#16202E]">{subtotal}</Texto>
      </View>
      {despues.map((l) => (
        <View key={l.t} className="flex-row items-center justify-between gap-4 py-2">
          <Texto className="flex-1 text-[13px] text-[#16202E]">{l.t}</Texto>
          <Texto className="text-[13px] text-[#16202E]">{l.v}</Texto>
        </View>
      ))}
      <View className="flex-row items-center justify-between border-t border-[#D8CFD4] py-2">
        <Texto className="text-[13px] font-bold text-[#16202E]">Total</Texto>
        <Texto className="text-[13px] font-bold text-[#16202E]">{total}</Texto>
      </View>
    </View>
  );
}

export function FilaDato({ k, v, fuerte }: { k: string; v: string; fuerte?: boolean }) {
  return (
    <View className="flex-row items-center justify-between gap-4 py-2">
      <Texto className={`text-[14px] ${fuerte ? "font-bold text-[#16202E]" : "text-[#6B7688]"}`}>{k}</Texto>
      <Texto className={`text-[14px] text-[#16202E] ${fuerte ? "font-bold" : ""}`}>{v}</Texto>
    </View>
  );
}

/** Entrada de la pasarela: texto, o lista desplegable si se pasan `opciones` */
export function EntradaPago({
  placeholder,
  tipo = "text",
  opciones,
  value,
  onChange,
  secreto,
}: {
  placeholder: string;
  tipo?: "text" | "tel" | "email" | "numero";
  opciones?: string[];
  value?: string;
  onChange?: (v: string) => void;
  secreto?: boolean;
}) {
  const [interno, setInterno] = useState("");
  const valor = value ?? interno;
  const setValor = (v: string) => {
    setInterno(v);
    onChange?.(v);
  };
  const [abierto, setAbierto] = useState(false);
  const [enfocado, setEnfocado] = useState(false);
  const borde = enfocado || abierto ? "border-secondary4-400" : "border-[#D6DAD2]";

  if (opciones) {
    return (
      <View style={{ zIndex: abierto ? 20 : 1 }}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setAbierto((a) => !a)}
          className={`w-full flex-row items-center justify-between rounded-full border bg-white px-5 py-3.5 ${borde}`}
        >
          <Texto className={`text-[14px] ${valor ? "text-[#16202E]" : "text-[#9AA3AF]"}`}>{valor || placeholder}</Texto>
          <Icono d="M6 9l6 6 6-6" size={16} color="#9AA3AF" strokeWidth={2} />
        </Pressable>
        {abierto && (
          <View className="mt-2 overflow-hidden rounded-2xl border border-[#EDEFEB] bg-white">
            {opciones.map((o) => (
              <Pressable
                key={o}
                accessibilityRole="button"
                onPress={() => {
                  setValor(o);
                  setAbierto(false);
                }}
                className="px-5 py-3 active:bg-primary-400/10"
              >
                <Texto className="text-[14px] text-[#16202E]">{o}</Texto>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  }
  return (
    <TextInput
      value={valor}
      onChangeText={setValor}
      placeholder={placeholder}
      placeholderTextColor="#9AA3AF"
      keyboardType={tipo === "tel" ? "phone-pad" : tipo === "email" ? "email-address" : tipo === "numero" ? "number-pad" : "default"}
      autoCapitalize={tipo === "email" || secreto ? "none" : "sentences"}
      secureTextEntry={secreto}
      onFocus={() => setEnfocado(true)}
      onBlur={() => setEnfocado(false)}
      className={`w-full rounded-full border bg-white px-5 py-3.5 font-inter text-[14px] text-[#16202E] ${borde}`}
    />
  );
}

export function BotonPago({ children, onPress }: { children: string; onPress: () => void }) {
  return (
    <BotonPill color={C.oliva} onPress={onPress} className="mt-5 w-full py-4" textClassName="text-[15px]">
      {children}
    </BotonPill>
  );
}

export function Casilla({ children }: { children: ReactNode }) {
  const [marcada, setMarcada] = useState(false);
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: marcada }}
      onPress={() => setMarcada((m) => !m)}
      className="mt-4 flex-row items-start gap-2.5"
    >
      <View className={`mt-0.5 h-4 w-4 items-center justify-center rounded-[3px] border ${marcada ? "border-[#4A5720] bg-[#4A5720]" : "border-[#8A93A2] bg-white"}`}>
        {marcada && <Icono d={ICONOS.check} size={12} color="#fff" strokeWidth={3} />}
      </View>
      <Texto className="flex-1 text-[12px] leading-relaxed text-[#6B7688]">{children}</Texto>
    </Pressable>
  );
}
