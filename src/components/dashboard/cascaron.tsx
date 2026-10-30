import { useRef, useState, type ComponentRef } from "react";
import { Pressable, View, type LayoutChangeEvent } from "react-native";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import ProfilePanel from "@/components/dashboard/profile-panel";
import Sidebar, { type RolPanel } from "@/components/dashboard/sidebar";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { cantidadCarrito, useCarrito } from "@/lib/carrito";
import { registrarGuia } from "@/lib/guia";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import { useSesion } from "@/lib/sesion";

// Armazón compartido del área privada (routes/dashboard/layout.tsx de la web):
// cabecera con menú + logo centrado + foto (y campanita para el cliente), Sidebar
// como cajón por debajo de 1024 px y fijo a partir de ahí; el panel "Tu Perfil"
// a la derecha solo para el proveedor desde 1280 px. Los ítems del menú cambian
// según el rol, sin duplicar el layout.
export default function Cascaron({ rol }: { rol: RolPanel }) {
  const router = useRouter();
  const { perfil } = useSesion();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [ancho, setAncho] = useState(0);
  const sidebarFijo = ancho >= 1024;
  const conPerfil = rol === "proveedor" && ancho >= 1280;
  const cliente = rol === "cliente";
  const enCarrito = cantidadCarrito(useCarrito());
  const botonMenu = useRef<ComponentRef<typeof View>>(null);
  const sidebarFijoRef = useRef<ComponentRef<typeof View>>(null);
  // La guía interactiva del inicio enfoca el botón del menú (o el menú fijo en pantallas anchas)
  const medirMenu = () => {
    botonMenu.current?.measureInWindow((x, y, w, h) => registrarGuia({ botonMenu: { x, y, w, h } }));
    sidebarFijoRef.current?.measureInWindow((x, y, w, h) => registrarGuia({ sidebar: { x, y, w, h } }));
  };
  const avatar = cliente ? imagen(perfil.avatar) : IMAGENES["/images/image_home/Ellipse 5.png"];

  return (
    <SafeAreaView className="flex-1 bg-white" onLayout={(e: LayoutChangeEvent) => setAncho(e.nativeEvent.layout.width)}>
      <View className="flex-1 flex-row gap-6 p-4">
        {sidebarFijo && (
          <View ref={sidebarFijoRef} onLayout={medirMenu}>
            <Sidebar fijo rol={rol} />
          </View>
        )}

        <View className="min-w-0 flex-1">
          {!sidebarFijo && (
            <View className="mb-5 flex-row items-center justify-between gap-4">
              <Pressable
                ref={botonMenu}
                onLayout={medirMenu}
                accessibilityRole="button"
                accessibilityLabel="Abrir menú"
                onPress={() => setMenuAbierto(true)}
                style={SOMBRA.card}
                className="h-11 w-11 items-center justify-center rounded-full bg-white active:bg-primary-600"
              >
                {({ pressed }) => <Icono d="M4 7h16M4 12h16M4 17h16" size={20} color={pressed ? "#fff" : "#3F443D"} strokeWidth={2} />}
              </Pressable>

              <Pressable accessibilityRole="link" onPress={() => router.push(cliente ? "/cliente" : "/dashboard")}>
                <Image source={IMAGENES["/logos/Logo_Horizontal_baney_png.png"]} accessibilityLabel="BANEY" contentFit="contain" style={{ width: 120, height: 36 }} />
              </Pressable>

              <View className="flex-row items-center gap-1">
                {cliente && (
                  <Pressable accessibilityRole="button" accessibilityLabel={`Ver carrito, ${enCarrito} productos`} onPress={() => router.push("/cliente/carrito")} className="h-10 w-10 items-center justify-center rounded-full active:bg-primary-600">
                    {({ pressed }) => (
                      <>
                        <Icono d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.6L20 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" size={22} color={pressed ? "#fff" : "#3F443D"} />
                        {enCarrito > 0 && (
                          <View className="absolute -right-0.5 -top-0.5 h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-primary-600 px-1">
                            <Texto className="text-[9px] font-bold text-white">{enCarrito}</Texto>
                          </View>
                        )}
                      </>
                    )}
                  </Pressable>
                )}
                {cliente && (
                  <Pressable accessibilityRole="button" accessibilityLabel="Ver notificaciones" onPress={() => router.push("/cliente/notificaciones")} className="h-10 w-10 items-center justify-center rounded-full active:bg-primary-600">
                    {({ pressed }) => (
                      <>
                        <Icono d={ICONOS.alertas} size={22} color={pressed ? "#fff" : "#3F443D"} />
                        <View className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-error-500" />
                      </>
                    )}
                  </Pressable>
                )}
                <Pressable accessibilityRole="link" accessibilityLabel="Ir a tu perfil" onPress={() => router.push(cliente ? "/cliente/perfil" : "/dashboard/perfil")}>
                  <Image source={avatar} accessibilityLabel="Perfil" contentFit="cover" style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: "#5d7f4d" }} />
                </Pressable>
              </View>
            </View>
          )}

          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#ffffff" }, animation: "fade" }} />
        </View>

        {conPerfil && <ProfilePanel />}
      </View>

      {!sidebarFijo && <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} rol={rol} />}
    </SafeAreaView>
  );
}
