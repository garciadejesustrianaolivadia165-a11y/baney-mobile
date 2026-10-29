import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BotonPill from "@/components/movil/boton-pill";
import CabeceraVolver from "@/components/movil/cabecera-volver";
import Entrada, { Paso } from "@/components/movil/entrada";
import { Casilla, LogoPayPal, MarcasTarjeta } from "@/components/movil/pago";
import TarjetaSeleccion, { TONO } from "@/components/movil/tarjeta-seleccion";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { C, SOMBRA } from "@/lib/estilos";
import { agregarMetodo, eliminarMetodo, hacerPredeterminado, useMetodosPago, type MetodoPago } from "@/lib/pagos";

const TIPOS: { id: MetodoPago["tipo"]; t: string }[] = [
  { id: "debito", t: "Débito" },
  { id: "credito", t: "Crédito" },
  { id: "paypal", t: "PayPal" },
];

// Perfil → Métodos de pago: tarjetas guardadas y alta de una nueva
export default function MetodosPago() {
  const router = useRouter();
  const metodos = useMetodosPago();
  const [formulario, setFormulario] = useState(false);
  const [tipo, setTipo] = useState<MetodoPago["tipo"]>("debito");
  const [titular, setTitular] = useState("");
  const [numero, setNumero] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvc, setCvc] = useState("");
  const [correo, setCorreo] = useState("");

  const valido = tipo === "paypal" ? correo.includes("@") : titular.trim() !== "" && numero.replace(/\D/g, "").length >= 12 && vencimiento.length >= 4;

  function guardar() {
    if (!valido) return;
    const digitos = numero.replace(/\D/g, "");
    agregarMetodo({
      tipo,
      titulo: tipo === "paypal" ? "PayPal" : tipo === "debito" ? "Tarjeta Débito" : "Tarjeta Crédito",
      detalle: tipo === "paypal" ? correo.trim() : `**** ${digitos.slice(-4)}`,
      titular: tipo === "paypal" ? correo.trim() : titular.trim(),
      vencimiento: tipo === "paypal" ? undefined : vencimiento,
    });
    setTitular("");
    setNumero("");
    setVencimiento("");
    setCvc("");
    setCorreo("");
    setFormulario(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo="Métodos de pago" onVolver={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="gap-7 px-5 py-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View>
            <Paso>Tus métodos guardados</Paso>
            <View className="mt-4 gap-4">
              {metodos.length === 0 && <Texto className="text-[14px] text-[#6B7688]">Aún no tienes métodos de pago. Agrega uno para pagar tus viajes más rápido.</Texto>}
              {metodos.map((m) => (
                <Pressable
                  key={m.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${m.titulo} ${m.detalle}`}
                  onPress={() => hacerPredeterminado(m.id)}
                  className={`rounded-2xl px-5 py-4 ${m.predeterminado ? "border-2 border-[#8B9A3A] bg-[#E6EAE0]" : "border-2 border-[#EFEFEF] bg-[#EFEFEF]"}`}
                >
                  <View className="flex-row items-center justify-between gap-3">
                    {m.tipo === "paypal" ? (
                      <LogoPayPal />
                    ) : (
                      <View className="min-w-0">
                        <Texto className="text-[14px] font-bold text-[#16202E]">{m.titulo}</Texto>
                        <Texto className="text-[14px] font-bold text-[#16202E]">{m.detalle}</Texto>
                      </View>
                    )}
                    {m.tipo !== "paypal" && <MarcasTarjeta />}
                  </View>
                  <View className="mt-3 flex-row items-center justify-between">
                    <Texto className="text-[12px] text-[#6B7688]">{m.tipo === "paypal" ? m.detalle : `${m.titular} · Vence ${m.vencimiento}`}</Texto>
                    <View className="flex-row items-center gap-3">
                      {m.predeterminado ? (
                        <View className="rounded-md bg-success-100 px-2.5 py-1">
                          <Texto className="text-[11px] font-semibold text-success-700">Predeterminado</Texto>
                        </View>
                      ) : (
                        <Texto className="text-[11px] font-semibold text-[#4A5720]">Usar como principal</Texto>
                      )}
                      <Pressable accessibilityRole="button" accessibilityLabel={`Eliminar ${m.titulo}`} onPress={() => eliminarMetodo(m.id)} hitSlop={8} className="h-8 w-8 items-center justify-center rounded-lg bg-white active:bg-error-500">
                        {({ pressed }) => <Icono d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" size={16} color={pressed ? "#fff" : "#E9564F"} />}
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <View className="flex-row items-center justify-between">
              <Paso>Agregar método de pago</Paso>
              <Pressable accessibilityRole="button" accessibilityState={{ expanded: formulario }} onPress={() => setFormulario((f) => !f)} className="h-9 w-9 items-center justify-center rounded-full bg-[#4A5720] active:scale-110">
                <Icono d={formulario ? ICONOS.cerrar : ICONOS.mas} size={16} color="#fff" strokeWidth={2.2} />
              </Pressable>
            </View>

            {formulario && (
              <View style={SOMBRA.card} className="mt-4 gap-4 rounded-2xl border border-[#EDEFEB] bg-white px-5 py-5">
                <View className="flex-row gap-3">
                  {TIPOS.map((t) => (
                    <TarjetaSeleccion key={t.id} activo={tipo === t.id} onPress={() => setTipo(t.id)} className="flex-1 items-center rounded-xl py-2.5">
                      <Texto className="text-[14px] font-semibold" style={{ color: tipo === t.id ? TONO.activo : TONO.inactivo }}>{t.t}</Texto>
                    </TarjetaSeleccion>
                  ))}
                </View>
                {tipo === "paypal" ? (
                  <Entrada label="Correo de tu cuenta PayPal" value={correo} onChange={setCorreo} placeholder="nombre@ejemplo.com" keyboardType="email-address" autoCapitalize="none" />
                ) : (
                  <>
                    <Entrada label="Nombre del titular" value={titular} onChange={setTitular} placeholder="Como aparece en la tarjeta" />
                    <Entrada label="Número de tarjeta" value={numero} onChange={(t) => setNumero(t.replace(/[^\d ]/g, ""))} placeholder="0000 0000 0000 0000" keyboardType="number-pad" />
                    <View className="flex-row gap-3">
                      <Entrada className="flex-1" label="Vencimiento" value={vencimiento} onChange={setVencimiento} placeholder="MM/AA" keyboardType="numbers-and-punctuation" />
                      <Entrada className="flex-1" label="CVC/CVV" value={cvc} onChange={(t) => setCvc(t.replace(/\D/g, "").slice(0, 4))} placeholder="123" keyboardType="number-pad" />
                    </View>
                    <Casilla>Guardar esta tarjeta de forma segura para mis próximos viajes</Casilla>
                  </>
                )}
                <BotonPill color={C.oliva} onPress={guardar} disabled={!valido} className="w-full py-4" textClassName="text-[15px]">
                  Guardar método de pago
                </BotonPill>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
