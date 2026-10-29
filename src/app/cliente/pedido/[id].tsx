import { View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { imagen } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import { buscarPedidoCliente, pesos, subtotalPedido, totalPedido } from "@/lib/pedidos-cliente";
import { MapaPedido } from "../../dashboard/bandeja/pedidos/[id]";

// Detalle de un pedido del cliente: misma tarjeta de "Detalles De Pedido" del proveedor
export default function PedidoCliente() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pedido = buscarPedidoCliente(id);

  if (!pedido) {
    return (
      <Pagina>
        <TituloSeccion titulo="Pedido no encontrado" enlace="Volver" href="/cliente/historial" />
      </Pagina>
    );
  }

  const resumen = [
    { label: "ID transacción", valor: `#${pedido.id}` },
    ...pedido.items.map((i) => ({ label: i.nombre, valor: pesos(i.precio) })),
    { label: "Costo subtotal", valor: pesos(subtotalPedido(pedido)) },
    { label: "ITBIS", valor: pesos(pedido.itbis) },
    { label: "Envío", valor: pesos(pedido.envio) },
  ];

  return (
    <Pagina>
      <TituloSeccion titulo="Detalles De Pedido" enlace="Volver Atras" href="/cliente/historial" />

      <View style={SOMBRA.card} className="rounded-3xl bg-white p-2 pb-8">
        <MapaPedido destino={pedido.proveedor.nombre.toUpperCase()} etiqueta="Proveedor" chipColor="#364a2d" />

        <View className="gap-5 px-4 pt-6">
          <View className="flex-row items-center justify-between">
            <Texto className="font-sans text-lg font-semibold text-[#3F443D]">Pedido #{pedido.id}</Texto>
            <View className={`rounded-full px-3 py-1 ${pedido.estado === "Entregado" ? "bg-success-100" : pedido.estado === "Cancelado" ? "bg-error-200" : "bg-warning-200"}`}>
              <Texto className={`text-xs font-semibold ${pedido.estado === "Entregado" ? "text-success-700" : pedido.estado === "Cancelado" ? "text-error-700" : "text-warning-800"}`}>{pedido.estado}</Texto>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <Image source={imagen(pedido.proveedor.img)} accessibilityLabel={pedido.proveedor.nombre} contentFit="cover" style={{ width: 48, height: 48, borderRadius: 24 }} />
            <View>
              <Texto className="font-sans text-xl font-semibold text-neutral-900">{pedido.proveedor.nombre}</Texto>
              <Texto className="text-sm text-neutral-500">{pedido.proveedor.lugar} · {pedido.fecha}</Texto>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <Icono d={ICONOS.pin} size={20} color="#878c83" relleno />
            <Texto className="text-sm text-neutral-700">Entregar en: {pedido.direccion}</Texto>
          </View>
        </View>

        <View className="mt-8 gap-10 px-4">
          <View className="gap-5">
            {pedido.items.map((item, i) => (
              <View key={i} className="flex-row items-center gap-4 rounded-2xl bg-neutral-100 p-3 pr-5">
                <Image source={imagen(item.img)} accessibilityLabel={item.nombre} contentFit="cover" style={{ width: 72, height: 72, borderRadius: 12 }} />
                <View className="min-w-0 flex-1">
                  <Texto numberOfLines={2} className="font-sans text-base font-semibold text-neutral-900">{item.nombre}</Texto>
                  <Texto className="text-sm text-neutral-500"><Texto className="text-sm font-medium text-primary-500">{item.categoria}</Texto> · {item.cantidad}</Texto>
                  <Texto className="mt-1 font-sans text-lg font-bold text-neutral-900">{pesos(item.precio)}</Texto>
                </View>
              </View>
            ))}
          </View>

          <View className="w-full max-w-72 self-center">
            <View className="gap-4">
              {resumen.map((r, i) => (
                <View key={i} className="flex-row items-center justify-between">
                  <Texto className="text-xs uppercase tracking-wide text-neutral-500">{r.label}</Texto>
                  <Texto className="text-sm font-semibold text-neutral-900">{r.valor}</Texto>
                </View>
              ))}
            </View>
            <View className="mt-4 flex-row items-center justify-between border-t-2 border-neutral-800 pt-4">
              <Texto className="text-xs font-semibold uppercase tracking-wide text-neutral-700">Total</Texto>
              <Texto className="font-sans text-base font-bold text-neutral-900">{pesos(totalPedido(pedido))}</Texto>
            </View>
          </View>

          <View className="flex-row gap-3">
            <BotonPill color="#364a2d" textoColor="#fdf8f0" onPress={() => router.push("/cliente")} className="flex-1 py-3" textClassName="font-sans text-sm" sinSombra>
              Pedir de nuevo
            </BotonPill>
            {pedido.estado === "En camino" && (
              <BotonPill color="#f87171" variante="borde" textoColor="#ef4444" className="px-5 py-3" textClassName="font-sans text-sm" sinSombra>
                Cancelar
              </BotonPill>
            )}
          </View>
        </View>
      </View>
    </Pagina>
  );
}
