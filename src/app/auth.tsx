import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BotonPill from "@/components/movil/boton-pill";
import Campo from "@/components/movil/campo";
import FondoCampo from "@/components/movil/fondo-campo";
import GoogleButton from "@/components/ui/google-button";
import Texto from "@/components/ui/texto";
import { C } from "@/lib/estilos";
import { IMAGENES } from "@/lib/imagenes";
import { actualizarSesion, useSesion } from "@/lib/sesion";

// ============ VISTA 4: LOGIN / REGISTRO (prototipo móvil) ============
export default function Auth() {
  const router = useRouter();
  const { rol, busca, modoAuth } = useSesion();
  const registro = modoAuth === "registro";

  // Tras iniciar sesión / registrarse, el destino depende del rol elegido
  function completarAuth() {
    if (rol === "proveedor") router.replace("/dashboard");
    else if (rol === "transportista") router.replace("/transportista");
    else if (busca === "productor") router.replace("/cliente");
    else router.replace("/mapa");
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Image
        pointerEvents="none"
        source={IMAGENES["/images/BlobsVector_01_login.png"]}
        contentFit="contain"
        style={{ position: "absolute", right: -32, top: -24, width: 176, height: 176 }}
      />
      <FondoCampo />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-12" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Texto className="z-10 font-sans text-[30px] font-bold leading-tight text-[#3D4D18]">
            {registro ? "Crear cuenta" : "Bienvenido"}
          </Texto>
          <Texto className="z-10 mt-1.5 text-[14px] text-[#7E8A80]">
            {registro ? "Regístrate para gestionar tu logística hoy." : "Ingresa para gestionar tu logística hoy."}
          </Texto>

          <View className="z-10 mt-6 gap-4">
            {registro && (
              <>
                <Campo label="Nombre" placeholder="Ej: Maria" />
                <Campo label="Apellido" placeholder="Ej: Garcia" />
                <Campo label="Cédula" placeholder="000-0000000-0" />
                <Campo label="Numero telefónico" placeholder="(000)-000-0000" type="tel" />
              </>
            )}
            <Campo label="Correo electrónico" placeholder="nombre@ejemplo.com" type="email" />
            <Campo label="Contraseña" placeholder="••••••••" type="password" />

            <Texto className="text-right text-[12px] font-semibold text-[#3D4D18]">¿Olvidaste tu contraseña?</Texto>

            <BotonPill color={C.olivaTitulo} onPress={completarAuth} className="w-full py-3.5" textClassName="font-sans text-[15px]">
              {registro ? "Registrarse" : "Iniciar Sesión"}
            </BotonPill>

            <Texto className="pt-1 text-center text-[12px] text-[#7E8A80]">o continúa con</Texto>
            <View className="flex-row justify-center gap-3">
              {/* Mismo botón de Google que el login/registro web (dos veces en registro) */}
              {(registro ? [0, 1] : [0]).map((i) => (
                <GoogleButton key={i} translucido onPress={completarAuth} className="rounded-full px-6 py-3" />
              ))}
            </View>
          </View>

          <View className="z-10 flex-row justify-center pt-8">
            <Texto className="text-[13px] text-[#3F4A33]">{registro ? "¿Ya tienes una cuenta? " : "¿No tienes una cuenta? "}</Texto>
            <Pressable accessibilityRole="button" onPress={() => actualizarSesion({ modoAuth: registro ? "login" : "registro" })}>
              <Texto className="text-[13px] font-bold text-[#3D4D18] underline">{registro ? "Inicia Sesión" : "Regístrate"}</Texto>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
