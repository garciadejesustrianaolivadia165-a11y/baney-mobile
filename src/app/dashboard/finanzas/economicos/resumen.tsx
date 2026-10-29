import { useState } from "react";
import { View } from "react-native";

import FiltroPeriodo from "@/components/dashboard/filtro-periodo";
import { BarrasAgrupadas, CabeceraGrafico, Cifra, Dona, Leyenda, Tarjeta, TarjetaTotal } from "@/components/dashboard/graficos";
import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import Texto from "@/components/ui/texto";
import { GraficoVentasProducto } from "./index";

const tarjetas = [
  { label: "Pedidos Pendientes", valor: "15", tono: "warning" as const, iconoD: "M3 7h18v13H3zM3 7l2-4h14l2 4M16 13h3" },
  { label: "Pedidos Entregados", valor: "50", tono: "success" as const, iconoD: "M6 7l1-3h10l1 3M4 7h16l-1.5 13h-13L4 7z" },
  { label: "Pedidos Cancelados", valor: "5", tono: "error" as const, iconoD: "M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
];

const DONA_ORDENES = [
  { color: "#9eaa31", dash: "50 50", offset: "0", titulo: "Entregados: 50%" },
  { color: "#e0b84a", dash: "35 65", offset: "-50", titulo: "Pendientes: 35%" },
  { color: "#6b4926", dash: "15 85", offset: "-85", titulo: "Cancelados: 15%" },
];

// Resumen mensual: [entregados, pendientes, cancelados] en miles
const mesesLargos = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"];
const resumenMensual = [[20, 14, 6], [17, 11, 16], [6, 23, 15], [18, 13, 6], [12, 14, 11], [16, 9, 13], [11, 21, 14]];
const seriesMensual = [
  { nombre: "Entregados", color: "#ec8a3c" },
  { nombre: "Pendientes", color: "#747d24" },
  { nombre: "Cancelados", color: "#dc2626" },
];

export default function OrderSummary() {
  const [perProducto, setPerProducto] = useState("Semana");
  const [perOrdenes, setPerOrdenes] = useState("Mes");

  return (
    <Pagina>
      <TituloSeccion titulo="Resumen General De Pedidos" enlace="Volver Atrás" href="/dashboard/finanzas/economicos" />

      <View className="gap-6">
        {tarjetas.map((t) => (
          <TarjetaTotal key={t.label} {...t} />
        ))}
      </View>

      <GraficoVentasProducto periodo={perProducto} onPeriodo={setPerProducto} />

      <Tarjeta>
        <CabeceraGrafico titulo="Status de Ordenes" mayusculas={false}>
          <FiltroPeriodo valor={perOrdenes} onCambio={setPerOrdenes} />
        </CabeceraGrafico>
        <Cifra valor="102" sub="70 ordenes activas" />
        <View className="mt-4">
          <Dona segmentos={DONA_ORDENES} porcentajes />
        </View>
      </Tarjeta>

      <Tarjeta>
        <Texto className="font-sans text-lg font-semibold text-neutral-900">Resumen mensual de pedidos</Texto>
        <View className="mt-6">
          <BarrasAgrupadas
            categorias={mesesLargos}
            series={seriesMensual.map((s, j) => ({ ...s, valores: resumenMensual.map((v) => v[j]) }))}
            alto={160}
            max={25}
            anchoBarra={10}
            ejeY={["25k", "20k", "15k", "10k", "5k", "0"]}
            formato={(s, m, v) => `${m} · ${s}: ${v}k`}
          />
        </View>
        <Leyenda items={seriesMensual} />
      </Tarjeta>
    </Pagina>
  );
}
