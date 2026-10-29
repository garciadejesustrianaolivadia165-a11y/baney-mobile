import { View } from "react-native";
import { useRouter } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import TablaPedidos from "@/components/dashboard/tabla-pedidos";
import BotonPill from "@/components/movil/boton-pill";
import { SOMBRA } from "@/lib/estilos";
import { DatosCliente, MapaPedido } from "../bandeja/pedidos/[id]";

const IMG = "/images/image_home";

const pedidos = [
  { id: "00242772362", cliente: "Cesar Valdez", fecha: "25/2/2026", img: `${IMG}/image_home_09.png`, status: "COMPLETADO", descripcion: "Plátanos Banilejos 12 Dz", precio: "$ 135,000.00" },
  { id: "00242772363", cliente: "Mini-Market Manolo", fecha: "25/2/2026", img: `${IMG}/image_home_12.png`, status: "EN PROCESO", descripcion: "Pimientos Importados", precio: "$ 5,000.00" },
  { id: "00242772364", cliente: "Mini-Market Manolo", fecha: "25/2/2026", img: `${IMG}/image_home_12.png`, status: "COMPLETADO", descripcion: "Pimientos Importados", precio: "$ 5,000.00" },
  { id: "00242772365", cliente: "Mini-Market Manolo", fecha: "25/2/2026", img: `${IMG}/image_home_12.png`, status: "EN PROCESO", descripcion: "Pimientos Importados", precio: "$ 5,000.00" },
];

/** Botonera "Ver detalles · Aceptar orden · Rechaza orden" de las rutas */
export function AccionesOrden({ onDetalles }: { onDetalles: () => void }) {
  return (
    <View className="flex-row flex-wrap justify-end gap-3">
      <BotonPill color="#afc79f" textoColor="#1e2a19" onPress={onDetalles} className="px-6 py-2.5" textClassName="text-sm" sinSombra>
        Ver detalles
      </BotonPill>
      <BotonPill color="#059669" className="px-6 py-2.5" textClassName="text-sm" sinSombra>
        Aceptar orden
      </BotonPill>
      <BotonPill color="#f87171" variante="borde" textoColor="#ef4444" className="px-6 py-2.5" textClassName="text-sm" sinSombra>
        Rechaza orden
      </BotonPill>
    </View>
  );
}

export default function RoutesList() {
  const router = useRouter();

  return (
    <Pagina>
      <TituloSeccion titulo="Detalles De Pedido" enlace="Volver Atras" href="/home" />

      <View style={SOMBRA.card} className="rounded-3xl bg-white p-2">
        <MapaPedido alto={420} destino="WAYNE MANOR" etiqueta="Destination" />
        <View className="gap-6 px-3 py-6">
          <DatosCliente titulo="Pedido de" redondo={false} />
          <AccionesOrden onDetalles={() => router.push({ pathname: "/dashboard/bandeja/pedidos/[id]", params: { id: "00242772362" } })} />
        </View>
      </View>

      <TablaPedidos pedidos={pedidos} onFila={(p) => router.push({ pathname: "/dashboard/rutas/[pedidoId]", params: { pedidoId: p.id } })} />
    </Pagina>
  );
}
