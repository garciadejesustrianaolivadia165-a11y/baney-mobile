import { useState } from "react";
import { View } from "react-native";

import { formatearPeriodo as formatear } from "@/components/dashboard/filtro-periodo";
import { TarjetaTotal } from "@/components/dashboard/graficos";
import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import { GraficoPedidos, GraficoStatus, GraficoTotalReal, GraficoVentas, TARJETAS_TOTALES } from "./index";

export default function FinanceIndicators() {
  const [perVentas, setPerVentas] = useState("Mes");
  const [perPedidos, setPerPedidos] = useState("Mes");
  const [perArea, setPerArea] = useState("Año");
  const [perStatus, setPerStatus] = useState("Mes");

  return (
    <Pagina>
      <TituloSeccion titulo="Indicadores" enlace="Volver Atrás" href="/dashboard/finanzas" />
      <View className="gap-6">
        {TARJETAS_TOTALES.map((t) => (
          <TarjetaTotal key={t.label} {...t} />
        ))}
      </View>
      <GraficoVentas titulo="Ventas" periodo={perVentas} onPeriodo={setPerVentas} leyenda="Content" />
      <GraficoPedidos periodo={perPedidos} onPeriodo={setPerPedidos} />
      <GraficoTotalReal periodo={perArea} onPeriodo={setPerArea} />
      <GraficoStatus periodo={perStatus} onPeriodo={setPerStatus} cifra={formatear(328, perStatus)} />
    </Pagina>
  );
}
