import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";

import Texto from "@/components/ui/texto";
import { imagen } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";

export type PedidoFila = { id: string; cliente: string; fecha: string; img: string; status?: string; descripcion: string; precio: string };

export function StatusChip({ status }: { status: string }) {
  const estilos: Record<string, [string, string]> = {
    COMPLETADO: ["bg-success-100", "text-success-700"],
    "EN PROCESO": ["bg-warning-200", "text-warning-800"],
    "NO INICIADO": ["bg-error-200", "text-error-700"],
    NUEVO: ["bg-[#E3F0FF]", "text-[#1d4ed8]"],
    RECHAZADO: ["bg-error-200", "text-error-700"],
    CANCELADO: ["bg-neutral-200", "text-neutral-600"],
  };
  const [fondo, texto] = estilos[status] ?? ["bg-success-100", "text-success-700"];
  return (
    <View className={`self-start rounded-full px-3 py-1 ${fondo}`}>
      <Texto className={`text-xs font-semibold ${texto}`}>{status}</Texto>
    </View>
  );
}

// Tabla "Cliente · Status · Descripción · Precio" del dashboard. Como en la web
// (min-w-[560px] + overflow-x-auto) se desplaza en horizontal en teléfono.
export default function TablaPedidos({
  pedidos,
  onFila,
  extra,
  seleccionado,
}: {
  pedidos: PedidoFila[];
  onFila?: (p: PedidoFila) => void;
  /** Contenido adicional bajo una fila (p. ej. el menú Aceptar/Rechazar) */
  extra?: (p: PedidoFila) => ReactNode;
  seleccionado?: string | null;
}) {
  const col = [180, 120, 170, 120];
  return (
    <View style={SOMBRA.card} className="mt-4 rounded-3xl bg-white p-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: col.reduce((a, b) => a + b, 0) + 16 }}>
          <View className="flex-row pb-3">
            {["Cliente", "Status", "Descripcion", "Precio Pedido"].map((t, i) => (
              <Texto key={t} style={{ width: col[i] }} className={`text-xs font-medium uppercase tracking-wide text-neutral-400 ${i === 0 ? "pl-4" : ""} ${i === 3 ? "pr-4 text-right" : ""}`}>{t}</Texto>
            ))}
          </View>
          {pedidos.map((p) => (
            <View key={p.id} style={{ zIndex: seleccionado === p.id ? 20 : 1 }}>
              <Pressable
                accessibilityRole={onFila ? "button" : undefined}
                onPress={() => onFila?.(p)}
                disabled={!onFila}
                className={`flex-row items-center rounded-2xl border-t border-neutral-100 py-3 ${seleccionado === p.id ? "bg-primary-400/20" : "active:bg-primary-400/20"}`}
              >
                <View style={{ width: col[0] }} className="flex-row items-center gap-3 pl-4">
                  <Image source={imagen(p.img)} accessibilityLabel={p.cliente} contentFit="cover" style={{ width: 36, height: 36, borderRadius: 18 }} />
                  <View className="min-w-0 flex-1">
                    <Texto numberOfLines={1} className="text-sm font-semibold text-neutral-900">{p.cliente}</Texto>
                    <Texto className="text-xs text-neutral-500">{p.fecha}</Texto>
                  </View>
                </View>
                <View style={{ width: col[1] }}>
                  <StatusChip status={p.status ?? "EN PROCESO"} />
                </View>
                <Texto style={{ width: col[2] }} numberOfLines={2} className="pr-2 text-sm text-neutral-700">{p.descripcion}</Texto>
                <Texto style={{ width: col[3] }} className="pr-4 text-right text-sm font-semibold text-neutral-900">{p.precio}</Texto>
              </Pressable>
              {extra?.(p)}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
