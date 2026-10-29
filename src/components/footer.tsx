import { Pressable, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { IMAGENES } from "@/lib/imagenes";

export const SOCIALES = [
  {
    name: "Instagram",
    path: "M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.5a1.4 1.4 0 1 1-2.9 0 1.4 1.4 0 0 1 2.9 0z",
  },
  {
    name: "LinkedIn",
    path: "M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.25h4.52V24H.24V8.25zM8.34 8.25h4.33v2.15h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.92V24h-4.52v-7.9c0-1.88-.03-4.3-2.62-4.3-2.62 0-3.02 2.05-3.02 4.17V24H8.34V8.25z",
  },
  {
    name: "Facebook",
    path: "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07z",
  },
];

const columns = [
  { title: "Product", items: ["BD Proveedores", "Clientes", "Productos", "Time tracking", "Planificación", "Reclutamiento"] },
  { title: "Information", items: ["FAQ", "Vlog", "Soporte"] },
  { title: "Company", items: ["Sobre nosotros", "Carreras", "Contáctanos", "Medios"] },
];

const legales = ["Terminos", "Privacidad", "Cookies"];

/** Columnas de enlaces del pie (compartidas con FooterLanding) */
export function ColumnasPie({ columnas }: { columnas: { title: string; items: string[] }[] }) {
  return (
    <View className="flex-row flex-wrap gap-y-10">
      {columnas.map((col) => (
        <View key={col.title} className="w-1/2 pr-4">
          <Texto className="mb-5 font-sans text-lg font-bold text-secondary-50">{col.title}</Texto>
          <View className="gap-3">
            {col.items.map((item) => (
              <Pressable key={item} accessibilityRole="link" className="active:opacity-70">
                <Texto className="font-sans text-sm text-secondary-100">{item}</Texto>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

export function Sociales({ className = "" }: { className?: string }) {
  return (
    <View className={`flex-row gap-4 ${className}`}>
      {SOCIALES.map((s) => (
        <Pressable key={s.name} accessibilityRole="link" accessibilityLabel={s.name} className="active:opacity-70">
          <Icono d={s.path} size={20} color="#faefde" relleno />
        </Pressable>
      ))}
    </View>
  );
}

export default function Footer() {
  const router = useRouter();
  return (
    <View className="bg-secondary4-500">
      <View className="px-6 py-14">
        <ColumnasPie columnas={columns} />

        {/* Newsletter */}
        <View className="mt-10 rounded-2xl bg-white/10 p-6">
          <Texto className="mb-4 font-sans font-bold text-secondary-50">Unete a nuestro Newsletter</Texto>
          <View className="flex-row items-center overflow-hidden rounded-full bg-white">
            <TextInput
              placeholder="Correo Electrónico"
              accessibilityLabel="Correo Electrónico"
              placeholderTextColor="#a2a79e"
              keyboardType="email-address"
              autoCapitalize="none"
              className="flex-1 px-4 py-2 font-sans text-sm text-neutral-800"
              style={{ paddingVertical: 8 }}
            />
            <Pressable accessibilityRole="button" accessibilityLabel="Suscribirse" className="m-1 h-8 w-8 items-center justify-center rounded-full bg-neutral-900 active:bg-primary-600">
              <Texto className="text-white">→</Texto>
            </Pressable>
          </View>
          <Texto className="mt-4 font-sans text-xs leading-relaxed text-secondary-100/80">
            Recibe novedades del mercado, el ecosistema y la academia BANEY directo en tu correo.
          </Texto>
        </View>

        <View className="mt-12 items-center gap-6 border-t border-white/15 pt-8">
          <Pressable accessibilityRole="link" onPress={() => router.push("/home")}>
            <Image source={IMAGENES["/logos/Logo_Horizontal_baney_png.png"]} accessibilityLabel="BANEY" contentFit="contain" style={{ width: 132, height: 40 }} />
          </Pressable>
          <View className="flex-row gap-8">
            {legales.map((item) => (
              <Pressable key={item} accessibilityRole="link" className="active:opacity-70">
                <Texto className="font-sans text-sm text-secondary-100">{item}</Texto>
              </Pressable>
            ))}
          </View>
          <Sociales />
        </View>
      </View>
    </View>
  );
}
