import { View } from "react-native";
import { useRouter } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import TablaPedidos from "@/components/dashboard/tabla-pedidos";
import BotonPill from "@/components/movil/boton-pill";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { aceptarPedido, cancelarPedido, completarPedido, filaPedido, rechazarPedido, usePedidosProveedor, type PedidoProveedor } from "@/lib/pedidos-proveedor";
import { DatosCliente, MapaPedido } from "../bandeja/pedidos/[id]";

/** Botonera de un pedido según su estado: Ver detalles + Aceptar/Rechazar (nuevo) o Entregado/Cancelar (en proceso) */
export function AccionesOrden({ pedido, onDetalles }: { pedido: PedidoProveedor; onDetalles: () => void }) {
  return (
    <View className="flex-row flex-wrap justify-end gap-3">
      <BotonPill color="#afc79f" textoColor="#1e2a19" onPress={onDetalles} className="px-6 py-2.5" textClassName="text-sm" sinSombra>
        Ver detalles
      </BotonPill>
      {pedido.estado === "NUEVO" && (
        <>
          <BotonPill color="#059669" onPress={() => aceptarPedido(pedido.id)} className="px-6 py-2.5" textClassName="text-sm" sinSombra>
            Aceptar orden
          </BotonPill>
          <BotonPill color="#f87171" variante="borde" textoColor="#ef4444" onPress={() => rechazarPedido(pedido.id)} className="px-6 py-2.5" textClassName="text-sm" sinSombra>
            Rechaza orden
          </BotonPill>
        </>
      )}
      {pedido.estado === "EN PROCESO" && (
        <>
          <BotonPill color="#059669" onPress={() => completarPedido(pedido.id)} className="px-6 py-2.5" textClassName="text-sm" sinSombra>
            Marcar entregado
          </BotonPill>
          <BotonPill color="#f87171" variante="borde" textoColor="#ef4444" onPress={() => cancelarPedido(pedido.id)} className="px-6 py-2.5" textClassName="text-sm" sinSombra>
            Cancelar orden
          </BotonPill>
        </>
      )}
    </View>
  );
}

// Rutas: los pedidos que van en camino. El primero se muestra con su mapa; la
// tabla lista el resto y cada fila abre el detalle de ruta.
export default function RoutesList() {
  const router = useRouter();
  const enCamino = usePedidosProveedor().filter((p) => p.estado === "EN PROCESO");
  const principal = enCamino[0];

  return (
    <Pagina>
      <TituloSeccion titulo="Rutas en curso" enlace="Volver Atras" href="/dashboard" />

      {principal ? (
        <View style={SOMBRA.card} className="rounded-3xl bg-white p-2">
          <MapaPedido alto={300} destino={principal.cliente.nombre.toUpperCase()} direccion={principal.destino.split(",")[0]} ciudad={principal.destino.split(",").slice(1).join(",").trim() || "República Dominicana"} />
          <View className="gap-6 px-3 py-6">
            <DatosCliente titulo="Pedido de" redondo={false} cliente={principal.cliente} estado={principal.estado} />
            <AccionesOrden pedido={principal} onDetalles={() => router.push({ pathname: "/dashboard/rutas/[pedidoId]", params: { pedidoId: principal.id } })} />
          </View>
        </View>
      ) : (
        <View style={SOMBRA.card} className="rounded-3xl bg-white p-6">
          <Texto className="text-sm text-neutral-500">No hay pedidos en camino. Acepta un pedido nuevo desde la Bandeja de entrada para verlo aquí.</Texto>
        </View>
      )}

      {enCamino.length > 0 && <TablaPedidos pedidos={enCamino.map(filaPedido)} onFila={(p) => router.push({ pathname: "/dashboard/rutas/[pedidoId]", params: { pedidoId: p.id } })} />}
    </Pagina>
  );
}
