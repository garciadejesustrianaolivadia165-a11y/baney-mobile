import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import FormularioPerfil from "@/components/perfil/formulario-perfil";
import Texto from "@/components/ui/texto";
import { actualizarPerfil, destinoPorRol, useSesion } from "@/lib/sesion";

// UC-USER-01 · Crear perfil: paso "Completa tu perfil" tras verificar el correo.
// Reutiliza el formulario "Mi Perfil"; el proveedor añade su información mercantil.
export default function CompletarPerfil() {
  const router = useRouter();
  const { rol, perfil } = useSesion();
  const proveedor = rol === "proveedor";
  const continuar = () => router.replace(rol ? destinoPorRol() : "/home");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="gap-6 px-5 pb-10 pt-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View className="rounded-[1.5rem] bg-[#556B2F] px-5 py-5">
          <Texto className="font-sans text-[22px] font-bold text-white">Completa tu perfil</Texto>
          <Texto className="mt-1 text-[14px] leading-snug text-white/85">
            {proveedor
              ? "Tu foto, tu provincia y los datos de tu negocio ayudan a que los clientes confíen en tus productos."
              : rol === "transportista"
                ? "Tu foto y tus datos de contacto aparecen en cada solicitud que aceptes. Los vehículos y la licencia se agregan en Mi Empresa."
                : "Tu foto y tus datos de contacto se muestran a los proveedores y transportistas con los que trabajes."}
          </Texto>
        </View>

        <FormularioPerfil
          inicial={perfil}
          secciones={proveedor ? ["usuario", "empresa"] : ["usuario"]}
          onGuardar={(v) => {
            actualizarPerfil({ nombres: v.nombres, apellidos: v.apellidos, cedula: v.cedula, correo: v.correo, telefono: v.telefono, provincia: v.provincia, pais: v.pais, avatar: v.avatar, empresa: v.empresa });
            continuar();
          }}
        />

        <Pressable accessibilityRole="link" onPress={continuar} className="self-center py-2">
          <Texto className="font-sans text-sm font-semibold text-neutral-500">Omitir por ahora</Texto>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
