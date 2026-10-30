import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import CabeceraVolver from "@/components/movil/cabecera-volver";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { useConversaciones } from "@/lib/chat";
import { SOMBRA } from "@/lib/estilos";
import { imagen } from "@/lib/imagenes";

// Mensajes: lista de conversaciones con transportistas, clientes y proveedores.
export default function Mensajes() {
  const router = useRouter();
  const conversaciones = useConversaciones();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo="Mensajes" onVolver={() => router.back()} />
      <ScrollView contentContainerClassName="gap-3 px-5 py-5" showsVerticalScrollIndicator={false}>
        {conversaciones.length === 0 && (
          <View className="items-center gap-2 py-16">
            <Icono d={ICONOS.mensaje} size={40} color="#B9C0CB" strokeWidth={1.4} />
            <Texto className="text-[15px] font-semibold text-neutral-500">Sin conversaciones</Texto>
            <Texto className="text-center text-[13px] text-neutral-400">Toca "Mensaje" en un pedido o viaje para escribir a la otra parte.</Texto>
          </View>
        )}
        {conversaciones.map((c) => {
          const ultimo = c.mensajes[c.mensajes.length - 1];
          return (
            <Pressable key={c.id} accessibilityRole="button" accessibilityLabel={`Abrir chat con ${c.con.nombre}`} onPress={() => router.push({ pathname: "/chat/[id]", params: { id: c.id } })} style={SOMBRA.card} className="flex-row items-center gap-3.5 rounded-[1.5rem] bg-white p-4 active:bg-primary-400/10">
              <Image source={imagen(c.con.avatar)} accessibilityLabel={c.con.nombre} contentFit="cover" style={{ width: 52, height: 52, borderRadius: 26 }} />
              <View className="min-w-0 flex-1">
                <View className="flex-row items-center justify-between gap-2">
                  <Texto numberOfLines={1} className="flex-1 text-[16px] font-bold text-[#16202E]">{c.con.nombre}</Texto>
                  <Texto className="text-[11px] text-neutral-400">{ultimo?.hora ?? ""}</Texto>
                </View>
                <Texto className="text-[12px] font-semibold uppercase tracking-wide text-[#8B9A3A]">{c.con.rol}</Texto>
                <Texto numberOfLines={1} className={`mt-0.5 text-[13px] ${c.noLeidos > 0 ? "font-semibold text-[#16202E]" : "text-neutral-500"}`}>{ultimo ? `${ultimo.de === "yo" ? "Tú: " : ""}${ultimo.texto}` : "Escribe el primer mensaje"}</Texto>
              </View>
              {c.noLeidos > 0 && (
                <View className="h-6 min-w-6 items-center justify-center rounded-full bg-primary-600 px-1.5">
                  <Texto className="text-[11px] font-bold text-white">{c.noLeidos}</Texto>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
