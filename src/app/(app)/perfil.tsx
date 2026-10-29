import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useRouter, type Href } from "expo-router";

import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { imagen } from "@/lib/imagenes";
import { cerrarSesion, SALIDA, useSesion } from "@/lib/sesion";

type Opcion = { t: string; d: string; bg: string; color: string; i: string; href: Href; circulos?: [number, number, number][] };

// ============ VISTA 14: PERFIL (cliente y transportista) ============
// Cada opción abre su pantalla bajo src/app/cuenta/ (datos, pagos, empresa, configuración).
export default function Perfil() {
  const router = useRouter();
  const { rol, perfil } = useSesion();
  const transportista = rol === "transportista";

  const opciones: Opcion[] = [
    { t: "Datos personales", d: "Nombre, correo, teléfono", bg: "bg-[#F7F3E9]", color: "#6B6237", i: ICONOS.perfil, href: "/cuenta/datos" },
    { t: "Métodos de pago", d: "Tarjetas y facturación", bg: "bg-[#F7F3E9]", color: "#6B6237", i: ICONOS.tarjeta, href: "/cuenta/pagos" },
    {
      t: "Mi Empresa",
      d: transportista ? "Empresa, vehículos y licencia" : "RNC y registro fiscal",
      bg: "bg-[#F7F3E9]",
      color: "#6B6237",
      i: transportista ? ICONOS.camion : ICONOS.empresa,
      href: "/cuenta/empresa",
    },
    { t: "Configuración", d: "Notificaciones y seguridad", bg: "bg-[#F1F3F0]", color: "#6B7688", i: ICONOS.ajustes, circulos: [[12, 12, 3]], href: "/cuenta/configuracion" },
  ];

  const nombre = `${perfil.nombres} ${perfil.apellidos}`;
  const subtitulo = perfil.empresa.nombre || (transportista ? "Transportista independiente" : perfil.provincia);

  return (
    <ScrollView className="flex-1 bg-[#F6F7F4]" showsVerticalScrollIndicator={false}>
      {/* Cabecera verde con las curvas de la referencia */}
      <View className="overflow-hidden rounded-b-[44px] bg-[#5A6A20] px-6 pb-16 pt-16">
        <View className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/[0.07]" />
        <View className="absolute -left-16 bottom-[-40px] h-36 w-36 rounded-full bg-white/[0.07]" />

        <View className="self-center">
          <View style={SOMBRA.alta} className="rounded-full">
            <Image source={imagen(perfil.avatar)} accessibilityLabel={nombre} contentFit="cover" style={{ width: 124, height: 124, borderRadius: 62, borderWidth: 4, borderColor: "#fff" }} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar foto"
            onPress={() => router.push("/cuenta/datos")}
            style={SOMBRA.boton}
            className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full bg-[#C4B291] active:bg-transparent active:border-2 active:border-[#C4B291]"
          >
            {({ pressed }) => <Icono d={ICONOS.lapiz} size={18} color={pressed ? "#fff" : "#4A4230"} />}
          </Pressable>
        </View>

        <Texto className="mt-5 text-center text-[24px] font-bold text-white">{nombre}</Texto>
        <Texto className="mt-1 text-center text-[15px] text-white/80">{subtitulo}</Texto>

        <View className="mt-4 flex-row justify-center gap-3">
          <View className="rounded-full bg-white/20 px-4 py-2">
            <Texto className="text-[13px] font-semibold text-white">{transportista ? "Transportista verificado" : "Cliente Premium"}</Texto>
          </View>
          <View className="flex-row items-center gap-1.5 rounded-full bg-[#C4B291] px-4 py-2">
            <Icono d={ICONOS.estrella} size={14} color="#3F3A28" relleno />
            <Texto className="text-[13px] font-bold text-[#3F3A28]">{transportista ? "4.98" : "5.0"}</Texto>
          </View>
        </View>
      </View>

      {/* Tarjeta de opciones, por encima del verde */}
      <View className="z-20 -mt-8 px-6 pb-6">
        <View style={SOMBRA.alta} className="overflow-hidden rounded-[24px] bg-white">
          {opciones.map((o) => (
            <Pressable key={o.t} accessibilityRole="link" onPress={() => router.push(o.href)} className="flex-row items-center gap-4 border-b border-[#EFF1ED] px-5 py-4 active:bg-primary-400/10">
              <View className={`h-11 w-11 items-center justify-center rounded-xl ${o.bg}`}>
                <Icono d={o.i} circulos={o.circulos} size={22} color={o.color} strokeWidth={1.7} />
              </View>
              <View className="min-w-0 flex-1">
                <Texto className="text-[17px] font-bold leading-tight text-[#16202E]">{o.t}</Texto>
                <Texto className="mt-1 text-[14px] text-[#6B7688]">{o.d}</Texto>
              </View>
              <Icono d={ICONOS.chevron} size={16} color="#B9C0CB" strokeWidth={1.6} />
            </Pressable>
          ))}

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              cerrarSesion();
              router.replace(SALIDA);
            }}
            className="flex-row items-center gap-4 px-5 py-4 active:bg-error-50"
          >
            <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#FDEEEE]">
              <Icono d={ICONOS.salir} size={22} color="#8A7B1E" strokeWidth={1.7} />
            </View>
            <View>
              <Texto className="text-[17px] font-bold leading-tight text-[#8A7B1E]">Cerrar Sesión</Texto>
              <Texto className="mt-1 text-[14px] text-error-500">Finalizar mi actividad</Texto>
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
