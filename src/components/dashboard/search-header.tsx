import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Image } from "expo-image";

import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";

const MESES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DIAS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function CalendarioFiltro({ onSeleccion }: { onSeleccion: (fecha: Date) => void }) {
  const hoy = new Date();
  const [offset, setOffset] = useState(0);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

  const vista = new Date(hoy.getFullYear(), hoy.getMonth() + offset, 1);
  const primerDia = vista.getDay();
  const diasDelMes = new Date(vista.getFullYear(), vista.getMonth() + 1, 0).getDate();
  const diasMesAnterior = new Date(vista.getFullYear(), vista.getMonth(), 0).getDate();

  // 42 celdas (6 filas): cola del mes anterior + mes actual + inicio del siguiente
  const celdas: { dia: number; delMes: boolean }[] = [];
  for (let i = primerDia - 1; i >= 0; i--) celdas.push({ dia: diasMesAnterior - i, delMes: false });
  for (let d = 1; d <= diasDelMes; d++) celdas.push({ dia: d, delMes: true });
  let siguiente = 1;
  while (celdas.length < 42) celdas.push({ dia: siguiente++, delMes: false });

  return (
    <View style={SOMBRA.alta} className="absolute right-0 top-14 z-30 w-80 rounded-[2rem] bg-white p-6">
      <View className="flex-row items-center justify-between">
        <Pressable accessibilityRole="button" accessibilityLabel="Mes anterior" onPress={() => setOffset((o) => o - 1)} className="h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 active:bg-primary-400">
          <Icono d="M15 18l-6-6 6-6" size={16} color="#4d5148" strokeWidth={2.5} />
        </Pressable>
        <Texto className="font-sans text-lg font-semibold text-neutral-900">{MESES[vista.getMonth()]} {vista.getFullYear()}</Texto>
        <Pressable accessibilityRole="button" accessibilityLabel="Mes siguiente" onPress={() => setOffset((o) => o + 1)} className="h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 active:bg-primary-400">
          <Icono d="M9 6l6 6-6 6" size={16} color="#4d5148" strokeWidth={2.5} />
        </Pressable>
      </View>

      <View className="mt-5 flex-row flex-wrap">
        {DIAS.map((d) => (
          <Texto key={d} className="w-[14.28%] text-center text-[10px] font-medium tracking-wide text-neutral-400">{d}</Texto>
        ))}
        {celdas.map((c, i) => {
          const clave = `${vista.getMonth()}-${c.dia}-${c.delMes}`;
          const activo = seleccionado === clave && c.delMes;
          return (
            <View key={i} className="w-[14.28%] items-center py-1">
              <Pressable
                accessibilityRole="button"
                disabled={!c.delMes}
                onPress={() => {
                  setSeleccionado(clave);
                  onSeleccion(new Date(vista.getFullYear(), vista.getMonth(), c.dia));
                }}
                className={`h-8 w-8 items-center justify-center rounded-lg ${activo ? "bg-primary-500" : c.delMes ? "active:bg-primary-400/20" : ""}`}
              >
                <Texto className={`text-sm ${activo ? "font-semibold text-white" : c.delMes ? "text-neutral-700" : "text-neutral-300"}`}>{c.dia}</Texto>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function SearchHeader() {
  const [calendarioAbierto, setCalendarioAbierto] = useState(false);

  return (
    <View className="flex-row items-center gap-4" style={{ zIndex: calendarioAbierto ? 50 : 1 }}>
      <View style={SOMBRA.suave} className="flex-1 flex-row items-center gap-3 rounded-full border border-neutral-200 bg-white px-6 py-3.5">
        <Icono d="M21 21l-4.35-4.35" circulos={[[11, 11, 7]]} size={16} color="#a2a79e" strokeWidth={2} />
        <TextInput placeholder="BUSCAR AQUI..." placeholderTextColor="#a2a79e" className="flex-1 font-inter text-sm tracking-wide text-neutral-800" style={{ paddingVertical: 0 }} />
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="Filtrar por fecha" onPress={() => setCalendarioAbierto((o) => !o)} className="h-12 w-12 items-center justify-center active:scale-110">
        <Image source={IMAGENES["/images/image_rutas/btn_filter.png"]} contentFit="contain" style={{ width: 24, height: 24 }} />
      </Pressable>

      {calendarioAbierto && <CalendarioFiltro onSeleccion={() => setCalendarioAbierto(false)} />}
    </View>
  );
}
