import { Linking, Pressable, View } from "react-native";
import { TarjetaContacto, TarjetaLlegada } from "@/components/transporte/tarjetas-ruta";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import ItemProducto from "@/components/item-producto";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { pesosRD, totalPedido, usePedidosProveedor } from "@/lib/pedidos-proveedor";
import { buscarPedidoEnCurso } from "@/lib/rutas";
import { MapaPedido, TELEFONO, UBICACION } from "../bandeja/pedidos/[id]";
import { AccionesOrden } from "./index";

const ESTADO: Record<string, [string, string, string]> = {
  "EN PROCESO": ["bg-warning-200", "text-warning-800", "En camino"],
  COMPLETADO: ["bg-success-100", "text-success-700", "Entregado"],
  NUEVO: ["bg-[#E3F0FF]", "text-[#1d4ed8]", "Por aceptar"],
  RECHAZADO: ["bg-error-200", "text-error-700", "Rechazado"],
  CANCELADO: ["bg-neutral-200", "text-neutral-600", "Cancelado"],
};

// Detalle de un pedido en curso (Rutas): mapa, hora de llegada, transportista con
// llamada y mensaje, cliente, producto y acciones. En teléfono todo va en tarjetas
// apiladas bajo el mapa (el panel flotante de la web no cabe sobre un mapa nativo).
export default function RouteDetail() {
  const { pedidoId } = useLocalSearchParams<{ pedidoId: string }>();
  const router = useRouter();
  usePedidosProveedor();
  const enCurso = buscarPedidoEnCurso(pedidoId);

  if (!enCurso) {
    return (
      <Pagina>
        <TituloSeccion titulo="Pedido no encontrado" enlace="Volver Atras" href="/dashboard/rutas" />
      </Pagina>
    );
  }

  const { pedido, transportista, origen, llegadaMin, km } = enCurso;
  const { cliente, avance } = pedido;
  const [fondo, color, estado] = ESTADO[pedido.estado] ?? ESTADO["EN PROCESO"];
  const enCamino = pedido.estado === "EN PROCESO";

  return (
    <Pagina>
      <TituloSeccion titulo={`Pedido #${pedido.id}`} enlace="Volver Atras" href="/dashboard/rutas" />

      {/* Mapa con el destino (vista previa, no captura el scroll) */}
      <View style={SOMBRA.card} className="rounded-3xl bg-white p-2">
        <MapaPedido alto={240} destino={cliente.nombre.toUpperCase()} />
      </View>

      <TarjetaLlegada titulo={enCamino ? `Llega en ${llegadaMin} min` : estado} detalle={enCamino ? `${km} km restantes` : undefined} chip={{ texto: estado, fondo, color }} avance={avance} origen={origen} destino={pedido.destino} />
      <Texto className="-mt-3 px-2 text-xs text-neutral-500">
        {pedido.estado === "COMPLETADO" ? "El pedido ya fue entregado al cliente." : pedido.estado === "NUEVO" ? "Acepta el pedido para asignar un transportista." : enCamino ? "Ruta más rápida ahora debido a las condiciones del tráfico." : "Este pedido no sigue en camino."}
      </Texto>

      <TarjetaContacto persona={transportista} />

      {/* Cliente y producto */}
      <View style={SOMBRA.card} className="rounded-[1.75rem] bg-white p-5">
        <Texto className="font-sans text-lg font-semibold text-[#3F443D]">Pedido de</Texto>
        <Pressable accessibilityRole="link" accessibilityLabel={`Ver cliente ${cliente.nombre}`} onPress={() => router.push({ pathname: "/dashboard/clientes/[id]", params: { id: cliente.id } })} className="mt-3 flex-row items-center gap-3 active:opacity-70">
          <Image source={imagen(cliente.img)} accessibilityLabel={cliente.nombre} contentFit="cover" style={{ width: 48, height: 48, borderRadius: 12 }} />
          <View className="min-w-0 flex-1">
            <Texto className="font-sans text-[17px] font-semibold text-neutral-900">{cliente.nombre}</Texto>
            <Texto className="text-sm text-neutral-500">{cliente.tipo} · {pedido.fecha}</Texto>
          </View>
          <Icono d={ICONOS.chevron} size={16} color="#B9C0CB" strokeWidth={1.6} />
        </Pressable>
        <View className="mt-4 gap-3">
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(`tel:${cliente.telefono.replace(/\D/g, "")}`)} className="flex-row items-center gap-3">
            <Icono d={TELEFONO} size={20} color="#878c83" />
            <Texto className="text-sm text-neutral-700">{cliente.telefono}</Texto>
          </Pressable>
          <View className="flex-row items-center gap-3">
            <Icono d={UBICACION} circulos={[[12, 10, 3]]} size={20} color="#878c83" />
            <Texto className="flex-1 text-sm text-neutral-700">{pedido.destino}</Texto>
          </View>
        </View>

        <View className="mt-5 gap-3">
          {pedido.items.map((item, i) => (
            <ItemProducto key={`${item.nombre}-${i}`} img={item.img} nombre={item.nombre} categoria={item.categoria} detalle={item.cantidad} precio={pesosRD(item.precio)} />
          ))}
        </View>
        <View className="mt-4 flex-row items-center justify-between border-t-2 border-neutral-800 pt-3">
          <Texto className="text-xs font-semibold uppercase tracking-wide text-neutral-700">Total</Texto>
          <Texto className="font-sans text-base font-bold text-neutral-900">{pesosRD(totalPedido(pedido))}</Texto>
        </View>
      </View>

      <AccionesOrden pedido={pedido} onDetalles={() => router.push({ pathname: "/dashboard/bandeja/pedidos/[id]", params: { id: pedido.id } })} />
    </Pagina>
  );
}
