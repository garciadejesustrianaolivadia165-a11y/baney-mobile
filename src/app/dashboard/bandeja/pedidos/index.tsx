import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import TablaPedidos from "@/components/dashboard/tabla-pedidos";
import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { aceptarPedido, filaPedido, rechazarPedido, usePedidosProveedor } from "@/lib/pedidos-proveedor";

const FILTROS = ["Todos", "NUEVO", "EN PROCESO", "COMPLETADO", "RECHAZADO", "CANCELADO"] as const;
const ETIQUETA: Record<string, string> = { NUEVO: "Nuevos", "EN PROCESO": "En proceso", COMPLETADO: "Completados", RECHAZADO: "Rechazados", CANCELADO: "Cancelados" };

// Lista completa de pedidos: tocar una fila abre el menú (Aceptar / Rechazar si es
// nuevo, Ver detalle siempre); el estado cambia en todas las pantallas.
export default function InboxOrders() {
  const router = useRouter();
  const todos = usePedidosProveedor();
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>("Todos");
  const pedidos = todos.filter((p) => filtro === "Todos" || p.estado === filtro).map(filaPedido);
  // id del pedido con el menú abierto
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);

  function decidir(id: string, aceptar: boolean) {
    if (aceptar) aceptarPedido(id);
    else rechazarPedido(id);
    setMenuAbierto(null);
  }

  return (
    <Pagina>
      <TituloSeccion titulo="Tus Pedidos" enlace="Volver Atras" href="/dashboard/bandeja" />
      <View className="flex-row flex-wrap gap-2">
        {FILTROS.map((f) => (
          <Pressable key={f} accessibilityRole="tab" accessibilityState={{ selected: filtro === f }} onPress={() => setFiltro(f)} className={`rounded-full px-3.5 py-2 ${filtro === f ? "bg-primary-600" : "bg-neutral-100"}`}>
            <Texto className={`text-xs font-semibold ${filtro === f ? "text-white" : "text-neutral-600"}`}>{f === "Todos" ? "Todos" : ETIQUETA[f]} {f === "Todos" ? todos.length : todos.filter((p) => p.estado === f).length}</Texto>
          </Pressable>
        ))}
      </View>
      <TablaPedidos
        pedidos={pedidos}
        seleccionado={menuAbierto}
        onFila={(p) => setMenuAbierto((abierto) => (abierto === p.id ? null : p.id))}
        extra={(p) =>
          menuAbierto === p.id ? (
            <View style={SOMBRA.alta} className="mb-2 ml-4 w-44 rounded-2xl bg-white py-2">
              {p.status === "NUEVO" && (
                <>
                  <Pressable accessibilityRole="button" onPress={() => decidir(p.id, true)} className="flex-row items-center gap-2.5 px-4 py-2 active:bg-success-50">
                    <Icono d="M8.5 12.5l2.5 2.5 4.5-5" circulos={[[12, 12, 9]]} size={16} color="#059669" strokeWidth={2} />
                    <Texto className="text-sm font-medium text-success-600">Aceptar</Texto>
                  </Pressable>
                  <Pressable accessibilityRole="button" onPress={() => decidir(p.id, false)} className="flex-row items-center gap-2.5 px-4 py-2 active:bg-error-50">
                    <Icono d="M9 9l6 6M15 9l-6 6" circulos={[[12, 12, 9]]} size={16} color="#ef4444" strokeWidth={2} />
                    <Texto className="text-sm font-medium text-error-500">Rechazar</Texto>
                  </Pressable>
                </>
              )}
              <Pressable accessibilityRole="button" onPress={() => { setMenuAbierto(null); router.push({ pathname: "/dashboard/bandeja/pedidos/[id]", params: { id: p.id } }); }} className="flex-row items-center gap-2.5 px-4 py-2 active:bg-primary-50">
                <Icono d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" circulos={[[12, 12, 3]]} size={16} color="#3F443D" strokeWidth={2} />
                <Texto className="text-sm font-medium text-[#3F443D]">Ver detalle</Texto>
              </Pressable>
            </View>
          ) : null
        }
      />
    </Pagina>
  );
}
