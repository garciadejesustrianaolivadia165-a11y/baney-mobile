import { useState } from "react";
import { Pressable, View } from "react-native";

import TarjetaSeleccion, { TONO } from "@/components/movil/tarjeta-seleccion";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";

export type Programacion = { fecha: Date | null; hora: string | null; ventana: string };

const HORAS = ["6:00 AM", "8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"];
const VENTANAS = ["Exacta", "± 30 min", "± 1 hora", "± 2 horas"];
const DIAS = ["D", "L", "M", "M", "J", "V", "S"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS_LARGO = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

export const PROGRAMACION_VACIA: Programacion = { fecha: null, hora: null, ventana: "± 30 min" };

export function resumenProgramacion(p: Programacion) {
  if (!p.fecha || !p.hora) return null;
  return `${DIAS_LARGO[p.fecha.getDay()]} ${p.fecha.getDate()} de ${MESES[p.fecha.getMonth()]} · ${p.hora}${p.ventana !== "Exacta" ? ` (${p.ventana})` : ""}`;
}

const mismoDia = (a: Date | null, b: Date) => !!a && a.toDateString() === b.toDateString();

/**
 * Tarjeta que se despliega bajo "Programar" / "Más tarde" en las secciones de
 * transporte: día (hoy, mañana o calendario), hora y margen de llegada.
 */
export default function ProgramarCard({ valor, onCambio }: { valor: Programacion; onCambio: (p: Programacion) => void }) {
  const hoy = new Date();
  const manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
  const [calendario, setCalendario] = useState(false);
  const [offset, setOffset] = useState(0);
  const vista = new Date(hoy.getFullYear(), hoy.getMonth() + offset, 1);
  const primerDia = vista.getDay();
  const diasDelMes = new Date(vista.getFullYear(), vista.getMonth() + 1, 0).getDate();
  const celdas: (number | null)[] = [...Array(primerDia).fill(null), ...Array.from({ length: diasDelMes }, (_, i) => i + 1)];
  while (celdas.length % 7) celdas.push(null);
  const resumen = resumenProgramacion(valor);

  return (
    <View style={SOMBRA.card} className="mt-4 rounded-2xl border border-[#EDEFEB] bg-white px-5 py-5">
      <Texto className="text-[11px] font-bold uppercase tracking-wide text-[#9AA3AF]">¿Qué día?</Texto>
      <View className="mt-3 flex-row gap-3">
        {[
          { t: "Hoy", f: hoy },
          { t: "Mañana", f: manana },
        ].map((d) => (
          <TarjetaSeleccion key={d.t} activo={mismoDia(valor.fecha, d.f) && !calendario} onPress={() => { onCambio({ ...valor, fecha: d.f }); setCalendario(false); }} className="flex-1 items-center rounded-xl py-2.5">
            <Texto className="text-[14px] font-semibold" style={{ color: mismoDia(valor.fecha, d.f) && !calendario ? TONO.activo : TONO.inactivo }}>{d.t}</Texto>
          </TarjetaSeleccion>
        ))}
        <TarjetaSeleccion activo={calendario} onPress={() => setCalendario((c) => !c)} className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl py-2.5">
          <Icono d={ICONOS.calendario} size={16} color={calendario ? TONO.activo : TONO.inactivo} strokeWidth={1.8} />
          <Texto className="text-[14px] font-semibold" style={{ color: calendario ? TONO.activo : TONO.inactivo }}>Otro día</Texto>
        </TarjetaSeleccion>
      </View>

      {calendario && (
        <View className="mt-4 rounded-2xl bg-[#F1F4F2] p-4">
          <View className="flex-row items-center justify-between">
            <Pressable accessibilityRole="button" accessibilityLabel="Mes anterior" disabled={offset === 0} onPress={() => setOffset((o) => o - 1)} className={`h-8 w-8 items-center justify-center rounded-lg bg-white ${offset === 0 ? "opacity-40" : "active:bg-[#4A5720]"}`}>
              <Icono d="M15 18l-6-6 6-6" size={16} color="#16202E" strokeWidth={2.5} />
            </Pressable>
            <Texto className="text-[15px] font-bold capitalize text-[#16202E]">{MESES[vista.getMonth()]} {vista.getFullYear()}</Texto>
            <Pressable accessibilityRole="button" accessibilityLabel="Mes siguiente" onPress={() => setOffset((o) => o + 1)} className="h-8 w-8 items-center justify-center rounded-lg bg-white active:bg-[#4A5720]">
              <Icono d="M9 6l6 6-6 6" size={16} color="#16202E" strokeWidth={2.5} />
            </Pressable>
          </View>
          <View className="mt-3 flex-row flex-wrap">
            {DIAS.map((d, i) => (
              <Texto key={i} className="w-[14.28%] text-center text-[10px] font-bold text-[#9AA3AF]">{d}</Texto>
            ))}
            {celdas.map((dia, i) => {
              const fecha = dia ? new Date(vista.getFullYear(), vista.getMonth(), dia) : null;
              const pasado = !!fecha && fecha < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
              const activo = !!fecha && mismoDia(valor.fecha, fecha);
              return (
                <View key={i} className="w-[14.28%] items-center py-1">
                  {fecha && (
                    <Pressable accessibilityRole="button" disabled={pasado} onPress={() => onCambio({ ...valor, fecha })} className={`h-8 w-8 items-center justify-center rounded-lg ${activo ? "bg-[#4A5720]" : pasado ? "" : "active:bg-secondary4-50"}`}>
                      <Texto className={`text-[13px] ${activo ? "font-bold text-white" : pasado ? "text-[#C9CFC6]" : "text-[#16202E]"}`}>{dia}</Texto>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}

      <Texto className="mt-5 text-[11px] font-bold uppercase tracking-wide text-[#9AA3AF]">¿A qué hora?</Texto>
      <View className="mt-3 flex-row flex-wrap gap-2">
        {HORAS.map((h) => {
          const activo = valor.hora === h;
          return (
            <Pressable key={h} accessibilityRole="button" accessibilityState={{ selected: activo }} onPress={() => onCambio({ ...valor, hora: h })} className={`rounded-full border-2 px-3.5 py-2 ${activo ? "border-secondary4-400 bg-secondary4-50" : "border-[#EDEFEB] bg-white"}`}>
              <Texto className="text-[13px] font-semibold" style={{ color: activo ? TONO.activo : TONO.inactivo }}>{h}</Texto>
            </Pressable>
          );
        })}
      </View>

      <Texto className="mt-5 text-[11px] font-bold uppercase tracking-wide text-[#9AA3AF]">Margen de llegada</Texto>
      <View className="mt-3 flex-row flex-wrap gap-2">
        {VENTANAS.map((v) => {
          const activo = valor.ventana === v;
          return (
            <Pressable key={v} accessibilityRole="button" accessibilityState={{ selected: activo }} onPress={() => onCambio({ ...valor, ventana: v })} className={`rounded-full border-2 px-3.5 py-2 ${activo ? "border-secondary4-400 bg-secondary4-50" : "border-[#EDEFEB] bg-white"}`}>
              <Texto className="text-[13px] font-semibold" style={{ color: activo ? TONO.activo : TONO.inactivo }}>{v}</Texto>
            </Pressable>
          );
        })}
      </View>

      <View className={`mt-5 flex-row items-center gap-2 rounded-2xl px-4 py-3 ${resumen ? "bg-[#E6EAE0]" : "bg-[#F1F4F2]"}`}>
        <Icono d={ICONOS.reloj} size={16} color={resumen ? "#3F4A20" : "#9AA3AF"} strokeWidth={2} />
        <Texto className={`flex-1 text-[13px] ${resumen ? "font-semibold text-[#3F4A20]" : "text-[#9AA3AF]"}`}>{resumen ? `Programado: ${resumen}` : "Elige día y hora para programar"}</Texto>
      </View>
    </View>
  );
}
