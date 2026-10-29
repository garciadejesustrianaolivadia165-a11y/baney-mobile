import { useState } from "react";
import { Pressable, ScrollView, View, type LayoutChangeEvent, type ViewProps } from "react-native";
import { useRouter, type Href } from "expo-router";

import SearchHeader from "@/components/dashboard/search-header";
import Texto from "@/components/ui/texto";

/**
 * Contenedor con scroll de cada pantalla del dashboard (secciones con gap-6).
 * El buscador de la web solo aparece en móvil cuando la pantalla tiene un listado
 * (`buscador`); en pantallas anchas (tablet/web, ≥ 900 px) se muestra siempre.
 */
export default function Pagina({ children, buscador = false, className = "gap-6" }: { children: React.ReactNode; buscador?: boolean; className?: string }) {
  const [ancho, setAncho] = useState(0);
  const mostrar = buscador || ancho >= 900;
  return (
    <ScrollView onLayout={(e: LayoutChangeEvent) => setAncho(e.nativeEvent.layout.width)} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerClassName={`pb-10 ${className}`}>
      {mostrar && <SearchHeader />}
      {children}
    </ScrollView>
  );
}

/** Título de sección + enlace azul a la derecha ("Ver Todos", "Volver Atras"…) */
export function TituloSeccion({ titulo, enlace, href, onPress, ...rest }: { titulo: string; enlace?: string; href?: Href; onPress?: () => void } & ViewProps) {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between" {...rest}>
      <Texto className="font-sans text-xl font-semibold text-[#3F443D]">{titulo}</Texto>
      {enlace && (
        <Pressable accessibilityRole="link" onPress={() => (onPress ? onPress() : href ? router.push(href) : router.back())}>
          <Texto className="text-sm font-medium text-caney-sky underline">{enlace}</Texto>
        </Pressable>
      )}
    </View>
  );
}
