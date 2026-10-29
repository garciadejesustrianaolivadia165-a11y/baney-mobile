import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Texto from "@/components/ui/texto";

// Provisional: la ficha de producto se migra en la Fase 3d.
export default function ProductoDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        <Texto className="font-sans text-2xl font-bold text-primary-600">Producto {id}</Texto>
      </View>
    </SafeAreaView>
  );
}
