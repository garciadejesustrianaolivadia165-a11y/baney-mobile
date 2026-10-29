import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import CabeceraVolver from "@/components/movil/cabecera-volver";
import MediosPago from "@/components/movil/medios-pago";
import Texto from "@/components/ui/texto";

// Perfil → Métodos de pago: la misma pasarela de "Escoge tu medio de pago", en
// modo gestión (ver, hacer principal, eliminar y registrar tarjetas o PayPal).
export default function MetodosPago() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo="Métodos de pago" onVolver={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="px-5 py-5" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Texto className="mb-4 text-[13px] text-[#6B7688]">Toca un método para ver sus datos, hacerlo principal o eliminarlo. Registra tarjetas nuevas o vincula tu PayPal.</Texto>
          <MediosPago modo="gestion" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
