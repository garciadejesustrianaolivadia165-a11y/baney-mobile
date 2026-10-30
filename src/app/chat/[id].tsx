import { useEffect, useRef, useState, type ComponentRef } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import CabeceraVolver from "@/components/movil/cabecera-volver";
import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { buscarConversacion, enviarMensaje, marcarLeida, useConversaciones } from "@/lib/chat";
import { imagen } from "@/lib/imagenes";

const ENVIAR = "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z";

// Conversación: burbujas verdes (yo) y grises (la otra parte), entrada fija abajo.
export default function Conversacion() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  useConversaciones();
  const conversacion = buscarConversacion(id);
  const [texto, setTexto] = useState("");
  const lista = useRef<ComponentRef<typeof ScrollView>>(null);

  useEffect(() => {
    if (id) marcarLeida(id);
  }, [id, conversacion?.mensajes.length]);

  useEffect(() => {
    const t = setTimeout(() => lista.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(t);
  }, [conversacion?.mensajes.length]);

  if (!conversacion) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <CabeceraVolver titulo="Mensajes" onVolver={() => router.back()} />
        <Texto className="mt-10 text-center text-sm text-neutral-500">Esta conversación no existe.</Texto>
      </SafeAreaView>
    );
  }

  function enviar() {
    if (!id || texto.trim() === "") return;
    enviarMensaje(id, texto);
    setTexto("");
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center gap-3 border-b border-[#EDEFEB] px-5 py-3">
        <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-full border border-[#E3E6E0] active:bg-[#4A5720]">
          {({ pressed }) => <Icono d="M15 18l-6-6 6-6" size={16} color={pressed ? "#fff" : "#16202E"} strokeWidth={2} />}
        </Pressable>
        <Image source={imagen(conversacion.con.avatar)} accessibilityLabel={conversacion.con.nombre} contentFit="cover" style={{ width: 40, height: 40, borderRadius: 20 }} />
        <View className="min-w-0 flex-1">
          <Texto numberOfLines={1} className="text-[16px] font-bold text-[#16202E]">{conversacion.con.nombre}</Texto>
          <Texto className="text-[11px] font-semibold uppercase tracking-wide text-[#8B9A3A]">{conversacion.con.rol}</Texto>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView ref={lista} className="flex-1 bg-[#F6F7F4]" contentContainerClassName="gap-2.5 px-5 py-5" showsVerticalScrollIndicator={false}>
          {conversacion.mensajes.length === 0 && <Texto className="py-10 text-center text-[13px] text-neutral-400">Escribe para iniciar la conversación.</Texto>}
          {conversacion.mensajes.map((m) => (
            <View key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${m.de === "yo" ? "self-end rounded-br-md bg-[#4A5720]" : "self-start rounded-bl-md bg-white"}`}>
              <Texto className={`text-[14px] leading-snug ${m.de === "yo" ? "text-white" : "text-[#16202E]"}`}>{m.texto}</Texto>
              <Texto className={`mt-1 text-right text-[10px] ${m.de === "yo" ? "text-white/70" : "text-neutral-400"}`}>{m.hora}</Texto>
            </View>
          ))}
        </ScrollView>

        <View className="flex-row items-end gap-3 border-t border-[#EDEFEB] bg-white px-4 py-3">
          <TextInput value={texto} onChangeText={setTexto} placeholder="Escribe un mensaje…" placeholderTextColor="#9AA69C" multiline onSubmitEditing={enviar} blurOnSubmit className="max-h-28 flex-1 rounded-2xl bg-[#F1F4F2] px-4 py-3 font-inter text-[15px] text-[#16202E]" />
          <Pressable accessibilityRole="button" accessibilityLabel="Enviar" onPress={enviar} disabled={texto.trim() === ""} className={`h-12 w-12 items-center justify-center rounded-full ${texto.trim() === "" ? "bg-neutral-200" : "bg-[#4A5720] active:bg-[#2F3E17]"}`}>
            <Icono d={ENVIAR} size={20} color="#fff" strokeWidth={1.9} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
