import { useState } from "react";
import { View } from "react-native";

import FiltroPeriodo, { formatearPeriodo as formatear } from "@/components/dashboard/filtro-periodo";
import { Area, Barras, CabeceraGrafico, Cifra, Dona, DONA_STATUS, Flecha, Leyenda, Lineas, Tarjeta, TarjetaTotal } from "@/components/dashboard/graficos";
import Pagina from "@/components/dashboard/pagina";
import BotonPill from "@/components/movil/boton-pill";
import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { IMAGENES } from "@/lib/imagenes";

export const TARJETAS_TOTALES = [
  { label: "Total Ventas", valor: "$250,000", cambio: "20%", sube: true, tono: "success" as const, icono: IMAGENES["/icons/icon_01.png"] },
  { label: "Total Producto", valor: "500", cambio: "15%", sube: true, tono: "warning" as const, icono: IMAGENES["/icons/icon_02.png"] },
  { label: "Total Clientes", valor: "2,512", cambio: "10%", sube: false, tono: "error" as const, icono: IMAGENES["/icons/icon_03.png"] },
];

export const barrasVentas = [35, 55, 75, 45, 30, 42, 60, 72, 50, 28, 46, 68, 74, 48, 32, 44, 58, 73, 46, 40];
export const seriesPedidos = [
  { nombre: "Actuales", color: "#e0b84a", puntos: [35, 42, 48, 55, 66, 60] },
  { nombre: "En tiempo", color: "#9eaa31", puntos: [25, 32, 40, 46, 52, 58] },
  { nombre: "Atrasados", color: "#6b4926", puntos: [45, 50, 46, 58, 64, 55] },
];
export const meses = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun"];
export const areaVentas = [180, 260, 300, 240, 176, 210, 320, 410, 400, 300, 260, 290];
export const diasSemana = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Gráfico "Ventas registradas" / "Ventas": barras con eje -60..60 */
export function GraficoVentas({ titulo, periodo, onPeriodo, leyenda }: { titulo: string; periodo: string; onPeriodo: (v: string) => void; leyenda: string }) {
  return (
    <Tarjeta>
      <CabeceraGrafico titulo={titulo}>
        <FiltroPeriodo valor={periodo} onCambio={onPeriodo} />
      </CabeceraGrafico>
      <Cifra valor={formatear(95000, periodo)} sub="50 Ordenes" />
      <View className="mt-6">
        <Barras valores={barrasVentas} ejeY={["60", "20", "-20", "-60"]} ejeX={["q1", "q2", "q3", "q4"]} formato={(h) => `$${formatear(h * 1000, periodo)}`} />
      </View>
      <Leyenda items={[{ nombre: leyenda, color: "#9eaa31" }]} />
    </Tarjeta>
  );
}

/** Gráfico "Total Real de Ventas": área naranja */
export function GraficoTotalReal({ periodo, onPeriodo }: { periodo: string; onPeriodo: (v: string) => void }) {
  return (
    <Tarjeta>
      <CabeceraGrafico titulo="Total Real de Ventas" mayusculas={false}>
        <FiltroPeriodo valor={periodo} onCambio={onPeriodo} />
      </CabeceraGrafico>
      <View className="mt-2 flex-row items-center gap-3">
        <Texto className="font-sans text-3xl font-medium text-primary-600">${formatear(624000, periodo === "Año" ? "Mes" : periodo)}</Texto>
        <View className="flex-row items-center gap-1 rounded-full bg-success-100 px-2.5 py-1">
          <Texto className="text-xs font-medium text-success-700">16%</Texto>
          <Flecha sube color="#047857" />
        </View>
      </View>
      <View className="mt-6">
        <Area valores={areaVentas} ejeY={["$500", "$400", "$300", "$200", "$100", "$0"]} ejeX={diasSemana} formato={(v) => `$${v}`} destacado={{ indice: 4, texto: "$176" }} />
      </View>
    </Tarjeta>
  );
}

/** Gráfico "Pedidos": líneas Jan-Jun */
export function GraficoPedidos({ periodo, onPeriodo }: { periodo: string; onPeriodo: (v: string) => void }) {
  return (
    <Tarjeta>
      <CabeceraGrafico titulo="Pedidos">
        <FiltroPeriodo valor={periodo} onCambio={onPeriodo} />
      </CabeceraGrafico>
      <Cifra valor={formatear(196000, periodo)} sub="50 Ordenes" />
      <View className="mt-6">
        <Lineas series={seriesPedidos} meses={meses} formato={(s, m, v) => `${s} · ${m}: ${formatear(v * 1000, periodo)}`} />
      </View>
      <Leyenda items={seriesPedidos} />
    </Tarjeta>
  );
}

/** Gráfico "Status de pedido": dona con porcentajes */
export function GraficoStatus({ titulo = "Status De Pedido", periodo, onPeriodo, cifra, sub = "50 Ordenes", mayusculas = true }: { titulo?: string; periodo: string; onPeriodo: (v: string) => void; cifra: string; sub?: string; mayusculas?: boolean }) {
  return (
    <Tarjeta>
      <CabeceraGrafico titulo={titulo} mayusculas={mayusculas}>
        <FiltroPeriodo valor={periodo} onCambio={onPeriodo} />
      </CabeceraGrafico>
      <Cifra valor={cifra} sub={sub} />
      <View className="mt-4">
        <Dona segmentos={DONA_STATUS} size={190} porcentajes />
      </View>
    </Tarjeta>
  );
}

export default function Finances() {
  const [perVentas, setPerVentas] = useState("Mes");
  const [perPedidos, setPerPedidos] = useState("Mes");
  const [perArea, setPerArea] = useState("Mes");
  const [perStatus, setPerStatus] = useState("Mes");

  return (
    <Pagina>
      <View className="gap-6">
        {TARJETAS_TOTALES.map((t) => (
          <TarjetaTotal key={t.label} {...t} />
        ))}
      </View>

      <GraficoVentas titulo="Ventas Registradas" periodo={perVentas} onPeriodo={setPerVentas} leyenda="Ventas registradas" />
      <GraficoTotalReal periodo={perArea} onPeriodo={setPerArea} />

      {/* Accesos a indicadores */}
      <View className="flex-row flex-wrap gap-4">
        <BotonPill color="#afc79f" textoColor="#1e2a19" href="/dashboard/finanzas/economicos" className="rounded-2xl px-6 py-3" sinSombra>
          {(pressed) => <Texto className="font-sans text-sm font-semibold" style={{ color: pressed ? "#fff" : "#1e2a19" }}>Indicadores económicos $</Texto>}
        </BotonPill>
        <BotonPill color="#364a2d" textoColor="#fdf8f0" href="/dashboard/finanzas/productos" className="rounded-2xl px-6 py-3" sinSombra>
          {(pressed) => (
            <View className="flex-row items-center gap-2">
              <Texto className="font-sans text-sm font-semibold" style={{ color: pressed ? "#364a2d" : "#fdf8f0" }}>Indicadores Producto</Texto>
              <Icono d="M5 20V10M12 20V4M19 20v-7" size={16} color={pressed ? "#364a2d" : "#fdf8f0"} strokeWidth={2} />
            </View>
          )}
        </BotonPill>
      </View>

      <GraficoPedidos periodo={perPedidos} onPeriodo={setPerPedidos} />
      <GraficoStatus periodo={perStatus} onPeriodo={setPerStatus} cifra={formatear(328, perStatus)} />
    </Pagina>
  );
}
