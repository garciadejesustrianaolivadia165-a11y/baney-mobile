import { Linking, Pressable, View } from "react-native";
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

      {/* Llegada y recorrido */}
      <View style={SOMBRA.card} className="rounded-[1.75rem] bg-white p-5">
        <View className="flex-row items-center justify-between gap-3">
          <View className="min-w-0 flex-1">
            <Texto className="font-sans text-[22px] font-bold text-primary-600">{enCamino ? `Llega en ${llegadaMin} min` : estado}</Texto>
            {enCamino && <Texto className="font-sans text-sm font-semibold text-neutral-500">{km} km restantes</Texto>}
          </View>
          <View className={`rounded-full px-3 py-1 ${fondo}`}>
            <Texto className={`text-xs font-semibold ${color}`}>{estado}</Texto>
          </View>
        </View>
        <Texto className="mt-1.5 font-sans text-sm leading-relaxed text-neutral-500">
          {pedido.estado === "COMPLETADO" ? "El pedido ya fue entregado al cliente." : pedido.estado === "NUEVO" ? "Acepta el pedido para asignar un transportista." : enCamino ? "Ruta más rápida ahora debido a las condiciones del tráfico." : "Este pedido no sigue en camino."}
        </Texto>

        <View className="mt-6 justify-center">
          <View className="h-3 w-full rounded-full bg-[#dfe3d3]" />
          <View className="absolute left-0 h-3 rounded-full bg-primary-600" style={{ width: `${Math.max(avance, 6)}%` }} />
          <Image source={IMAGENES["/images/image_rutas/liner.png"]} contentFit="contain" style={{ position: "absolute", left: `${Math.min(Math.max(avance - 8, 0), 84)}%`, width: 56, height: 56 }} />
        </View>
        <Texto className="mt-2 text-right text-xs text-neutral-400">{avance}% del recorrido</Texto>

        <View className="my-5 h-px bg-neutral-200" />

        <View className="gap-1">
          <View className="flex-row items-center gap-4">
            <Image source={IMAGENES["/images/image_rutas/from_icon.png"]} contentFit="contain" style={{ width: 40, height: 40 }} />
            <View className="flex-1 rounded-full border border-neutral-300 px-5 py-3">
              <Texto numberOfLines={1} className="text-center font-sans text-sm font-semibold text-primary-600">{origen}</Texto>
            </View>
          </View>
          <View className="ml-[19px] h-5 justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <View key={i} className="h-1 w-1 rounded-full bg-primary-700" />
            ))}
          </View>
          <View className="flex-row items-center gap-4">
            <Image source={IMAGENES["/images/image_rutas/where_icon.png"]} contentFit="contain" style={{ width: 40, height: 40 }} />
            <View className="flex-1 rounded-full border border-neutral-300 px-3 py-3">
              <Texto numberOfLines={1} className="text-center font-sans text-sm font-semibold text-primary-600">{pedido.destino}</Texto>
            </View>
          </View>
        </View>
      </View>

      {/* Transportista */}
      <View style={SOMBRA.card} className="rounded-[1.75rem] bg-white p-5">
        <Texto className="font-sans text-lg font-semibold text-[#3F443D]">Transportista</Texto>
        <View className="mt-3 flex-row items-center gap-3">
          <Image source={imagen(transportista.avatar)} accessibilityLabel={transportista.nombre} contentFit="cover" style={{ width: 52, height: 52, borderRadius: 26 }} />
          <View className="min-w-0 flex-1">
            <Texto className="font-sans text-[17px] font-semibold text-neutral-900">{transportista.nombre}</Texto>
            <Texto className="text-sm text-neutral-500">{transportista.vehiculo} · Placa {transportista.placa}</Texto>
          </View>
          <View className="flex-row items-center gap-1 rounded-full bg-[#F7F3E9] px-3 py-1.5">
            <Icono d={ICONOS.estrella} size={14} color="#3F3A28" relleno />
            <Texto className="text-[13px] font-bold text-[#3F3A28]">{transportista.calificacion.toFixed(1)}</Texto>
          </View>
        </View>
        <View className="mt-4 flex-row gap-3">
          <BotonPill color="#364a2d" textoColor="#fdf8f0" onPress={() => Linking.openURL(`tel:${transportista.telefono}`)} className="flex-1 py-3" sinSombra>
            {(pressed) => (
              <View className="flex-row items-center gap-2">
                <Icono d={TELEFONO} size={16} color={pressed ? "#364a2d" : "#fdf8f0"} />
                <Texto className="font-sans text-sm font-semibold" style={{ color: pressed ? "#364a2d" : "#fdf8f0" }}>Llamar</Texto>
              </View>
            )}
          </BotonPill>
          <BotonPill color="#364a2d" variante="borde" textoColor="#364a2d" onPress={() => Linking.openURL(`sms:${transportista.telefono}`)} className="flex-1 py-3" sinSombra>
            {(pressed) => (
              <View className="flex-row items-center gap-2">
                <Icono d={ICONOS.mensaje} size={16} color={pressed ? "#fff" : "#364a2d"} />
                <Texto className="font-sans text-sm font-semibold" style={{ color: pressed ? "#fff" : "#364a2d" }}>Mensaje</Texto>
              </View>
            )}
          </BotonPill>
        </View>
      </View>

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
