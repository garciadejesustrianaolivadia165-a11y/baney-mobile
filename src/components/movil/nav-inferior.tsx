import { Pressable, View } from "react-native";
import Presionable from "@/components/ui/presionable";
import { useRouter, usePathname, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { useSesion } from "@/lib/sesion";

type Item = { ruta: Href; label: string; icono: string };

export const NAV_CLIENTE: Item[] = [
  { ruta: "/mapa", label: "Inicio", icono: ICONOS.inicio },
  { ruta: "/historial", label: "Historial", icono: ICONOS.historial },
  { ruta: "/alertas", label: "Alertas", icono: ICONOS.alertas },
  { ruta: "/perfil", label: "Perfil", icono: ICONOS.perfil },
];

export const NAV_TRANSPORTISTA: Item[] = [
  { ruta: "/transportista", label: "Dashboard", icono: ICONOS.dashboard },
  { ruta: "/transportista-mapa", label: "Mapa", icono: ICONOS.mapa },
  { ruta: "/flota", label: "Flota", icono: ICONOS.flota },
  { ruta: "/perfil", label: "Perfil", icono: ICONOS.perfil },
];

// Barra inferior del prototipo: la usa el Tabs de src/app/(app)/_layout.tsx como
// `tabBar`. Los ítems dependen del rol de la sesión, como en la web.
export default function NavInferior() {
  const { rol } = useSesion();
  const router = useRouter();
  const ruta = usePathname();
  const { bottom } = useSafeAreaInsets();
  const items = rol === "transportista" ? NAV_TRANSPORTISTA : NAV_CLIENTE;

  const ir = (it: Item) => router.navigate(it.ruta);

  return (
    <View
      style={{ paddingBottom: Math.max(bottom, 12) }}
      className="z-20 border-t border-neutral-100 bg-white px-2 pt-2"
    >
      <View className="flex-row items-end justify-between">
        {items.slice(0, 2).map((it) => (
          <BotonNav key={it.label} it={it} activo={ruta === it.ruta} onIr={ir} />
        ))}
        <Presionable
          accessibilityRole="button"
          accessibilityLabel="Nueva solicitud"
          onPress={() => ir(items[0])}
          estilo={(pressed) => ({
            shadowColor: "#EC8A3C",
            shadowOpacity: 0.35,
            shadowRadius: 0,
            shadowOffset: { width: 0, height: 0 },
            transform: [{ scale: pressed ? 1.1 : 1 }],
          })}
          className="-mt-6 h-14 w-14 items-center justify-center rounded-full border-[6px] border-[#EC8A3C]/25 bg-primary-700"
        >
          <Texto className="text-2xl leading-none text-white">+</Texto>
        </Presionable>
        {items.slice(2).map((it) => (
          <BotonNav key={it.label} it={it} activo={ruta === it.ruta} onIr={ir} />
        ))}
      </View>
    </View>
  );
}

function BotonNav({ it, activo, onIr }: { it: Item; activo: boolean; onIr: (it: Item) => void }) {
  return (
    <Pressable accessibilityRole="tab" accessibilityState={{ selected: activo }} onPress={() => onIr(it)} className="w-16 items-center gap-1">
      <Icono d={it.icono} size={20} color={activo ? "#2a3a23" : "#a2a79e"} />
      <Texto className={`text-[10px] ${activo ? "font-semibold text-primary-700" : "text-neutral-400"}`}>{it.label}</Texto>
    </Pressable>
  );
}
