import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { BarraCategorias, EncabezadoCatalogo } from "@/components/catalog-header";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import BotonPill from "@/components/movil/boton-pill";
import Texto from "@/components/ui/texto";
import { CATALOGO, SUGERENCIAS } from "@/lib/productos";

const POR_PAGINA = 16;
const TOTAL_PAGINAS = 12;

// 03 - Catálogo de compra. El Sidebar del proveedor que la web muestra a partir
// de lg no aplica en teléfono (allí también va oculto).
export default function Marketplace() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const [categoria, setCategoria] = useState("Todas las áreas");
  const [temporada, setTemporada] = useState(false);
  const [filtro, setFiltro] = useState("Filtrar Por");
  const [pagina, setPagina] = useState(1);

  // Filtrado y orden: la vista reacciona a los controles de arriba
  let visibles = categoria === "Todas las áreas" ? CATALOGO : CATALOGO.filter((p) => p.categoria === categoria);
  if (q) visibles = visibles.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  if (temporada) visibles = visibles.filter((p) => p.rating === 5);
  if (filtro === "Menor precio") visibles = [...visibles].sort((a, b) => a.price - b.price);
  if (filtro === "Mayor precio") visibles = [...visibles].sort((a, b) => b.price - a.price);
  if (filtro === "Mejor valorados") visibles = [...visibles].sort((a, b) => b.rating - a.rating);
  visibles = visibles.slice(0, POR_PAGINA);

  const paginas = [1, 2, 3];

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-28">
          <BarraCategorias activa={categoria} onCambio={setCategoria} />
          <EncabezadoCatalogo temporada={temporada} onTemporada={setTemporada} filtro={filtro} onFiltro={setFiltro} />

          {/* Paginación */}
          <View accessibilityLabel="Paginación del catálogo" className="mt-12 flex-row items-center justify-center gap-2">
            {[...paginas, TOTAL_PAGINAS].map((n, i) => (
              <View key={n} className="flex-row items-center">
                {i === paginas.length && <Texto className="px-1 font-sans text-sm text-neutral-500">…</Texto>}
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: pagina === n }}
                  onPress={() => setPagina(n)}
                  className={`h-7 min-w-7 items-center justify-center rounded-md px-2 active:scale-110 ${pagina === n ? "bg-primary-600" : ""}`}
                >
                  <Texto className={`font-sans text-sm ${pagina === n ? "font-bold text-white" : "text-neutral-700"}`}>{n}</Texto>
                </Pressable>
              </View>
            ))}
          </View>

          {/* Catálogo */}
          {visibles.length > 0 ? (
            <View className="mt-8 gap-6">
              {visibles.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </View>
          ) : (
            <Texto className="mt-16 text-center font-sans text-sm text-neutral-500">No hay productos en esta área con los filtros seleccionados.</Texto>
          )}

          {/* Sugerencias */}
          <Texto className="mt-24 font-sans text-2xl font-bold text-neutral-900">Mas Productos como estos</Texto>
          <View className="mt-6 flex-row flex-wrap gap-4 pb-24">
            {SUGERENCIAS.map((s) => (
              <BotonPill key={s} color="#364a2d" className="px-6 py-2.5" textClassName="font-sans text-sm font-medium" sinSombra>
                {s}
              </BotonPill>
            ))}
          </View>
        </View>
        <Footer />
      </ScrollView>
      <Navbar session />
    </View>
  );
}
