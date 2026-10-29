import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";

import FiltroPeriodo, { formatearPeriodo } from "@/components/dashboard/filtro-periodo";
import { Barras, CabeceraGrafico, Cifra, Dona, Leyenda, Lineas, Tarjeta } from "@/components/dashboard/graficos";
import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import TablaPedidos from "@/components/dashboard/tabla-pedidos";

const IMG = "/images/image_home";

const pedidos = [
  { id: "00242772362", cliente: "Cesar Valdez", fecha: "25/2/2026", img: `${IMG}/image_home_09.png`, status: "COMPLETADO", descripcion: "Plátanos Banilejos 12 Dz", precio: "$ 135,000.00" },
  { id: "00242772363", cliente: "Mini-Market Manolo", fecha: "25/2/2026", img: `${IMG}/image_home_12.png`, status: "EN PROCESO", descripcion: "Pimientos Importados", precio: "$ 5,000.00" },
  { id: "00242772364", cliente: "Mini-Market Manolo", fecha: "25/2/2026", img: `${IMG}/image_home_12.png`, status: "NO INICIADO", descripcion: "Pimientos Importados", precio: "$ 5,000.00" },
];

// Alturas de las barras del gráfico de ventas (q1 a q4)
const barrasVentas = [55, 40, 70, 48, 30, 60, 75, 42, 52, 38, 65, 45, 58, 35, 68, 72];

// Puntos de las líneas Jan-Jun (3 series, valores 0-100)
const series = [
  { nombre: "Content", color: "#9eaa31", puntos: [30, 45, 50, 62, 70, 66] },
  { nombre: "Content ", color: "#e0b84a", puntos: [20, 30, 42, 50, 58, 64] },
  { nombre: "Content  ", color: "#6b4926", puntos: [40, 48, 55, 60, 68, 75] },
];
const meses = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun"];
const DONA = [
  { color: "#9eaa31", dash: "50 50", offset: "0", titulo: "Content: 50%" },
  { color: "#e0b84a", dash: "35 65", offset: "-50", titulo: "Content: 35%" },
  { color: "#6b4926", dash: "15 85", offset: "-85", titulo: "Content: 15%" },
];

function GraficoLineas() {
  return (
    <Tarjeta>
      <Lineas series={series} meses={meses} alto={120} formato={(s, m, v) => `${m}: ${(v * 100).toLocaleString("en-US")}`} />
      <Leyenda className="mt-2" items={series.map((s) => ({ nombre: "Content", color: s.color }))} />
    </Tarjeta>
  );
}

export default function Inbox() {
  const router = useRouter();
  const [perStatus, setPerStatus] = useState("Semana");
  const [perVentas, setPerVentas] = useState("Semana");

  return (
    <Pagina>
      <View>
        <TituloSeccion titulo="Tus Pedidos" enlace="Ver Todos" href="/dashboard/bandeja/pedidos" />
        <TablaPedidos pedidos={pedidos} onFila={(p) => router.push({ pathname: "/dashboard/bandeja/pedidos/[id]", params: { id: p.id } })} />
      </View>

      <View>
        <TituloSeccion titulo="Indicadores" enlace="Mas Detalle" href="/dashboard/finanzas/indicadores" />
        <View className="mt-4 gap-6">
          <Tarjeta>
            <CabeceraGrafico titulo="Status De Pedidos">
              <FiltroPeriodo valor={perStatus} onCambio={setPerStatus} />
            </CabeceraGrafico>
            <Cifra valor={formatearPeriodo(5000, perStatus)} sub="50 Orders" />
            <View className="mt-4">
              <Dona segmentos={DONA} />
            </View>
          </Tarjeta>

          <Tarjeta>
            <CabeceraGrafico titulo="Ventas">
              <FiltroPeriodo valor={perVentas} onCambio={setPerVentas} />
            </CabeceraGrafico>
            <Cifra valor={formatearPeriodo(5000, perVentas)} sub="50 Orders" />
            <View className="mt-6">
              <Barras valores={barrasVentas} formato={(h) => `$${formatearPeriodo(h * 100, perVentas)}`} ejeX={["q1", "q2", "q3", "q4"]} />
            </View>
            <Leyenda items={[{ nombre: "Content", color: "#9eaa31" }]} />
          </Tarjeta>

          <GraficoLineas />
          <GraficoLineas />
        </View>
      </View>
    </Pagina>
  );
}
