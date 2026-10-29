import { useState } from "react";
import { Pressable, View, type LayoutChangeEvent } from "react-native";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import ProfilePanel from "@/components/dashboard/profile-panel";
import Sidebar from "@/components/dashboard/sidebar";
import Icono from "@/components/ui/icono";
import { IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";

// Port de routes/dashboard/layout.tsx: cabecera con menú (teléfono y tablet),
// Sidebar como cajón por debajo de 1024 px y fijo a partir de ahí; el panel
// "Tu Perfil" a la derecha solo desde 1280 px, igual que en la web.
export default function DashboardLayout() {
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [ancho, setAncho] = useState(0);
  const sidebarFijo = ancho >= 1024;
  const conPerfil = ancho >= 1280;

  return (
    <SafeAreaView className="flex-1 bg-white" onLayout={(e: LayoutChangeEvent) => setAncho(e.nativeEvent.layout.width)}>
      <View className="flex-1 flex-row gap-6 p-4">
        {sidebarFijo && <Sidebar fijo />}

        <View className="min-w-0 flex-1">
          {!sidebarFijo && (
            <View className="mb-5 flex-row items-center justify-between gap-4">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Abrir menú"
                onPress={() => setMenuAbierto(true)}
                style={SOMBRA.card}
                className="h-11 w-11 items-center justify-center rounded-full bg-white active:bg-primary-600"
              >
                {({ pressed }) => <Icono d="M4 7h16M4 12h16M4 17h16" size={20} color={pressed ? "#fff" : "#3F443D"} strokeWidth={2} />}
              </Pressable>

              <Pressable accessibilityRole="link" onPress={() => router.push("/home")}>
                <Image source={IMAGENES["/logos/Logo_Horizontal_baney_png.png"]} accessibilityLabel="BANEY" contentFit="contain" style={{ width: 120, height: 36 }} />
              </Pressable>

              <Pressable accessibilityRole="link" accessibilityLabel="Ir a tu perfil" onPress={() => router.push("/dashboard/perfil")}>
                <Image source={IMAGENES["/images/image_home/Ellipse 5.png"]} accessibilityLabel="Perfil" contentFit="cover" style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: "#5d7f4d" }} />
              </Pressable>
            </View>
          )}

          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#ffffff" }, animation: "fade" }} />
        </View>

        {conPerfil && <ProfilePanel />}
      </View>

      {!sidebarFijo && <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />}
    </SafeAreaView>
  );
}
