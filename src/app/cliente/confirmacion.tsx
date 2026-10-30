import { View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";

import PasosCheckout from "@/components/checkout/pasos-checkout";
import ResumenCompra from "@/components/checkout/resumen-compra";
import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { imagen } from "@/lib/imagenes";
import { buscarPedidoCliente, pesos, subtotalPedido, usePedidosCliente } from "@/lib/pedidos-cliente";

// 06 · Confirmación: pedido creado, resumen y accesos al detalle o al marketplace.
export default function Confirmacion() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  usePedidosCliente();
  const pedido = buscarPedidoCliente(id);

  if (!pedido) {
    return (
      <Pagina>
        <TituloSeccion titulo="Pedido no encontrado" enlace="Ir al marketplace" href="/cliente" />
      </Pagina>
    );
  }

  const datos = [
    { k: "Proveedor", v: pedido.proveedor.nombre },
    { k: "Entrega", v: pedido.entrega === "Recoger en la finca" ? pedido.direccion : `Transporte BANEY · ${pedido.direccion}` },
    { k: "Pago", v: pedido.metodoPago ?? "—" },
    { k: "Llega", v: pedido.entrega === "Recoger en la finca" ? "Listo para recoger mañana" : "Entre 24 y 48 horas" },
  ];

  return (
    <Pagina>
      <PasosCheckout actual={3} />

      <View className="items-center gap-3 pt-2">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-success-100">
          <Icono d={ICONOS.check} size={36} color="#15803d" strokeWidth={2.5} />
        </View>
        <Texto className="text-center font-sans text-2xl font-bold text-neutral-900">¡Pedido confirmado!</Texto>
        <Texto className="text-center text-sm leading-relaxed text-neutral-600">
          Tu pedido <Texto className="text-sm font-bold text-neutral-900">#{pedido.id}</Texto> ya está con el proveedor. Te avisaremos por notificación en cada paso.
        </Texto>
      </View>

      <View style={SOMBRA.card} className="rounded-[1.5rem] bg-white p-5">
        <View className="gap-3">
          {pedido.items.map((i, n) => (
            <View key={n} className="flex-row items-center gap-3">
              <Image source={imagen(i.img)} accessibilityLabel={i.nombre} contentFit="cover" style={{ width: 52, height: 52, borderRadius: 12 }} />
              <View className="min-w-0 flex-1">
                <Texto numberOfLines={1} className="font-sans text-[14px] font-semibold text-neutral-900">{i.nombre}</Texto>
                <Texto className="text-[12px] text-neutral-500">{i.cantidad}</Texto>
              </View>
              <Texto className="text-[14px] font-bold text-neutral-900">{pesos(i.precio)}</Texto>
            </View>
          ))}
        </View>
        <View className="mt-4 gap-2.5 border-t border-neutral-200 pt-4">
          {datos.map((d) => (
            <View key={d.k} className="flex-row items-start justify-between gap-4">
              <Texto className="text-[12px] uppercase tracking-wide text-neutral-500">{d.k}</Texto>
              <Texto className="flex-1 text-right text-[13px] font-semibold text-neutral-900">{d.v}</Texto>
            </View>
          ))}
        </View>
      </View>

      <ResumenCompra subtotal={subtotalPedido(pedido)} itbis={pedido.itbis} envio={pedido.envio} titulo="Total pagado" />

      <View className="gap-3">
        <BotonPill color="#364a2d" textoColor="#fdf8f0" onPress={() => router.replace({ pathname: "/cliente/pedido/[id]", params: { id: pedido.id } })} className="w-full py-4" textClassName="font-sans text-[15px] font-semibold">
          Ver mi pedido
        </BotonPill>
        <BotonPill color="#364a2d" variante="borde" textoColor="#364a2d" onPress={() => router.replace("/cliente")} className="w-full py-3.5" textClassName="font-sans text-[15px] font-semibold" sinSombra>
          Seguir comprando
        </BotonPill>
      </View>
    </Pagina>
  );
}
