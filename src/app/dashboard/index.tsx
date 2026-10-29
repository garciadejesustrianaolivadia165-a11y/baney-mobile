import { View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/button";
import Texto from "@/components/ui/texto";

// Provisional: el dashboard del proveedor (zona 2 de la web) se migra en la Fase 3f.
export default function DashboardProveedor() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center gap-4 px-8">
        <Texto className="text-center font-inter text-2xl font-bold text-[#3F443D]">Dashboard del proveedor</Texto>
        <Texto className="text-center font-inter text-sm text-neutral-600">Pendiente de migrar (Fase 3f): bandeja, finanzas, productos, clientes y rutas.</Texto>
        <Button variant="outline" onPress={() => router.replace("/rol")}>Volver al inicio</Button>
      </View>
    </SafeAreaView>
  );
}
