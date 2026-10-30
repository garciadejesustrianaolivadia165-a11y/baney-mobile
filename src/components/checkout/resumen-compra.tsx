import { View } from "react-native";

import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { pesos } from "@/lib/pedidos-cliente";

/** Tarjeta "Resumen" del checkout: subtotal, ITBIS, envío y total */
export default function ResumenCompra({ subtotal, itbis, envio, titulo = "Resumen", nota }: { subtotal: number; itbis: number; envio: number; titulo?: string; nota?: string }) {
  const filas = [
    { k: "Subtotal", v: pesos(subtotal) },
    { k: "ITBIS (18%)", v: pesos(itbis) },
    { k: "Envío", v: envio === 0 ? "Gratis" : pesos(envio) },
  ];
  return (
    <View style={SOMBRA.card} className="rounded-[1.5rem] bg-white p-5">
      <Texto className="font-sans text-lg font-semibold text-[#3F443D]">{titulo}</Texto>
      <View className="mt-3 gap-2.5">
        {filas.map((f) => (
          <View key={f.k} className="flex-row items-center justify-between">
            <Texto className="text-[13px] uppercase tracking-wide text-neutral-500">{f.k}</Texto>
            <Texto className="text-[14px] font-semibold text-neutral-900">{f.v}</Texto>
          </View>
        ))}
      </View>
      <View className="mt-4 flex-row items-center justify-between border-t-2 border-neutral-800 pt-3">
        <Texto className="text-[13px] font-semibold uppercase tracking-wide text-neutral-700">Total</Texto>
        <Texto className="font-sans text-xl font-bold text-neutral-900">{pesos(subtotal + itbis + envio)}</Texto>
      </View>
      {nota && <Texto className="mt-3 text-[12px] text-neutral-400">{nota}</Texto>}
    </View>
  );
}
