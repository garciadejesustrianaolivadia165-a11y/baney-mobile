import { useState } from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";

import { Campo } from "@/components/dashboard/campo";
import Pagina from "@/components/dashboard/pagina";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import SubirFoto from "@/components/ui/subir-foto";
import Texto from "@/components/ui/texto";
import { imagen } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";

const AVATAR = "/images/image_home/Ellipse 5.png";

function Divisor({ titulo }: { titulo: string }) {
  return (
    <View className="flex-row items-center gap-6">
      <View className="h-px flex-1 bg-neutral-200" />
      <Texto className="font-sans text-lg font-bold text-[#415936]">{titulo}</Texto>
      <View className="h-px flex-1 bg-neutral-200" />
    </View>
  );
}

export default function Profile() {
  const [avatar, setAvatar] = useState(AVATAR);
  const [form, setForm] = useState({
    nombres: "Juan Rafael",
    apellidos: "Pérez Guzmán",
    correo: "agroyucaRD@gmail.com",
    telefono: "+1 (809)-884-3392",
    provincia: "San Pedro de Macorís",
    pais: "República Dominicana",
    negocio: "AgroYUCA_RD",
    correoCorp: "agroyucaRD@gmail.com",
    telNegocio: "+1 (809)-884-3392",
    direccion: "Calle Duarte #12, San Pedro de Macorís",
    rnc: "1-31-85274-9",
    dueno: "Juan Rafael Pérez Guzmán",
    cuenta: "1234567890",
  });

  const set = (campo: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [campo]: value }));

  function guardar() {
    // TODO: enviar a la API cuando exista el backend
  }

  return (
    <Pagina className="gap-8">
      {/* Avatar: la propia foto es el disparador para elegir una nueva */}
      <View className="flex-row flex-wrap items-center gap-6">
        <View>
          <SubirFoto etiqueta="Cambiar foto de perfil" onFoto={setAvatar}>
            <View className="h-24 w-24 overflow-hidden rounded-full">
              <Image source={imagen(avatar)} accessibilityLabel="Avatar del usuario" contentFit="cover" style={{ width: 96, height: 96 }} />
              <View className="absolute inset-0 items-center justify-center bg-black/20">
                <Icono d="M3 8h3l2-2h8l2 2h3v12H3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={28} color="#fff" />
              </View>
            </View>
          </SubirFoto>
          {avatar !== AVATAR && (
            <Pressable accessibilityRole="button" accessibilityLabel="Quitar la foto subida" onPress={() => setAvatar(AVATAR)} style={SOMBRA.boton} className="absolute -right-1 -top-1 h-7 w-7 items-center justify-center rounded-full bg-white">
              <Icono d={ICONOS.cerrar} size={14} color="#ef4444" strokeWidth={2} />
            </Pressable>
          )}
        </View>
        <Texto className="max-w-xs flex-1 text-sm leading-relaxed text-neutral-400">
          Toca tu foto para subir una nueva desde tu dispositivo. Tamaño recomendado: 288×288 px, en formato PNG, JPG o WEBP.
        </Texto>
      </View>

      <View className="gap-5">
        <Campo label="Nombres" value={form.nombres} onChange={set("nombres")} />
        <Campo label="Apellidos" value={form.apellidos} onChange={set("apellidos")} />
        <Campo label="Correo Electrónico" value={form.correo} onChange={set("correo")} keyboardType="email-address" />
        <Campo label="Número Telefónico" value={form.telefono} onChange={set("telefono")} keyboardType="phone-pad" />
        <Campo label="Provincia" value={form.provincia} onChange={set("provincia")} />
        <Campo label="País" value={form.pais} onChange={set("pais")} />
      </View>

      <Divisor titulo="Información Mercantil" />
      <View className="gap-5">
        <Campo label="Nombre de negocio" value={form.negocio} onChange={set("negocio")} />
        <Campo label="Correo Corporativo" value={form.correoCorp} onChange={set("correoCorp")} keyboardType="email-address" />
        <Campo label="Número Telefónico del negocio" value={form.telNegocio} onChange={set("telNegocio")} keyboardType="phone-pad" />
        <Campo label="Dirección del negocio" value={form.direccion} onChange={set("direccion")} />
        <Campo label="RNC" value={form.rnc} onChange={set("rnc")} />
        <Campo label="Dueño del negocio" value={form.dueno} onChange={set("dueno")} />
      </View>

      <Divisor titulo="Métodos de Pago" />
      <Campo label="Cuenta designada" value={form.cuenta} onChange={set("cuenta")} />

      <View className="gap-4 pt-2">
        <BotonPill color="#afc79f" textoColor="#1e2a19" className="w-full py-3.5" textClassName="font-sans text-[15px] font-semibold" sinSombra>
          Agregar otro método de pago
        </BotonPill>
        <BotonPill color="#364a2d" textoColor="#fdf8f0" onPress={guardar} className="w-full py-3.5" textClassName="font-sans text-[15px] font-semibold">
          Guardar Cambios
        </BotonPill>
      </View>
    </Pagina>
  );
}
