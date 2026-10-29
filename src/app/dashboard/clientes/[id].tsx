import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import { StatusChip } from "@/components/dashboard/tabla-pedidos";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { buscarCliente, esRecurrente, pesos, totalComprado } from "@/lib/clientes";
import { imagen } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import { TELEFONO, UBICACION } from "../bandeja/pedidos/[id]";
import { ChipRecurrente } from "./index";

// Detalle de un cliente: datos de contacto, qué pidió, cuándo y hacia dónde
export default function ClientDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const cliente = buscarCliente(id);

  if (!cliente) {
    return (
      <Pagina>
        <TituloSeccion titulo="Cliente no encontrado" enlace="Volver Atras" href="/dashboard/clientes" />
      </Pagina>
    );
  }

  const stats = [
    { k: "Pedidos", v: String(cliente.pedidos.length) },
    { k: "Comprado", v: pesos(totalComprado(cliente)) },
    { k: "Cliente desde", v: cliente.clienteDesde },
  ];

  return (
    <Pagina>
      <TituloSeccion titulo="Detalles del Cliente" enlace="Volver Atras" href="/dashboard/clientes" />

      <View style={SOMBRA.card} className="rounded-3xl bg-white p-5">
        <View className="flex-row items-center gap-4">
          <Image source={imagen(cliente.img)} accessibilityLabel={cliente.nombre} contentFit="cover" style={{ width: 64, height: 64, borderRadius: 32 }} />
          <View className="min-w-0 flex-1">
            <Texto className="font-sans text-xl font-semibold text-neutral-900">{cliente.nombre}</Texto>
            <Texto className="text-sm text-neutral-500">{cliente.tipo} · {cliente.lugar}</Texto>
            {esRecurrente(cliente) && (
              <View className="mt-2 self-start">
                <ChipRecurrente grande />
              </View>
            )}
          </View>
        </View>

        <View className="mt-5 gap-3">
          <View className="flex-row items-center gap-3">
            <Icono d={TELEFONO} size={20} color="#878c83" />
            <Texto className="text-sm text-neutral-700">{cliente.telefono}</Texto>
          </View>
          <View className="flex-row items-center gap-3">
            <Icono d={ICONOS.correo} size={20} color="#878c83" />
            <Texto className="text-sm text-neutral-700">{cliente.correo}</Texto>
          </View>
          <View className="flex-row items-center gap-3">
            <Icono d={UBICACION} circulos={[[12, 10, 3]]} size={20} color="#878c83" />
            <Texto className="flex-1 text-sm text-neutral-700">{cliente.direccion}</Texto>
          </View>
        </View>

        <View className="mt-5 flex-row gap-3">
          {stats.map((s) => (
            <View key={s.k} className="flex-1 rounded-2xl bg-neutral-100 px-3 py-3">
              <Texto className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">{s.k}</Texto>
              <Texto className="mt-1 font-sans text-sm font-bold text-neutral-900">{s.v}</Texto>
            </View>
          ))}
        </View>
      </View>

      <View>
        <Texto className="font-sans text-xl font-semibold text-[#3F443D]">Lo que ha pedido</Texto>
        <View className="mt-4 gap-4">
          {cliente.pedidos.map((p) => (
            <Pressable key={p.id} accessibilityRole="link" accessibilityLabel={`Ver pedido ${p.id}`} onPress={() => router.push({ pathname: "/dashboard/bandeja/pedidos/[id]", params: { id: p.id } })} style={SOMBRA.card} className="rounded-[1.5rem] bg-white p-4 active:bg-primary-400/10">
              <View className="flex-row items-start justify-between gap-3">
                <View className="min-w-0 flex-1">
                  <Texto className="text-[15px] font-bold text-[#3F443D]">{p.descripcion}</Texto>
                  <Texto className="mt-0.5 text-xs text-neutral-500">{p.fecha} · Pedido #{p.id}</Texto>
                </View>
                <StatusChip status={p.estado} />
              </View>
              <View className="mt-3 flex-row items-center gap-2">
                <Icono d={ICONOS.pin} size={14} color="#878c83" relleno />
                <Texto numberOfLines={1} className="flex-1 text-xs text-neutral-600">Hacia: {p.destino}</Texto>
              </View>
              <View className="mt-3 flex-row items-center justify-between border-t border-neutral-100 pt-3">
                <Texto className="text-xs uppercase tracking-wide text-neutral-400">Total</Texto>
                <Texto className="font-sans text-base font-bold text-neutral-900">{pesos(p.total)}</Texto>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </Pagina>
  );
}
