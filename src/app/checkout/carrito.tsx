import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Texto from "@/components/ui/texto";

// Provisional: el checkout (04-06 del Figma) se migra en la Fase 3e.
export default function Carrito() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        <Texto className="font-sans text-2xl font-bold text-primary-600">Carrito</Texto>
      </View>
    </SafeAreaView>
  );
}
