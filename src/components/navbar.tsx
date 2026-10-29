import { useState } from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SearchBar from "@/components/search-bar";
import Button from "@/components/ui/button";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import { cerrarSesion, SALIDA } from "@/lib/sesion";

// Mismos enlaces que la web; "Sobre Nosotros" y "Academia BANEY" siguen pendientes.
const links: { label: string; href?: Href }[] = [
  { label: "Home", href: "/home" },
  { label: "Rutas", href: "/dashboard" },
  { label: "Sobre Nosotros" },
  { label: "Mis pedidos", href: "/dashboard" },
  { label: "Academia BANEY" },
];

// Cabecera del sitio público. En teléfono solo existe el menú compacto de la web
// (logo + hamburguesa + panel desplegable); el avatar aparece con sesión.
export default function Navbar({ session = false }: { session?: boolean }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top }} className="absolute inset-x-0 top-0 z-40">
      <View className="w-full flex-row items-center justify-between gap-4 px-4 py-4">
        <Pressable accessibilityRole="link" onPress={() => router.push(session ? "/home" : "/landing")}>
          <Image source={IMAGENES["/logos/Logo_Horizontal_baney_png.png"]} accessibilityLabel="BANEY" contentFit="contain" style={{ width: 120, height: 36 }} />
        </Pressable>

        <View className="flex-row items-center gap-3">
          {session && (
            <Pressable accessibilityRole="link" accessibilityLabel="Ir a tu perfil" onPress={() => router.push("/dashboard")}>
              <Image
                source={IMAGENES["/images/image_home/Ellipse 5.png"]}
                accessibilityLabel="Perfil"
                contentFit="cover"
                style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: "#5d7f4d" }}
              />
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            accessibilityState={{ expanded: menuAbierto }}
            onPress={() => setMenuAbierto((a) => !a)}
            style={SOMBRA.suave}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/80 active:scale-105"
          >
            <Icono d={menuAbierto ? ICONOS.cerrar : "M4 7h16M4 12h16M4 17h16"} size={20} color="#20221f" strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      {/* Panel desplegable del menú compacto */}
      {menuAbierto && (
        <View style={SOMBRA.alta} className="mx-4 rounded-3xl bg-white/95 p-5">
          {session && <SearchBar className="mb-4 w-full" />}
          <View>
            {links.map((link, i) => (
              <Pressable
                key={link.label}
                accessibilityRole="link"
                disabled={!link.href}
                onPress={() => {
                  setMenuAbierto(false);
                  if (link.href) router.push(link.href);
                }}
                className={`py-3 ${i < links.length - 1 ? "border-b border-neutral-100" : ""} active:opacity-60`}
              >
                <Texto className="font-sans text-sm font-semibold text-neutral-900">{link.label}</Texto>
              </Pressable>
            ))}
          </View>
          <View className="mt-5 gap-3">
            {session ? (
              <Button variant="outline" className="w-full py-2.5" textClassName="text-sm" onPress={() => { setMenuAbierto(false); cerrarSesion(); router.replace(SALIDA); }}>
                Cerrar Sección
              </Button>
            ) : (
              <>
                <Button href="/login" className="w-full py-2.5" textClassName="text-sm" onPress={() => setMenuAbierto(false)}>
                  Iniciar Sección
                </Button>
                <Button href="/register" variant="outline" className="w-full py-2.5" textClassName="text-sm" onPress={() => setMenuAbierto(false)}>
                  Registrarse »
                </Button>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
