import { useState } from "react";
import { Pressable, View } from "react-native";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import TablaPedidos, { type PedidoFila } from "@/components/dashboard/tabla-pedidos";
import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";

const IMG = "/images/image_home";
const fila = (id: string, status: string, cliente = "Mini-Market Manolo", img = `${IMG}/image_home_12.png`, descripcion = "Pimientos Importados", precio = "$ 5,000.00"): PedidoFila => ({ id, cliente, fecha: "25/2/2026", img, status, descripcion, precio });

const pedidosIniciales: PedidoFila[] = [
  fila("1", "COMPLETADO", "Cesar Valdez", `${IMG}/image_home_09.png`, "Plátanos Banilejos 12 Dz", "$ 135,000.00"),
  fila("2", "EN PROCESO"), fila("3", "COMPLETADO"), fila("4", "EN PROCESO"), fila("5", "EN PROCESO"), fila("6", "EN PROCESO"),
  fila("7", "COMPLETADO"), fila("8", "NO INICIADO"), fila("9", "COMPLETADO"), fila("10", "COMPLETADO"), fila("11", "NO INICIADO"),
  fila("12", "NO INICIADO"), fila("13", "NO INICIADO"),
];

export default function InboxOrders() {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  // id del pedido con el menú Aceptar/Rechazar abierto
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);

  function decidir(id: string, aceptar: boolean) {
    setPedidos((lista) => lista.map((p) => (p.id === id ? { ...p, status: aceptar ? "EN PROCESO" : "NO INICIADO" } : p)));
    setMenuAbierto(null);
  }

  return (
    <Pagina buscador>
      <TituloSeccion titulo="Tus Pedidos" enlace="Volver Atras" href="/dashboard/bandeja" />
      <TablaPedidos
        pedidos={pedidos}
        seleccionado={menuAbierto}
        onFila={(p) => setMenuAbierto((abierto) => (abierto === p.id ? null : p.id))}
        extra={(p) =>
          menuAbierto === p.id ? (
            <View style={SOMBRA.alta} className="mb-2 ml-auto mr-2 w-40 rounded-2xl bg-white py-2">
              <Pressable accessibilityRole="button" onPress={() => decidir(p.id, true)} className="flex-row items-center gap-2.5 px-4 py-2 active:bg-success-50">
                <Icono d="M8.5 12.5l2.5 2.5 4.5-5" circulos={[[12, 12, 9]]} size={16} color="#059669" strokeWidth={2} />
                <Texto className="text-sm font-medium text-success-600">Aceptar</Texto>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => decidir(p.id, false)} className="flex-row items-center gap-2.5 px-4 py-2 active:bg-error-50">
                <Icono d="M9 9l6 6M15 9l-6 6" circulos={[[12, 12, 9]]} size={16} color="#ef4444" strokeWidth={2} />
                <Texto className="text-sm font-medium text-error-500">Rechazar</Texto>
              </Pressable>
            </View>
          ) : null
        }
      />
    </Pagina>
  );
}
