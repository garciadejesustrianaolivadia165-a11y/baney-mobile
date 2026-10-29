import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BotonPill from "@/components/movil/boton-pill";
import BuscadorLugar from "@/components/movil/buscador-lugar";
import CabeceraVolver from "@/components/movil/cabecera-volver";
import { BotonPago, Casilla, EntradaPago, FilaDato, LogoPayPal, MarcasTarjeta, ResumenPago } from "@/components/movil/pago";
import TarjetaSeleccion, { TONO } from "@/components/movil/tarjeta-seleccion";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { C, SOMBRA } from "@/lib/estilos";
import { IMAGENES } from "@/lib/imagenes";

const MATERIALES = [
  { m: "Materiales", d: "M4 9h16v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9zM8 9V7a4 4 0 0 1 8 0v2" },
  { m: "Agregados", d: "" },
  { m: "Maquinaria", d: "M7 8h13l-3-3M17 16H4l3 3" },
  { m: "Otro", d: "" },
];
const PROGRAMACION = [
  { p: "Ahora", d: ICONOS.reloj },
  { p: "Programar", d: ICONOS.calendario },
];
const CONDICIONES = [
  { c: "Material delicado o frágil", d: "Requiere sujeción y manejo cuidadoso", i: "M12 2l9 5v6c0 5-3.8 8.4-9 9-5.2-.6-9-4-9-9V7l9-5z" },
  { c: "Comestible o perecedero", d: "Transporte apto para alimentos", i: "M7 3v8a3 3 0 0 0 6 0V3M10 11v10M17 3c-1.5 2-2 4-2 6h4c0-2-.5-4-2-6zM17 9v12" },
  { c: "Refrigeración", d: "Necesita cadena de frío durante el viaje", i: "M12 2v20M4 7l16 10M20 7L4 17M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3" },
  { c: "Material peligroso", d: "Químicos, inflamables o corrosivos", i: "M12 3l9.5 16.5H2.5L12 3zM12 10v4M12 17h.01" },
  { c: "Ninguna", d: "Carga estándar, sin requisitos extra", i: ICONOS.check },
];
const METODOS = [
  { id: "debito", titulo: "Debito", sub: "****6789" },
  { id: "credito", titulo: "Crédito", sub: "****6789" },
  { id: "nueva", titulo: "Agregar Tarjeta Debito/Crédito", sub: "****6789" },
  { id: "paypal", titulo: "PayPal", sub: "" },
];

function Titulo({ children }: { children: string }) {
  return <Texto className="text-[17px] font-bold text-[#16202E]">{children}</Texto>;
}

// ============ VISTA 7: SOLICITAR TRANSPORTE (ruta · carga · pago) ============
export default function Solicitud() {
  const router = useRouter();
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [origen, setOrigen] = useState("Av. Abraham Lincoln, Santo Domingo");
  const [destino, setDestino] = useState("");
  const [material, setMaterial] = useState("Materiales");
  const [prog, setProg] = useState("Ahora");
  const [peso, setPeso] = useState("12");
  const [unidad, setUnidad] = useState("Ton");
  const [condiciones, setCondiciones] = useState<string[]>([]);
  const [notas, setNotas] = useState("");
  const [metodoPago, setMetodoPago] = useState<string | null>(null);

  function alternarCondicion(c: string) {
    setCondiciones((prev) =>
      c === "Ninguna"
        ? prev.includes(c)
          ? []
          : ["Ninguna"]
        : prev.includes(c)
          ? prev.filter((x) => x !== c)
          : [...prev.filter((x) => x !== "Ninguna"), c],
    );
  }

  const confirmar = () => router.replace("/confirmada");
  const volver = () => (paso === 1 ? router.back() : setPaso((p) => (p === 3 ? 2 : 1)));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo={paso === 3 ? "Escoge tu medio de pago" : "Solicitar Transporte"} onVolver={volver} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="gap-6 px-5 py-5" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Pasos */}
          <View className="flex-row items-center gap-2">
            {[
              { n: 1, t: "Ruta" },
              { n: 2, t: "Carga" },
              { n: 3, t: "Pago" },
            ].map((p, i) => (
              <View key={p.n} className={`flex-row items-center gap-2 ${i < 2 ? "flex-1" : ""}`}>
                <View className={`h-[26px] w-[26px] items-center justify-center rounded-full ${paso >= p.n ? "bg-[#4A5720]" : "bg-[#F1F3F0]"}`}>
                  <Texto className={`text-[13px] font-bold ${paso >= p.n ? "text-white" : "text-[#8A93A2]"}`}>{p.n}</Texto>
                </View>
                <Texto className={`text-[14px] ${paso === p.n ? "font-bold text-[#16202E]" : "text-[#8A93A2]"}`}>{p.t}</Texto>
                {i < 2 && <View className={`h-px flex-1 ${paso > p.n ? "bg-[#4A5720]" : "bg-[#E3E6E0]"}`} />}
              </View>
            ))}
          </View>

          {/* ---------- PASO 1: RUTA ---------- */}
          {paso === 1 && (
            <>
              <View style={[SOMBRA.suave, { zIndex: 20 }]} className="gap-4 rounded-2xl border border-[#EDEFEB] bg-white px-5 py-5">
                <BuscadorLugar etiqueta="Origen" valor={origen} onCambio={setOrigen} placeholder="¿Desde dónde sale la carga?" icono={IMAGENES["/images/image_rutas/from_icon.png"]} />
                <BuscadorLugar etiqueta="Destino" valor={destino} onCambio={setDestino} placeholder="¿Hacia dónde va la carga?" icono={IMAGENES["/images/image_rutas/where_icon.png"]} />
              </View>

              <View>
                <Titulo>¿Qué transportamos?</Titulo>
                <View className="mt-4 flex-row flex-wrap justify-between gap-y-4">
                  {MATERIALES.map(({ m, d }) => {
                    const activo = material === m;
                    const tono = activo ? TONO.activo : TONO.inactivo;
                    return (
                      <TarjetaSeleccion key={m} activo={activo} onPress={() => setMaterial(m)} className="h-[122px] w-[47.5%] items-center justify-center gap-3">
                        {m === "Agregados" ? (
                          <View className="h-6 w-6 rounded-full bg-[#5D6B84]" />
                        ) : m === "Otro" ? (
                          <View className="flex-row items-end gap-1">
                            {[0, 1, 2].map((k) => (
                              <View key={k} className="h-[6px] w-[6px] rounded-full bg-[#5D6B84]" />
                            ))}
                          </View>
                        ) : (
                          <Icono d={d} size={24} color={tono} strokeWidth={1.7} />
                        )}
                        <Texto className="text-[14px] font-semibold" style={{ color: tono }}>{m}</Texto>
                      </TarjetaSeleccion>
                    );
                  })}
                </View>
              </View>

              <View>
                <Titulo>Programación</Titulo>
                <View className="mt-4 flex-row gap-4">
                  {PROGRAMACION.map(({ p, d }) => {
                    const activo = prog === p;
                    const tono = activo ? TONO.activo : TONO.inactivo;
                    return (
                      <TarjetaSeleccion key={p} activo={activo} onPress={() => setProg(p)} className="flex-1 flex-row items-center justify-center gap-2.5 py-4">
                        <Icono d={d} size={18} color={tono} strokeWidth={1.7} />
                        <Texto className="text-[15px] font-semibold" style={{ color: tono }}>{p}</Texto>
                      </TarjetaSeleccion>
                    );
                  })}
                </View>
              </View>
            </>
          )}

          {/* ---------- PASO 2: CARGA ---------- */}
          {paso === 2 && (
            <>
              <View>
                <Titulo>¿Cuánto pesa la carga?</Titulo>
                <View className="mt-4 flex-row items-center gap-3 rounded-2xl bg-[#F1F4F2] px-5 py-4">
                  <TextInput
                    keyboardType="decimal-pad"
                    value={peso}
                    onChangeText={(t) => setPeso(t.replace(/[^\d.]/g, ""))}
                    placeholder="0"
                    placeholderTextColor="#9AA69C"
                    className="flex-1 font-inter text-[22px] font-bold text-[#16202E]"
                    style={{ paddingVertical: 0 }}
                  />
                  <Texto className="text-[15px] font-semibold text-[#8A93A2]">{unidad}</Texto>
                </View>
                <View className="mt-3 flex-row gap-3">
                  {["lb", "kg", "Ton", "m³"].map((u) => {
                    const activo = unidad === u;
                    return (
                      <TarjetaSeleccion key={u} activo={activo} onPress={() => setUnidad(u)} className="flex-1 items-center rounded-xl py-2.5">
                        <Texto className="text-[14px] font-semibold" style={{ color: activo ? TONO.activo : TONO.inactivo }}>{u}</Texto>
                      </TarjetaSeleccion>
                    );
                  })}
                </View>
              </View>

              <View>
                <Titulo>¿Requiere condiciones especiales?</Titulo>
                <Texto className="mt-1.5 text-[13px] text-[#6B7688]">Marca todo lo que aplique para asignarte el camión correcto.</Texto>
                <View className="mt-4 gap-3">
                  {CONDICIONES.map((o) => {
                    const activo = condiciones.includes(o.c);
                    return (
                      <TarjetaSeleccion key={o.c} activo={activo} onPress={() => alternarCondicion(o.c)} className="w-full flex-row items-center gap-3.5 px-4 py-4">
                        <Icono d={o.i} size={24} color={activo ? TONO.activo : TONO.inactivo} strokeWidth={1.7} />
                        <View className="min-w-0 flex-1">
                          <Texto className="text-[15px] font-bold leading-tight text-[#16202E]">{o.c}</Texto>
                          <Texto className="mt-1 text-[12px] text-[#6B7688]">{o.d}</Texto>
                        </View>
                        <View className={`h-5 w-5 items-center justify-center rounded-md border-2 ${activo ? "border-secondary4-400 bg-[#4A5720]" : "border-[#D6DAD2] bg-white"}`}>
                          {activo && <Icono d={ICONOS.check} size={12} color="#fff" strokeWidth={3.5} />}
                        </View>
                      </TarjetaSeleccion>
                    );
                  })}
                </View>
              </View>

              <View>
                <Titulo>Detalles adicionales</Titulo>
                <TextInput
                  multiline
                  numberOfLines={4}
                  value={notas}
                  onChangeText={setNotas}
                  placeholder="Ej: 40 sacos paletizados, se descargan con montacargas."
                  placeholderTextColor="#9AA69C"
                  textAlignVertical="top"
                  className="mt-4 min-h-[112px] w-full rounded-2xl bg-[#F1F4F2] px-5 py-4 font-inter text-[15px] text-[#16202E]"
                />
              </View>
            </>
          )}

          {/* ---------- PASO 3: PAGO ---------- */}
          {paso === 3 && (
            <View className="gap-4">
              {METODOS.map((m) => {
                const abierto = metodoPago === m.id;
                return (
                  <View key={m.id}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ expanded: abierto }}
                      onPress={() => setMetodoPago(abierto ? null : m.id)}
                      className={`w-full flex-row items-center justify-between gap-3 rounded-2xl px-5 py-4 ${abierto ? "border-2 border-[#8B9A3A] bg-[#E6EAE0]" : "border-2 border-[#EFEFEF] bg-[#EFEFEF]"}`}
                    >
                      {m.id === "paypal" ? (
                        <LogoPayPal />
                      ) : (
                        <View className="min-w-0">
                          <Texto className="text-[14px] font-bold text-[#16202E]">{m.titulo}</Texto>
                          <Texto className="text-[14px] font-bold text-[#16202E]">{m.sub}</Texto>
                        </View>
                      )}
                      {m.id !== "paypal" && <MarcasTarjeta />}
                    </Pressable>

                    {abierto && (
                      <View style={SOMBRA.card} className="mt-4 rounded-2xl border border-[#EDEFEB] bg-white px-5 py-5">
                        {(m.id === "debito" || m.id === "credito") && (
                          <>
                            <Texto className="text-[20px] font-bold text-[#16202E]">Medio de pago</Texto>
                            <Texto className="mt-2 text-[16px] text-[#16202E]">{m.id === "debito" ? "Tarjeta Débito" : "Tarjeta Crédito"}</Texto>
                            <View className="mt-4">
                              <FilaDato k="Nombre del titular" v="Juan Pérez" />
                              <FilaDato k="Número de tarjeta" v="**** 6789" />
                              <FilaDato k="Fecha de vencimiento" v="12/23" />
                              {m.id === "credito" && <FilaDato k="Cuotas" v="1" />}
                              <FilaDato k="Total" v="RD$ 4,500.00" fuerte />
                            </View>
                            <View className="mt-4">
                              <MarcasTarjeta />
                            </View>
                            <Texto className="mt-6 text-[20px] font-bold text-[#16202E]">Información de pago</Texto>
                            <ResumenPago material={material} />
                            <BotonPago onPress={confirmar}>Continuar</BotonPago>
                          </>
                        )}

                        {m.id === "nueva" && (
                          <>
                            <Texto className="text-[20px] font-bold text-[#16202E]">Completa la información</Texto>
                            <View className="mt-4 gap-3">
                              <EntradaPago placeholder="Nombre del titular" />
                              <EntradaPago placeholder="Número de tarjeta" />
                              <View className="flex-row gap-3">
                                <View className="flex-1"><EntradaPago placeholder="CVC/CVV" /></View>
                                <View className="flex-1"><EntradaPago placeholder="Fecha de Vencimiento" /></View>
                              </View>
                            </View>
                            <Casilla>Guardar esta tarjeta de forma segura para mi compra posterior</Casilla>
                            <BotonPago onPress={confirmar}>Continuar</BotonPago>
                          </>
                        )}

                        {m.id === "paypal" && (
                          <>
                            <Texto className="text-[20px] font-bold text-[#16202E]">Medio de pago</Texto>
                            <View className="mt-4">
                              <LogoPayPal size={34} />
                            </View>
                            <Texto className="mt-6 text-[20px] font-bold text-[#16202E]">Información de pago</Texto>
                            <ResumenPago material={material} />
                            <Texto className="mt-6 text-[20px] font-bold text-[#16202E]">Completa la información</Texto>
                            <View className="mt-4 gap-3">
                              <EntradaPago placeholder="Nombre del titular" />
                              <EntradaPago placeholder="Tipo de identificación" opciones={["Cédula", "Pasaporte", "RNC"]} />
                              <EntradaPago placeholder="Número de identificación" />
                              <EntradaPago placeholder="Número de teléfono" tipo="tel" />
                              <EntradaPago placeholder="Correo electrónico" tipo="email" />
                              <EntradaPago placeholder="Selecciona tu banco" opciones={["Banco Popular Dominicano", "Banreservas", "BHD", "Scotiabank"]} />
                            </View>
                            <Casilla>
                              Acepto haber leído los{" "}
                              <Texto className="text-[12px] text-[#4A5720] underline">términos y condiciones y políticas de privacidad</Texto> para hacer este pago
                            </Casilla>
                            <BotonPago onPress={confirmar}>Ir a plataforma de pago</BotonPago>
                          </>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {paso < 3 && (
        <View className="flex-row items-center justify-between gap-4 border-t border-[#EDEFEB] bg-white px-5 py-5">
          <View>
            <Texto className="text-[13px] text-[#8A93A2]">Estimado total</Texto>
            <Texto className="text-[22px] font-bold text-[#16202E]">RD$ 4,500</Texto>
          </View>
          <BotonPill
            color={C.oliva}
            disabled={paso === 1 && destino.trim() === ""}
            onPress={() => setPaso((p) => (p === 1 ? 2 : 3))}
            className="px-9 py-4"
            textClassName="text-[15px]"
          >
            Siguiente
          </BotonPill>
        </View>
      )}
    </SafeAreaView>
  );
}
