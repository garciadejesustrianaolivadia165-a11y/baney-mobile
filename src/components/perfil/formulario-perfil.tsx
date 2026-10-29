import { useState } from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";

import { Campo } from "@/components/dashboard/campo";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import SubirFoto from "@/components/ui/subir-foto";
import Texto from "@/components/ui/texto";
import { imagen } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import type { Perfil } from "@/lib/sesion";

export type Seccion = "usuario" | "empresa" | "pagos";

export function Divisor({ titulo }: { titulo: string }) {
  return (
    <View className="flex-row items-center gap-6">
      <View className="h-px flex-1 bg-neutral-200" />
      <Texto className="font-sans text-lg font-bold text-[#415936]">{titulo}</Texto>
      <View className="h-px flex-1 bg-neutral-200" />
    </View>
  );
}

/** Foto de perfil: la propia imagen es el disparador para elegir una nueva */
export function Avatar({ valor, inicial, onCambio }: { valor: string; inicial: string; onCambio: (uri: string) => void }) {
  return (
    <View className="flex-row flex-wrap items-center gap-6">
      <View>
        <SubirFoto etiqueta="Cambiar foto de perfil" onFoto={onCambio}>
          <View className="h-24 w-24 overflow-hidden rounded-full">
            <Image source={imagen(valor)} accessibilityLabel="Avatar del usuario" contentFit="cover" style={{ width: 96, height: 96 }} />
            <View className="absolute inset-0 items-center justify-center bg-black/20">
              <Icono d="M3 8h3l2-2h8l2 2h3v12H3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={28} color="#fff" />
            </View>
          </View>
        </SubirFoto>
        {valor !== inicial && (
          <Pressable accessibilityRole="button" accessibilityLabel="Quitar la foto subida" onPress={() => onCambio(inicial)} style={SOMBRA.boton} className="absolute -right-1 -top-1 h-7 w-7 items-center justify-center rounded-full bg-white">
            <Icono d={ICONOS.cerrar} size={14} color="#ef4444" strokeWidth={2} />
          </Pressable>
        )}
      </View>
      <Texto className="max-w-xs flex-1 text-sm leading-relaxed text-neutral-400">
        Toca tu foto para subir una nueva desde tu dispositivo. Tamaño recomendado: 288×288 px, en formato PNG, JPG o WEBP.
      </Texto>
    </View>
  );
}

/**
 * Formulario "Mi Perfil" (routes/dashboard/profile.tsx de la web). Lo comparten el
 * dashboard del proveedor y las pantallas Datos personales / Mi Empresa del
 * prototipo móvil: `secciones` elige qué bloques se muestran.
 */
export default function FormularioPerfil({
  inicial,
  secciones = ["usuario", "empresa", "pagos"],
  onGuardar,
  etiquetaEmpresa = "Información Mercantil",
}: {
  inicial: Perfil & { cuenta?: string };
  secciones?: Seccion[];
  onGuardar: (valores: Perfil & { cuenta: string }) => void;
  etiquetaEmpresa?: string;
}) {
  const [avatar, setAvatar] = useState(inicial.avatar);
  const [u, setU] = useState({ nombres: inicial.nombres, apellidos: inicial.apellidos, cedula: inicial.cedula, correo: inicial.correo, telefono: inicial.telefono, provincia: inicial.provincia, pais: inicial.pais });
  const [e, setE] = useState(inicial.empresa);
  const [cuenta, setCuenta] = useState(inicial.cuenta ?? "1234567890");
  const [guardado, setGuardado] = useState(false);
  const tiene = (s: Seccion) => secciones.includes(s);
  const setUsuario = (k: keyof typeof u) => (v: string) => {
    setU((f) => ({ ...f, [k]: v }));
    setGuardado(false);
  };
  const setEmpresa = (k: keyof typeof e) => (v: string) => {
    setE((f) => ({ ...f, [k]: v }));
    setGuardado(false);
  };

  function guardar() {
    onGuardar({ ...inicial, ...u, avatar, empresa: e, cuenta });
    setGuardado(true);
  }

  return (
    <View className="gap-8">
      {tiene("usuario") && (
        <>
          <Avatar valor={avatar} inicial={inicial.avatar} onCambio={(uri) => { setAvatar(uri); setGuardado(false); }} />
          <View className="gap-5">
            <Campo label="Nombres" value={u.nombres} onChange={setUsuario("nombres")} />
            <Campo label="Apellidos" value={u.apellidos} onChange={setUsuario("apellidos")} />
            <Campo label="Cédula" value={u.cedula} onChange={setUsuario("cedula")} keyboardType="numbers-and-punctuation" />
            <Campo label="Correo Electrónico" value={u.correo} onChange={setUsuario("correo")} keyboardType="email-address" />
            <Campo label="Número Telefónico" value={u.telefono} onChange={setUsuario("telefono")} keyboardType="phone-pad" />
            <Campo label="Provincia" value={u.provincia} onChange={setUsuario("provincia")} />
            <Campo label="País" value={u.pais} onChange={setUsuario("pais")} />
          </View>
        </>
      )}

      {tiene("empresa") && (
        <>
          {tiene("usuario") && <Divisor titulo={etiquetaEmpresa} />}
          <View className="gap-5">
            <Campo label="Nombre de negocio" value={e.nombre} onChange={setEmpresa("nombre")} />
            <Campo label="Correo Corporativo" value={e.correo} onChange={setEmpresa("correo")} keyboardType="email-address" />
            <Campo label="Número Telefónico del negocio" value={e.telefono} onChange={setEmpresa("telefono")} keyboardType="phone-pad" />
            <Campo label="Dirección del negocio" value={e.direccion} onChange={setEmpresa("direccion")} />
            <Campo label="RNC" value={e.rnc} onChange={setEmpresa("rnc")} />
            <Campo label="Dueño del negocio" value={e.dueno} onChange={setEmpresa("dueno")} />
          </View>
        </>
      )}

      {tiene("pagos") && (
        <>
          <Divisor titulo="Métodos de Pago" />
          <Campo label="Cuenta designada" value={cuenta} onChange={(v) => { setCuenta(v); setGuardado(false); }} keyboardType="number-pad" />
        </>
      )}

      <View className="gap-4 pt-2">
        {tiene("pagos") && (
          <BotonPill color="#afc79f" textoColor="#1e2a19" className="w-full py-3.5" textClassName="font-sans text-[15px] font-semibold" sinSombra>
            Agregar otro método de pago
          </BotonPill>
        )}
        <BotonPill color="#364a2d" textoColor="#fdf8f0" onPress={guardar} className="w-full py-3.5" textClassName="font-sans text-[15px] font-semibold">
          Guardar Cambios
        </BotonPill>
        {guardado && (
          <View accessibilityRole="alert" className="self-center rounded-full bg-success-100 px-4 py-2">
            <Texto className="text-xs font-semibold text-success-700">Cambios guardados</Texto>
          </View>
        )}
      </View>
    </View>
  );
}
