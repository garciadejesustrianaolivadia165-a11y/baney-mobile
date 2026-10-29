import { useState } from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import Texto from "@/components/ui/texto";
import { imagen } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import { PEDIDOS_CLIENTE, pesos, totalPedido, type PedidoCliente } from "@/lib/pedidos-cliente";

const CHIP: Record<PedidoCliente["estado"], [string, string]> = {
  Entregado: ["bg-success-100", "text-success-700"],
  "En camino": ["bg-warning-200", "text-warning-800"],
  Cancelado: ["bg-error-200", "text-error-700"],
};

// Historial del cliente: lo que ha pedido en el marketplace; cada pedido abre su detalle
export default function HistorialCliente() {
  const router = useRouter();
  const [tab, setTab] = useState<"Todos" | "En camino" | "Entregados" | "Cancelados">("Todos");
  const visibles = PEDIDOS_CLIENTE.filter((p) => tab === "Todos" || p.estado === (tab === "Entregados" ? "Entregado" : tab === "Cancelados" ? "Cancelado" : "En camino"));

  return (
    <Pagina>
      <TituloSeccion titulo="Mis pedidos" enlace="Ir al marketplace" href="/cliente" />

      <View className="flex-row gap-2">
        {(["Todos", "En camino", "Entregados", "Cancelados"] as const).map((t) => (
          <Pressable key={t} accessibilityRole="tab" accessibilityState={{ selected: tab === t }} onPress={() => setTab(t)} className={`rounded-full px-3.5 py-2 ${tab === t ? "bg-primary-600" : "bg-neutral-100"}`}>
            <Texto className={`text-xs font-semibold ${tab === t ? "text-white" : "text-neutral-600"}`}>{t}</Texto>
          </Pressable>
        ))}
      </View>

      <View className="gap-5">
        {visibles.map((p) => {
          const [fondo, color] = CHIP[p.estado];
          return (
            <Pressable key={p.id} accessibilityRole="button" accessibilityLabel={`Ver pedido ${p.id}`} onPress={() => router.push({ pathname: "/cliente/pedido/[id]", params: { id: p.id } })} style={SOMBRA.card} className="rounded-[1.5rem] bg-white p-4 active:bg-primary-400/10">
              <View className="flex-row items-center gap-3">
                <Image source={imagen(p.proveedor.img)} accessibilityLabel={p.proveedor.nombre} contentFit="cover" style={{ width: 44, height: 44, borderRadius: 22 }} />
                <View className="min-w-0 flex-1">
                  <Texto className="text-sm font-semibold text-neutral-900">{p.proveedor.nombre}</Texto>
                  <Texto className="text-xs text-neutral-500">{p.fecha}</Texto>
                </View>
                <View className={`rounded-full px-3 py-1 ${fondo}`}>
                  <Texto className={`text-xs font-semibold ${color}`}>{p.estado}</Texto>
                </View>
              </View>
              <View className="mt-4 flex-row gap-3">
                {p.items.map((i, k) => (
                  <Image key={k} source={imagen(i.img)} accessibilityLabel={i.nombre} contentFit="cover" style={{ width: 56, height: 56, borderRadius: 12 }} />
                ))}
                <View className="min-w-0 flex-1 justify-center">
                  <Texto numberOfLines={2} className="text-sm text-neutral-700">{p.items.map((i) => `${i.nombre} (${i.cantidad})`).join(", ")}</Texto>
                </View>
              </View>
              <View className="mt-4 flex-row items-center justify-between border-t border-neutral-100 pt-3">
                <Texto className="text-xs uppercase tracking-wide text-neutral-400">Pedido #{p.id}</Texto>
                <Texto className="font-sans text-lg font-bold text-neutral-900">{pesos(totalPedido(p))}</Texto>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Pagina>
  );
}
