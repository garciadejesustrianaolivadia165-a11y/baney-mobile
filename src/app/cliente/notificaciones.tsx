import { Pressable, View } from "react-native";

import Pagina from "@/components/dashboard/pagina";
import Texto from "@/components/ui/texto";
import { ListaAlertas } from "../(app)/alertas";

// Campanita del cliente: las mismas notificaciones del prototipo
export default function NotificacionesCliente() {
  return (
    <Pagina className="gap-0">
      <View className="flex-row items-center justify-between px-1">
        <Texto className="font-sans text-xl font-semibold text-[#3F443D]">Notificaciones</Texto>
        <Pressable accessibilityRole="button" className="active:scale-105">
          <Texto className="text-sm font-medium text-caney-sky underline">Marcar leídas</Texto>
        </Pressable>
      </View>
      <ListaAlertas />
    </Pagina>
  );
}
