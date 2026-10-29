import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import Pagina from "@/components/dashboard/pagina";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { CLIENTES, esRecurrente, pesos, totalComprado } from "@/lib/clientes";
import { imagen } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";

/** Burbuja "Cliente recurrente" */
export function ChipRecurrente({ grande }: { grande?: boolean }) {
  return (
    <View className={`flex-row items-center gap-1 rounded-full bg-secondary4-100 ${grande ? "px-3 py-1.5" : "px-2.5 py-1"}`}>
      <Icono d={ICONOS.estrella} size={grande ? 12 : 10} color="#5c641d" relleno />
      <Texto className={`font-semibold text-[#5c641d] ${grande ? "text-xs" : "text-[10px]"}`}>Cliente recurrente</Texto>
    </View>
  );
}

// Clientes que han comprado los productos del proveedor; tocar uno abre su detalle
export default function Clients() {
  const router = useRouter();
  const recurrentes = CLIENTES.filter(esRecurrente).length;

  return (
    <Pagina>
      <View>
        <Texto className="text-2xl font-bold text-[#3F443D]">Clientes</Texto>
        <Texto className="mt-1 text-sm text-neutral-500">{CLIENTES.length} clientes han comprado tus productos · {recurrentes} recurrentes</Texto>
      </View>

      <View className="gap-4">
        {CLIENTES.map((c) => (
          <Pressable key={c.id} accessibilityRole="link" accessibilityLabel={`Ver cliente ${c.nombre}`} onPress={() => router.push({ pathname: "/dashboard/clientes/[id]", params: { id: c.id } })} style={SOMBRA.card} className="rounded-[1.5rem] bg-white p-4 active:bg-primary-400/10">
            <View className="flex-row items-center gap-3">
              <Image source={imagen(c.img)} accessibilityLabel={c.nombre} contentFit="cover" style={{ width: 48, height: 48, borderRadius: 24 }} />
              <View className="min-w-0 flex-1">
                <Texto numberOfLines={1} className="text-[15px] font-bold text-[#3F443D]">{c.nombre}</Texto>
                <Texto numberOfLines={1} className="text-xs text-neutral-500">{c.tipo} · {c.lugar}</Texto>
              </View>
              <Icono d={ICONOS.chevron} size={16} color="#B9C0CB" strokeWidth={1.6} />
            </View>
            <View className="mt-3 flex-row flex-wrap items-center gap-2">
              {esRecurrente(c) && <ChipRecurrente />}
              <View className="rounded-full bg-neutral-100 px-2.5 py-1">
                <Texto className="text-[10px] font-semibold text-neutral-600">{c.pedidos.length} pedidos</Texto>
              </View>
              <View className="rounded-full bg-neutral-100 px-2.5 py-1">
                <Texto className="text-[10px] font-semibold text-neutral-600">Último: {c.pedidos[0].fecha}</Texto>
              </View>
              <Texto className="ml-auto text-sm font-bold text-primary-600">{pesos(totalComprado(c))}</Texto>
            </View>
          </Pressable>
        ))}
      </View>
    </Pagina>
  );
}
