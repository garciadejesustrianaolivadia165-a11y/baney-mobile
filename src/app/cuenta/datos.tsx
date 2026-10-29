import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import CabeceraVolver from "@/components/movil/cabecera-volver";
import Entrada from "@/components/movil/entrada";
import PieGuardar from "@/components/movil/pie-guardar";
import Icono from "@/components/ui/icono";
import SubirFoto from "@/components/ui/subir-foto";
import Texto from "@/components/ui/texto";
import { imagen } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import { actualizarPerfil, useSesion } from "@/lib/sesion";

// Perfil → Datos personales: los mismos campos que "Mi Perfil" del proveedor,
// con la estética del prototipo móvil. Lo comparten cliente y transportista.
export default function DatosPersonales() {
  const router = useRouter();
  const { perfil } = useSesion();
  const [form, setForm] = useState({ nombres: perfil.nombres, apellidos: perfil.apellidos, cedula: perfil.cedula, correo: perfil.correo, telefono: perfil.telefono, provincia: perfil.provincia, pais: perfil.pais });
  const [avatar, setAvatar] = useState(perfil.avatar);
  const [guardado, setGuardado] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setGuardado(false);
  };

  function guardar() {
    actualizarPerfil({ ...form, avatar });
    setGuardado(true);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CabeceraVolver titulo="Datos personales" onVolver={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="gap-4 px-5 py-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="mb-2 flex-row items-center gap-5">
            <SubirFoto
              etiqueta="Cambiar foto de perfil"
              onFoto={(uri) => {
                setAvatar(uri);
                setGuardado(false);
              }}
            >
              <View style={SOMBRA.card} className="h-24 w-24 overflow-hidden rounded-full">
                <Image source={imagen(avatar)} accessibilityLabel="Foto de perfil" contentFit="cover" style={{ width: 96, height: 96 }} />
                <View className="absolute inset-0 items-center justify-center bg-black/20">
                  <Icono d="M3 8h3l2-2h8l2 2h3v12H3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={26} color="#fff" />
                </View>
              </View>
            </SubirFoto>
            <Texto className="flex-1 text-[13px] leading-relaxed text-[#6B7688]">Toca tu foto para subir una nueva desde tu dispositivo. PNG, JPG o WEBP de hasta 5 MB.</Texto>
          </View>

          <Entrada label="Nombres" value={form.nombres} onChange={set("nombres")} />
          <Entrada label="Apellidos" value={form.apellidos} onChange={set("apellidos")} />
          <Entrada label="Cédula" value={form.cedula} onChange={set("cedula")} keyboardType="numbers-and-punctuation" />
          <Entrada label="Correo electrónico" value={form.correo} onChange={set("correo")} keyboardType="email-address" autoCapitalize="none" />
          <Entrada label="Número telefónico" value={form.telefono} onChange={set("telefono")} keyboardType="phone-pad" />
          <Entrada label="Provincia" value={form.provincia} onChange={set("provincia")} />
          <Entrada label="País" value={form.pais} onChange={set("pais")} />
        </ScrollView>
      </KeyboardAvoidingView>
      <PieGuardar texto="Guardar cambios" onPress={guardar} guardado={guardado} />
    </SafeAreaView>
  );
}
