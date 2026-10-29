import { View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/button";
import Texto from "@/components/ui/texto";

// Provisional: el catálogo de compra (zona 1 de la web) se migra en la Fase 3d.
export default function Marketplace() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center gap-4 px-8">
        <Texto className="text-center font-sans text-2xl font-bold text-primary-600">Marketplace</Texto>
        <Texto className="text-center font-sans text-sm text-neutral-600">Pendiente de migrar (Fase 3d): catálogo y ficha de producto.</Texto>
        <Button variant="outline" onPress={() => router.replace("/rol")}>Volver al inicio</Button>
      </View>
    </SafeAreaView>
  );
}
