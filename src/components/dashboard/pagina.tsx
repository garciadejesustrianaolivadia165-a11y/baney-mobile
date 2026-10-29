import { ScrollView, View, type ViewProps } from "react-native";
import { useRouter, type Href } from "expo-router";
import { Pressable } from "react-native";

import SearchHeader from "@/components/dashboard/search-header";
import Texto from "@/components/ui/texto";

/** Contenedor con scroll de cada pantalla del dashboard (SearchHeader + secciones con gap-6) */
export default function Pagina({ children, sinBuscador, className = "gap-6" }: { children: React.ReactNode; sinBuscador?: boolean; className?: string }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerClassName={`pb-10 ${className}`}>
      {!sinBuscador && <SearchHeader />}
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
