import { useState } from "react";
import { View } from "react-native";

import FiltroPeriodo from "@/components/dashboard/filtro-periodo";
import { BarrasAgrupadas, BotonPeriodo, CabeceraGrafico, Leyenda, Medidor, Tarjeta } from "@/components/dashboard/graficos";
import Pagina from "@/components/dashboard/pagina";
import { CalendarioFiltro } from "@/components/dashboard/search-header";
import BotonPill from "@/components/movil/boton-pill";
import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { GraficoStatus } from "../index";

export const mesesCortos = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun"];
export const ventasProducto = [
  { nombre: "Zanahorias", color: "#e0b84a", valores: [8, 18, -35, -18, 25, -30] },
  { nombre: "Plátanos", color: "#6b4926", valores: [-15, 22, -8, -12, 20, -20] },
  { nombre: "Peras", color: "#3f5233", valores: [45, 48, -10, -8, 18, 40] },
];

const mesesVs = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July"];
const ventasVs = [[55, 75], [60, 70], [45, 82], [58, 65], [78, 92], [80, 95], [76, 93]];
const mesesLargos = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"];
const entregasVs = [[14, 12], [17, 11], [6, 23], [16, 7], [11, 11], [17, 13], [21, 10]];

/** Gráfico "Ventas por producto" (barras agrupadas con negativos) */
export function GraficoVentasProducto({ periodo, onPeriodo }: { periodo: string; onPeriodo: (v: string) => void }) {
  return (
    <Tarjeta>
      <CabeceraGrafico titulo="Ventas por producto" mayusculas={false}>
        <FiltroPeriodo valor={periodo} onCambio={onPeriodo} />
      </CabeceraGrafico>
      <View className="mt-6">
        <BarrasAgrupadas categorias={mesesCortos} series={ventasProducto} alto={170} max={60} min={-60} anchoBarra={10} ejeY={["60", "20", "-20", "-60"]} formato={(s, m, v) => `${s} · ${m}: ${v}`} />
      </View>
      <Leyenda items={ventasProducto} />
    </Tarjeta>
  );
}

export default function EconomicIndicators() {
  const [perProducto, setPerProducto] = useState("Semana");
  const [perStatus, setPerStatus] = useState("Mes");
  const [calAbierto, setCalAbierto] = useState(false);

  return (
    <Pagina>
      {/* Encabezado + filtro de períodos */}
      <View className="flex-row flex-wrap items-center justify-between gap-4" style={{ zIndex: calAbierto ? 50 : 1 }}>
        <Texto className="max-w-56 font-sans text-xl leading-snug text-neutral-500">Detalles de indicadores económicos</Texto>
        <View>
          <BotonPeriodo titulo="Filtrar periodos" rango="12 de julio 2025 - 12 de julio 2026" abierto={calAbierto} onPress={() => setCalAbierto((o) => !o)} />
          {calAbierto && <CalendarioFiltro onSeleccion={() => setCalAbierto(false)} />}
        </View>
      </View>

      <GraficoVentasProducto periodo={perProducto} onPeriodo={setPerProducto} />

      {/* Ventas VS Realidad */}
      <Tarjeta>
        <Texto className="font-sans text-lg font-semibold uppercase tracking-wide text-neutral-900">Ventas VS REALIDAD</Texto>
        <View className="mt-6">
          <BarrasAgrupadas
            categorias={mesesVs}
            series={[
              { nombre: "Real", color: "#3f5233", valores: ventasVs.map((v) => v[0]) },
              { nombre: "Objetivo", color: "#9eaa31", valores: ventasVs.map((v) => v[1]) },
            ]}
            alto={150}
            max={100}
            formato={(s, m, v) => `${m} · ${s}: ${v}%`}
            colorEjeX="#63b3ff"
          />
        </View>
        <View className="mt-6 gap-4">
          {[
            { d: "M6 7l1-3h10l1 3M4 7h16l-1.5 13h-13L4 7z", fondo: "bg-success-100", color: "#047857", t: "Ventas reales", s: "Global", v: "356,005.56", vc: "text-success-600" },
            { d: ["M3 6h18v12H3z"], circ: [[12, 12, 2.5]] as [number, number, number][], fondo: "bg-warning-200", color: "#92400e", t: "Objetivo de ventas", s: "Comercial", v: "500,000.00", vc: "text-warning-500" },
          ].map((f) => (
            <View key={f.t} className="flex-row items-center gap-4">
              <View className={`h-10 w-10 items-center justify-center rounded-xl ${f.fondo}`}>
                <Icono d={f.d} circulos={f.circ} size={20} color={f.color} />
              </View>
              <View className="flex-1">
                <Texto className="text-sm font-semibold text-caney-sky">{f.t}</Texto>
                <Texto className="text-xs text-neutral-500">{f.s}</Texto>
              </View>
              <Texto className={`font-sans text-lg font-medium ${f.vc}`}>{f.v}</Texto>
            </View>
          ))}
        </View>
      </Tarjeta>

      {/* Resumen de pedidos */}
      <Tarjeta>
        <Texto className="font-sans text-lg font-semibold text-neutral-900">Resumen de pedidos</Texto>
        <View className="mt-6 flex-row flex-wrap items-center gap-8">
          <Medidor pct={85} texto="85%" />
          <View>
            <Texto className="font-sans text-2xl font-semibold text-neutral-900">$356,005.56</Texto>
            <Texto className="text-sm text-neutral-500">meta $500,000.00</Texto>
            <BotonPill color="#afc79f" textoColor="#1e2a19" href="/dashboard/finanzas/economicos/resumen" className="mt-4 self-start rounded-2xl px-8 py-3" textClassName="font-sans text-sm" sinSombra>
              Mas detalles
            </BotonPill>
          </View>
        </View>
        <View className="mt-6 flex-row flex-wrap gap-4">
          {[
            { n: "15", t: "Pendientes" },
            { n: "50", t: "Entregadas" },
            { n: "5", t: "Canceladas" },
          ].map((c) => (
            <View key={c.t} className="rounded-xl border border-neutral-200 px-6 py-3">
              <Texto className="font-sans text-lg font-semibold text-neutral-900">{c.n}</Texto>
              <Texto className="text-xs text-neutral-500">{c.t}</Texto>
            </View>
          ))}
        </View>
      </Tarjeta>

      <GraficoStatus titulo="Status de pedidos" mayusculas={false} periodo={perStatus} onPeriodo={setPerStatus} cifra="328" />

      {/* Entregas VS Pendientes */}
      <Tarjeta>
        <Texto className="font-sans text-lg font-semibold text-neutral-900">Entregas VS Pendientes</Texto>
        <View className="mt-6">
          <BarrasAgrupadas
            categorias={mesesLargos}
            series={[
              { nombre: "Entregados", color: "#9eaa31", valores: entregasVs.map((v) => v[0]) },
              { nombre: "Pendientes", color: "#3f5233", valores: entregasVs.map((v) => v[1]) },
            ]}
            alto={160}
            max={25}
            ejeY={["25k", "20k", "15k", "10k", "5k", "0"]}
            formato={(s, m, v) => `${m} · ${s}: ${v}k`}
          />
        </View>
        <Leyenda items={[{ nombre: "Entregados", color: "#9eaa31" }, { nombre: "Pendientes", color: "#3f5233" }]} />
      </Tarjeta>
    </Pagina>
  );
}
