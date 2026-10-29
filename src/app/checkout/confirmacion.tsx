import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "@/components/navbar";
import Texto from "@/components/ui/texto";

// Port de routes/checkout/confirmacion.tsx: en la web esta vista aún es un marcador ("<div>Confirmation</div>").
export default function Confirmacion() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8 pt-20">
        <Texto className="font-sans text-2xl font-bold text-neutral-900">Confirmation</Texto>
      </View>
      <Navbar session />
    </SafeAreaView>
  );
}
