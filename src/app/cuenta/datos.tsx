import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import CabeceraVolver from "@/components/movil/cabecera-volver";
import FormularioPerfil from "@/components/perfil/formulario-perfil";
import { actualizarPerfil, useSesion } from "@/lib/sesion";

// Perfil → Datos personales: la misma vista "Mi Perfil" del proveedor, solo la
// sección del usuario. Comparten cliente y transportista.
export default function DatosPersonales() {
  const router = useRouter();
  const { perfil } = useSesion();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo="Datos personales" onVolver={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="px-5 py-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <FormularioPerfil inicial={perfil} secciones={["usuario"]} onGuardar={(v) => actualizarPerfil({ nombres: v.nombres, apellidos: v.apellidos, cedula: v.cedula, correo: v.correo, telefono: v.telefono, provincia: v.provincia, pais: v.pais, avatar: v.avatar })} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
