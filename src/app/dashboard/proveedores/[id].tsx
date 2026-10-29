import { View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import ProductCarousel from "@/components/product-carousel";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { imagen } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import { buscarProveedor } from "@/lib/proveedores";
import { TELEFONO, UBICACION } from "../bandeja/pedidos/[id]";

// Detalle de otro proveedor: su empresa, qué produce y, en el carrusel del inicio, qué distribuye y a qué precio
export default function ProveedorDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const prov = buscarProveedor(id);

  if (!prov) {
    return (
      <Pagina>
        <TituloSeccion titulo="Proveedor no encontrado" enlace="Volver Atras" href="/dashboard" />
      </Pagina>
    );
  }

  return (
    <Pagina>
      <TituloSeccion titulo="Detalles del Proveedor" enlace="Volver Atras" href="/dashboard" />

      <View style={SOMBRA.card} className="rounded-3xl bg-white p-5">
        <View className="flex-row items-center gap-4">
          <Image source={imagen(prov.img)} accessibilityLabel={prov.nombre} contentFit="cover" style={{ width: 64, height: 64, borderRadius: 32 }} />
          <View className="min-w-0 flex-1">
            <Texto className="font-sans text-xl font-semibold text-neutral-900">{prov.nombre}</Texto>
            <Texto className="text-sm text-neutral-500">{prov.empresa.nombre} · {prov.lugar}</Texto>
            <View className="mt-2 flex-row items-center gap-2">
              <View className="flex-row items-center gap-1 rounded-full bg-warning-100 px-2.5 py-1">
                <Icono d={ICONOS.estrella} size={10} color="#b45309" relleno />
                <Texto className="text-[10px] font-semibold text-warning-700">{prov.calificacion.toFixed(1)}</Texto>
              </View>
              <View className="rounded-full bg-neutral-100 px-2.5 py-1">
                <Texto className="text-[10px] font-semibold text-neutral-600">En BANEY desde {prov.desde}</Texto>
              </View>
            </View>
          </View>
        </View>

        <Texto className="mt-4 text-sm leading-relaxed text-neutral-600">{prov.descripcion}</Texto>

        <View className="mt-4 flex-row flex-wrap gap-2">
          {prov.categorias.map((c) => (
            <View key={c} className="rounded-full bg-primary-50 px-3 py-1">
              <Texto className="text-xs font-semibold text-primary-600">{c}</Texto>
            </View>
          ))}
        </View>
      </View>

      <View style={SOMBRA.card} className="rounded-3xl bg-white p-5">
        <Texto className="font-sans text-lg font-semibold text-[#415936]">Empresa</Texto>
        <View className="mt-4 gap-3">
          {[
            { d: ICONOS.empresa, t: `${prov.empresa.nombre} · RNC ${prov.empresa.rnc}` },
            { d: TELEFONO, t: prov.empresa.telefono },
            { d: ICONOS.correo, t: prov.empresa.correo },
            { d: UBICACION, t: prov.empresa.direccion, circ: [[12, 10, 3]] as [number, number, number][] },
          ].map((f) => (
            <View key={f.t} className="flex-row items-center gap-3">
              <Icono d={f.d} circulos={f.circ} size={20} color="#878c83" />
              <Texto className="flex-1 text-sm text-neutral-700">{f.t}</Texto>
            </View>
          ))}
        </View>
      </View>

      <View>
        <View className="flex-row items-end justify-between">
          <Texto className="font-sans text-lg font-bold tracking-wide text-neutral-900">LO QUE DISTRIBUYE</Texto>
          <Texto className="text-xs text-neutral-500">{prov.productos.length} productos</Texto>
        </View>
        <ProductCarousel items={prov.productos} />
      </View>
    </Pagina>
  );
}
