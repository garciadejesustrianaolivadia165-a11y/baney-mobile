import { useState } from "react";
import { Pressable, View } from "react-native";

import BotonPill from "@/components/movil/boton-pill";
import FormularioTarjeta from "@/components/movil/formulario-tarjeta";
import TarjetaSeleccion, { TONO } from "@/components/movil/tarjeta-seleccion";
import Icono, { ICONOS } from "@/components/ui/icono";
import { BotonPago, Casilla, EntradaPago, FilaDato, LogoPayPal, MarcasTarjeta, ResumenPago, resumenTransporte, type Resumen } from "@/components/movil/pago";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { agregarMetodo, eliminarMetodo, hacerPredeterminado, useMetodosPago } from "@/lib/pagos";

/**
 * Pasarela "Escoge tu medio de pago" (paso 3 de Solicitar transporte). La misma
 * lista desplegable sirve para pagar un viaje (`modo="pago"`) y para administrar
 * los métodos guardados desde Perfil → Métodos de pago (`modo="gestion"`).
 */
export default function MediosPago({ modo, material = "Materiales", resumen, onContinuar }: { modo: "pago" | "gestion"; material?: string; /** Desglose a pagar (checkout); sin él se muestra el del transporte */ resumen?: Resumen; onContinuar?: (metodo: string) => void }) {
  const guardados = useMetodosPago();
  const [abierto, setAbierto] = useState<string | null>(null);
  const [eligiendo, setEligiendo] = useState(false);
  const [correoPayPal, setCorreoPayPal] = useState("");
  const paypal = guardados.find((m) => m.tipo === "paypal");
  const tarjetas = guardados.filter((m) => m.tipo !== "paypal");
  const desglose = resumen ?? resumenTransporte(material);

  function vincularPayPal() {
    if (!correoPayPal.includes("@")) return;
    agregarMetodo({ tipo: "paypal", titulo: "PayPal", detalle: correoPayPal.trim(), titular: correoPayPal.trim() });
    setCorreoPayPal("");
    setAbierto(null);
  }

  const Cabecera = ({ id, children, marcas = true }: { id: string; children: React.ReactNode; marcas?: boolean }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: abierto === id }}
      onPress={() => setAbierto((a) => (a === id ? null : id))}
      className={`w-full flex-row items-center justify-between gap-3 rounded-2xl px-5 py-4 ${abierto === id ? "border-2 border-[#8B9A3A] bg-[#E6EAE0]" : "border-2 border-[#EFEFEF] bg-[#EFEFEF]"}`}
    >
      {children}
      {marcas && <MarcasTarjeta />}
    </Pressable>
  );

  const Detalle = ({ children }: { children: React.ReactNode }) => (
    <View style={SOMBRA.card} className="mt-4 rounded-2xl border border-[#EDEFEB] bg-white px-5 py-5">
      {children}
    </View>
  );

  const AccionesGestion = ({ id, predeterminado }: { id: string; predeterminado: boolean }) => (
    <View className="mt-5 flex-row gap-3">
      {predeterminado ? (
        <View className="flex-1 items-center justify-center rounded-full bg-success-100 py-3">
          <Texto className="text-[13px] font-semibold text-success-700">Método principal</Texto>
        </View>
      ) : (
        <BotonPill color="#4A5720" onPress={() => hacerPredeterminado(id)} className="flex-1 py-3" textClassName="text-[13px]" sinSombra>
          Usar como principal
        </BotonPill>
      )}
      <BotonPill color="#E9564F" variante="borde" textoColor="#E9564F" onPress={() => { eliminarMetodo(id); setAbierto(null); }} className="px-5 py-3" textClassName="text-[13px]" sinSombra>
        Eliminar
      </BotonPill>
    </View>
  );

  return (
    <View className="gap-4">
      {tarjetas.map((m) => (
        <View key={m.id}>
          <Cabecera id={m.id}>
            <View className="min-w-0">
              <Texto className="text-[14px] font-bold text-[#16202E]">{m.tipo === "debito" ? "Debito" : "Crédito"}</Texto>
              <Texto className="text-[14px] font-bold text-[#16202E]">{m.detalle.replace("**** ", "****")}</Texto>
            </View>
          </Cabecera>
          {abierto === m.id && (
            <Detalle>
              <Texto className="text-[20px] font-bold text-[#16202E]">Medio de pago</Texto>
              <Texto className="mt-2 text-[16px] text-[#16202E]">{m.titulo}</Texto>
              <View className="mt-4">
                <FilaDato k="Nombre del titular" v={m.titular} />
                <FilaDato k="Número de tarjeta" v={m.detalle} />
                <FilaDato k="Fecha de vencimiento" v={m.vencimiento ?? ""} />
                {m.tipo === "credito" && <FilaDato k="Cuotas" v="1" />}
                {modo === "pago" && <FilaDato k="Total" v={desglose.total} fuerte />}
              </View>
              <View className="mt-4">
                <MarcasTarjeta />
              </View>
              {modo === "pago" ? (
                <>
                  <Texto className="mt-6 text-[20px] font-bold text-[#16202E]">Información de pago</Texto>
                  <ResumenPago resumen={desglose} />
                  <BotonPago onPress={() => onContinuar?.(`${m.titulo} ${m.detalle}`)}>Continuar</BotonPago>
                </>
              ) : (
                <AccionesGestion id={m.id} predeterminado={m.predeterminado} />
              )}
            </Detalle>
          )}
        </View>
      ))}

      <View>
        <Cabecera id="nueva">
          <View className="min-w-0">
            <Texto className="text-[14px] font-bold text-[#16202E]">Agregar Tarjeta Debito/Crédito</Texto>
            <Texto className="text-[14px] font-bold text-[#16202E]">****6789</Texto>
          </View>
        </Cabecera>
        {abierto === "nueva" && (
          <Detalle>
            {modo === "pago" && <ResumenPago resumen={desglose} />}
            <View className={modo === "pago" ? "mt-6" : ""}>
              <FormularioTarjeta textoBoton={modo === "pago" ? "Continuar" : "Guardar tarjeta"} guardar={modo === "gestion"} onListo={(t) => { setAbierto(null); if (modo === "pago") onContinuar?.(`Tarjeta **** ${t.numero.slice(-4)}`); }} />
            </View>
          </Detalle>
        )}
      </View>

      <View>
        <Cabecera id="paypal" marcas={false}>
          <LogoPayPal />
          {paypal && modo === "gestion" && <Texto className="text-[13px] text-[#6B7688]">{paypal.detalle}</Texto>}
        </Cabecera>
        {abierto === "paypal" && (
          <Detalle>
            <Texto className="text-[20px] font-bold text-[#16202E]">Medio de pago</Texto>
            <View className="mt-4">
              <LogoPayPal size={34} />
            </View>
            {modo === "pago" ? (
              <>
                <Texto className="mt-6 text-[20px] font-bold text-[#16202E]">Información de pago</Texto>
                <ResumenPago resumen={desglose} />
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
                  Acepto haber leído los <Texto className="text-[12px] text-[#4A5720] underline">términos y condiciones y políticas de privacidad</Texto> para hacer este pago
                </Casilla>
                <BotonPago onPress={() => onContinuar?.("PayPal")}>Ir a plataforma de pago</BotonPago>
              </>
            ) : paypal ? (
              <>
                <View className="mt-4">
                  <FilaDato k="Cuenta vinculada" v={paypal.detalle} />
                </View>
                <AccionesGestion id={paypal.id} predeterminado={paypal.predeterminado} />
              </>
            ) : (
              <>
                <Texto className="mt-6 text-[20px] font-bold text-[#16202E]">Vincula tu cuenta</Texto>
                <View className="mt-4">
                  <EntradaPago placeholder="Correo electrónico de PayPal" tipo="email" value={correoPayPal} onChange={setCorreoPayPal} />
                </View>
                <BotonPago onPress={vincularPayPal}>Vincular PayPal</BotonPago>
              </>
            )}
          </Detalle>
        )}
      </View>

      {modo === "gestion" && (
        <View className="mt-2">
          <BotonPill color="#4A5720" onPress={() => setEligiendo((e) => !e)} className="w-full py-4" sinSombra>
            {(pressed) => (
              <View className="flex-row items-center gap-2">
                <Icono d={eligiendo ? ICONOS.cerrar : ICONOS.mas} size={16} color={pressed ? "#4A5720" : "#fff"} strokeWidth={2.2} />
                <Texto className="text-[15px] font-bold" style={{ color: pressed ? "#4A5720" : "#fff" }}>Agregar nuevo método de pago</Texto>
              </View>
            )}
          </BotonPill>
          {eligiendo && (
            <View className="mt-3 flex-row gap-3">
              <TarjetaSeleccion activo={abierto === "nueva"} onPress={() => { setAbierto("nueva"); setEligiendo(false); }} className="flex-1 flex-row items-center justify-center gap-2 py-3.5">
                <Icono d={ICONOS.tarjeta} size={18} color={TONO.inactivo} strokeWidth={1.8} />
                <Texto className="text-[14px] font-semibold" style={{ color: TONO.inactivo }}>Tarjeta débito/crédito</Texto>
              </TarjetaSeleccion>
              {!paypal && (
                <TarjetaSeleccion activo={abierto === "paypal"} onPress={() => { setAbierto("paypal"); setEligiendo(false); }} className="flex-1 items-center justify-center py-3.5">
                  <LogoPayPal size={15} />
                </TarjetaSeleccion>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
