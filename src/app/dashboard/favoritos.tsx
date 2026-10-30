import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import ItemProducto from "@/components/item-producto";
import BotonPill from "@/components/movil/boton-pill";
import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { alternarDestacado, useFavoritos } from "@/lib/favoritos";
import { useMisProductos } from "@/lib/mis-productos";
import { pesosRD } from "@/lib/pedidos-proveedor";

export const CORAZON = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

// Favoritos del proveedor: los productos de su catálogo marcados con el corazón en "Tus Productos".
export default function FavoritosProveedor() {
  const router = useRouter();
  const { destacados } = useFavoritos();
  const productos = useMisProductos().filter((p) => destacados.includes(p.id));

  return (
    <Pagina>
      <TituloSeccion titulo="Favoritos" enlace="Ir al inicio" href="/dashboard" />
      <Texto className="-mt-3 text-sm text-neutral-500">Los productos que marcas con el corazón en "Tus Productos". Úsalos para tener a mano lo que más vendes.</Texto>

      {productos.length === 0 ? (
        <View style={SOMBRA.card} className="items-center gap-3 rounded-[1.5rem] bg-white px-6 py-12">
          <Icono d={CORAZON} size={40} color="#bdc1b9" relleno />
          <Texto className="font-sans text-lg font-semibold text-neutral-700">Aún no tienes favoritos</Texto>
          <Texto className="text-center text-sm text-neutral-500">Desliza el carrusel "Tus Productos" del inicio y toca el corazón de los productos que quieras destacar.</Texto>
          <BotonPill color="#364a2d" textoColor="#fdf8f0" href="/dashboard" className="mt-2 px-8 py-3" textClassName="font-sans text-sm">
            Ir a Tus Productos
          </BotonPill>
        </View>
      ) : (
        <View className="gap-4">
          {productos.map((p) => (
            <ItemProducto
              key={p.id}
              img={p.img}
              nombre={p.nombre}
              descripcion={p.descripcion}
              categoria={p.categoria}
              detalle={`${p.stock} ${p.unidad}`}
              precio={pesosRD(p.precio)}
              precioDetalle={`por ${p.unidad}`}
              onPress={() => router.push({ pathname: "/dashboard/productos/[id]/stock", params: { id: p.id } })}
              derecha={
                <Pressable accessibilityRole="button" accessibilityLabel={`Quitar ${p.nombre} de favoritos`} onPress={() => alternarDestacado(p.id)} hitSlop={8}>
                  <Icono d={CORAZON} size={24} color="#ef4444" relleno />
                </Pressable>
              }
            />
          ))}
        </View>
      )}
    </Pagina>
  );
}
