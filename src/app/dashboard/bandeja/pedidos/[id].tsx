import { useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import { StatusChip } from "@/components/dashboard/tabla-pedidos";
import ItemProducto from "@/components/item-producto";
import Mapa from "@/components/mapa";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { useMisProductos } from "@/lib/mis-productos";
import { aceptarPedido, agregarItemPedido, buscarPedidoProveedor, cancelarPedido, completarPedido, pesosRD, quitarItemPedido, rechazarPedido, subtotalPedido, totalPedido, usePedidosProveedor, type PedidoProveedor } from "@/lib/pedidos-proveedor";

export const TELEFONO = "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z";
export const UBICACION = "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z";

/** Mapa con la dirección y el chip de destino (lo comparten pedidos y rutas) */
export function MapaPedido({ alto = 288, destino = "MELLOS'S COLMADO", etiqueta = "Destino", chipColor = "#20221f", direccion = "Calle Juan Horacio #16", ciudad = "Santo Domingo, Republica Dominicana" }: { alto?: number; destino?: string; etiqueta?: string; chipColor?: string; direccion?: string; ciudad?: string }) {
  return (
    <View style={{ height: alto }} className="overflow-hidden rounded-[1.25rem] bg-neutral-200">
      {/* Vista previa: sin gestos, para que el mapa nativo no se quede con el scroll de la página */}
      <View pointerEvents="none" className="flex-1">
        <Mapa />
      </View>
      <View pointerEvents="none" className="absolute left-6 right-6 top-6 items-end rounded-2xl bg-white/75 px-4 py-2">
        <Texto numberOfLines={1} className="text-xl font-bold text-neutral-900">{direccion}</Texto>
        <Texto numberOfLines={1} className="text-sm text-neutral-500">{ciudad}</Texto>
      </View>
      <View pointerEvents="none" style={SOMBRA.boton} className="absolute bottom-6 left-6 flex-row items-center gap-3 rounded-full bg-white py-2 pl-2 pr-6">
        <View className="h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: chipColor }}>
          <Icono d={ICONOS.pin} size={16} color="#fff" relleno />
        </View>
        <View>
          <Texto className="text-[10px] uppercase tracking-wide text-neutral-400">{etiqueta}</Texto>
          <Texto className="text-sm font-bold tracking-wide text-neutral-900">{destino}</Texto>
        </View>
      </View>
    </View>
  );
}

const CLIENTE_DEMO = { id: "cesar-valdez", nombre: "Cesar Valdez", img: "/images/image_home/image_home_09.png", telefono: "(809) 000-0000", direccion: "Barrio Los Minas, San Juan de la Maguana", tipo: "Comprador particular" };

/** Bloque "Pedido de · Cesar Valdez · teléfono · dirección" */
export function DatosCliente({ titulo, redondo = true, cliente = CLIENTE_DEMO, estado }: { titulo: string; redondo?: boolean; cliente?: PedidoProveedor["cliente"]; estado?: string }) {
  const router = useRouter();
  return (
    <View className="gap-4">
      <View>
        <View className="flex-row items-center justify-between gap-3">
          <Texto className={redondo ? "font-sans text-lg font-semibold text-[#3F443D]" : "text-2xl font-bold text-neutral-900"}>{titulo}</Texto>
          {estado && <StatusChip status={estado} />}
        </View>
        <Pressable accessibilityRole="link" accessibilityLabel={`Ver cliente ${cliente.nombre}`} onPress={() => router.push({ pathname: "/dashboard/clientes/[id]", params: { id: cliente.id } })} className="mt-3 flex-row items-center gap-3 active:opacity-70">
          <Image source={imagen(cliente.img)} accessibilityLabel={cliente.nombre} contentFit="cover" style={{ width: 48, height: 48, borderRadius: redondo ? 24 : 12 }} />
          <View className="min-w-0 flex-1">
            <Texto className="font-sans text-xl font-semibold text-neutral-900">{cliente.nombre}</Texto>
            <Texto className="text-sm text-neutral-500">{cliente.tipo}</Texto>
          </View>
          <Icono d={ICONOS.chevron} size={16} color="#B9C0CB" strokeWidth={1.6} />
        </Pressable>
      </View>
      <View className="gap-3">
        <View className="flex-row items-center gap-3">
          <Icono d={TELEFONO} size={20} color="#878c83" />
          <Texto className="text-sm text-neutral-700">{cliente.telefono}</Texto>
        </View>
        <View className="flex-row items-center gap-3">
          <Icono d={UBICACION} circulos={[[12, 10, 3]]} size={20} color="#878c83" />
          <Texto className="flex-1 text-sm text-neutral-700">{cliente.direccion}</Texto>
        </View>
      </View>
    </View>
  );
}

/** Selector "Agregar ítems": los productos del catálogo del proveedor, un toque añade una unidad */
function SelectorProductos({ visible, onCerrar, onElegir }: { visible: boolean; onCerrar: () => void; onElegir: (p: { nombre: string; categoria: string; unidad: string; precio: number; img: string }) => void }) {
  const productos = useMisProductos().filter((p) => p.estado === "Publicado");
  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onCerrar}>
      <Pressable accessibilityLabel="Cerrar" onPress={onCerrar} className="flex-1 justify-end bg-black/50">
        <Pressable onPress={() => {}} style={SOMBRA.alta} className="max-h-[75%] rounded-t-[28px] bg-white px-5 pb-8 pt-4">
          <View className="mx-auto mb-4 h-[5px] w-12 rounded-full bg-[#E3E6E0]" />
          <Texto className="font-sans text-lg font-semibold text-[#3F443D]">Agregar ítems al pedido</Texto>
          <Texto className="mt-1 text-sm text-neutral-500">Toca un producto de tu catálogo para añadir una unidad.</Texto>
          <ScrollView className="mt-4" contentContainerClassName="gap-3" showsVerticalScrollIndicator={false}>
            {productos.map((p) => (
              <ItemProducto key={p.id} img={p.img} nombre={p.nombre} categoria={p.categoria} detalle={`${p.stock} ${p.unidad} disponibles`} precio={pesosRD(p.precio)} precioDetalle={`por ${p.unidad}`} onPress={() => onElegir(p)} derecha={<Icono d={ICONOS.mas} size={18} color="#3F443D" strokeWidth={2.2} />} />
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Detalles De Pedido del proveedor: lee el pedido real del almacén y sus acciones
// cambian el estado en inicio, bandeja y rutas.
export default function OrderDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  usePedidosProveedor();
  const pedido = buscarPedidoProveedor(id);
  const [eligiendo, setEligiendo] = useState(false);
  const [confirmarCancelar, setConfirmarCancelar] = useState(false);

  if (!pedido) {
    return (
      <Pagina>
        <TituloSeccion titulo="Pedido no encontrado" enlace="Volver Atras" href="/dashboard/bandeja" />
      </Pagina>
    );
  }

  const editable = pedido.estado === "NUEVO" || pedido.estado === "EN PROCESO";
  const resumen = [
    { label: "ID transacción", valor: `#${pedido.id}` },
    ...pedido.items.map((i) => ({ label: i.nombre, valor: pesosRD(i.precio) })),
    { label: "Costo subtotal", valor: pesosRD(subtotalPedido(pedido)) },
    { label: "ITBIS", valor: pesosRD(pedido.itbis) },
  ];

  return (
    <Pagina>
      <TituloSeccion titulo="Detalles De Pedido" enlace="Volver Atras" href="/dashboard/bandeja" />

      <View style={SOMBRA.card} className="rounded-3xl bg-white p-2 pb-8">
        <MapaPedido destino={pedido.cliente.nombre.toUpperCase()} direccion={pedido.destino.split(",")[0]} ciudad={pedido.destino.split(",").slice(1).join(",").trim() || "República Dominicana"} />

        <View className="gap-6 px-4 pt-6">
          <DatosCliente titulo={`Pedido #${pedido.id}`} cliente={pedido.cliente} estado={pedido.estado} />
          <Texto className="-mt-3 text-xs text-neutral-400">{pedido.fecha} · {pedido.hora} · Entregar en: {pedido.destino}</Texto>

          {pedido.estado === "NUEVO" && (
            <View className="flex-row gap-3">
              <BotonPill color="#059669" onPress={() => aceptarPedido(pedido.id)} className="flex-1 px-4 py-2.5" textClassName="font-sans text-sm" sinSombra>
                Aceptar orden
              </BotonPill>
              <BotonPill color="#f87171" variante="borde" textoColor="#ef4444" onPress={() => rechazarPedido(pedido.id)} className="flex-1 px-4 py-2.5" textClassName="font-sans text-sm" sinSombra>
                Rechazar orden
              </BotonPill>
            </View>
          )}
          {pedido.estado === "EN PROCESO" && (
            <View className="gap-3">
              <View className="flex-row gap-3">
                <BotonPill color="#afc79f" textoColor="#1e2a19" onPress={() => setEligiendo(true)} className="flex-1 px-4 py-2.5" textClassName="font-sans text-sm" sinSombra>
                  Agregar Ítems
                </BotonPill>
                <BotonPill color="#f87171" variante="borde" textoColor="#ef4444" onPress={() => setConfirmarCancelar((v) => !v)} className="flex-1 px-4 py-2.5" textClassName="font-sans text-sm" sinSombra>
                  Cancelar orden
                </BotonPill>
              </View>
              {confirmarCancelar && (
                <View className="rounded-2xl bg-error-50 p-4">
                  <Texto className="text-sm font-semibold text-error-700">¿Cancelar este pedido?</Texto>
                  <Texto className="mt-1 text-xs text-error-700/80">El cliente recibirá una notificación y el transportista será liberado.</Texto>
                  <View className="mt-3 flex-row gap-3">
                    <BotonPill color="#E9564F" onPress={() => { cancelarPedido(pedido.id); setConfirmarCancelar(false); }} className="flex-1 py-2" textClassName="text-xs font-semibold" sinSombra>
                      Sí, cancelar
                    </BotonPill>
                    <BotonPill color="#bdc1b9" variante="borde" textoColor="#4d5148" onPress={() => setConfirmarCancelar(false)} className="flex-1 py-2" textClassName="text-xs font-semibold" sinSombra>
                      No
                    </BotonPill>
                  </View>
                </View>
              )}
              <BotonPill color="#364a2d" variante="borde" textoColor="#364a2d" onPress={() => completarPedido(pedido.id)} className="w-full py-2.5" textClassName="font-sans text-sm" sinSombra>
                Marcar como entregado
              </BotonPill>
            </View>
          )}
          {(pedido.estado === "RECHAZADO" || pedido.estado === "CANCELADO" || pedido.estado === "COMPLETADO") && (
            <View className="rounded-2xl bg-neutral-100 p-4">
              <Texto className="text-sm text-neutral-600">
                {pedido.estado === "COMPLETADO" ? "Pedido entregado. Ya no admite cambios." : pedido.estado === "RECHAZADO" ? "Rechazaste este pedido; el cliente fue notificado." : "Este pedido fue cancelado."}
              </Texto>
            </View>
          )}
        </View>

        {/* Ítems + resumen */}
        <View className="mt-8 gap-10 px-4">
          <View className="gap-5">
            {pedido.items.map((item, i) => (
              <ItemProducto
                key={`${item.nombre}-${i}`}
                img={item.img}
                nombre={item.nombre}
                categoria={item.categoria}
                detalle={item.cantidad}
                precio={pesosRD(item.precio)}
                derecha={
                  editable && pedido.items.length > 1 ? (
                    <Pressable accessibilityRole="button" accessibilityLabel={`Quitar ${item.nombre}`} onPress={() => quitarItemPedido(pedido.id, i)} hitSlop={8} className="h-9 w-9 items-center justify-center rounded-full border border-error-200 active:bg-error-500">
                      {({ pressed }) => <Icono d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" size={16} color={pressed ? "#fff" : "#ef4444"} />}
                    </Pressable>
                  ) : undefined
                }
              />
            ))}
          </View>

          <View className="w-full max-w-72 self-center">
            <View className="gap-4">
              {resumen.map((r, i) => (
                <View key={i} className="flex-row items-center justify-between gap-4">
                  <Texto numberOfLines={1} className="flex-1 text-xs uppercase tracking-wide text-neutral-500">{r.label}</Texto>
                  <Texto className="text-sm font-semibold text-neutral-900">{r.valor}</Texto>
                </View>
              ))}
            </View>
            <View className="mt-4 flex-row items-center justify-between border-t-2 border-neutral-800 pt-4">
              <Texto className="text-xs font-semibold uppercase tracking-wide text-neutral-700">Total</Texto>
              <Texto className="font-sans text-base font-bold text-neutral-900">{pesosRD(totalPedido(pedido))}</Texto>
            </View>
          </View>

          {pedido.estado === "EN PROCESO" && (
            <BotonPill color="#364a2d" textoColor="#fdf8f0" onPress={() => router.push({ pathname: "/dashboard/rutas/[pedidoId]", params: { pedidoId: pedido.id } })} className="w-full py-3" textClassName="font-sans text-sm" sinSombra>
              Ver ruta y transportista
            </BotonPill>
          )}
        </View>
      </View>

      <SelectorProductos
        visible={eligiendo}
        onCerrar={() => setEligiendo(false)}
        onElegir={(p) => {
          agregarItemPedido(pedido.id, { nombre: p.nombre, categoria: p.categoria, cantidad: `1 ${p.unidad}`, precio: p.precio, img: p.img });
          setEligiendo(false);
        }}
      />
    </Pagina>
  );
}
