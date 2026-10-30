import { View } from "react-native";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import BotonPill from "@/components/movil/boton-pill";
import ProductCard from "@/components/product-card";
import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { useFavoritos } from "@/lib/favoritos";
import { CORAZON } from "../dashboard/favoritos";

// Lista de deseos del cliente: los productos del marketplace marcados con el corazón.
export default function FavoritosCliente() {
  const { productos } = useFavoritos();

  return (
    <Pagina>
      <TituloSeccion titulo="Favoritos" enlace="Ir al marketplace" href="/cliente" />
      {productos.length === 0 ? (
        <View style={SOMBRA.card} className="items-center gap-3 rounded-[1.5rem] bg-white px-6 py-12">
          <Icono d={CORAZON} size={40} color="#bdc1b9" relleno />
          <Texto className="font-sans text-lg font-semibold text-neutral-700">Tu lista de deseos está vacía</Texto>
          <Texto className="text-center text-sm text-neutral-500">Toca el corazón de un producto del marketplace o "Agregar a lista de deseos" en su ficha.</Texto>
          <BotonPill color="#364a2d" textoColor="#fdf8f0" href="/cliente" className="mt-2 px-8 py-3" textClassName="font-sans text-sm">
            Explorar productos
          </BotonPill>
        </View>
      ) : (
        <View className="gap-6">
          {productos.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </View>
      )}
    </Pagina>
  );
}
