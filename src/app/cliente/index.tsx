import { useState } from "react";
import { Pressable, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { BarraCategorias, EncabezadoCatalogo } from "@/components/catalog-header";
import Pagina from "@/components/dashboard/pagina";
import BotonPill from "@/components/movil/boton-pill";
import ProductCard from "@/components/product-card";
import Texto from "@/components/ui/texto";
import { CATALOGO, SUGERENCIAS } from "@/lib/productos";

const POR_PAGINA = 16;
const TOTAL_PAGINAS = 12;

// 03 - Marketplace: inicio del cliente dentro de su armazón (menú lateral, logo,
// campanita y foto). Sin la cabecera pública ni el buscador de la web.
export default function MarketplaceCliente() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const [categoria, setCategoria] = useState("Todas las áreas");
  const [temporada, setTemporada] = useState(false);
  const [filtro, setFiltro] = useState("Filtrar Por");
  const [pagina, setPagina] = useState(1);

  let visibles = categoria === "Todas las áreas" ? CATALOGO : CATALOGO.filter((p) => p.categoria === categoria);
  if (q) visibles = visibles.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  if (temporada) visibles = visibles.filter((p) => p.rating === 5);
  if (filtro === "Menor precio") visibles = [...visibles].sort((a, b) => a.price - b.price);
  if (filtro === "Mayor precio") visibles = [...visibles].sort((a, b) => b.price - a.price);
  if (filtro === "Mejor valorados") visibles = [...visibles].sort((a, b) => b.rating - a.rating);
  visibles = visibles.slice(0, POR_PAGINA);
  const paginas = [1, 2, 3];

  return (
    <Pagina className="gap-0">
      <BarraCategorias activa={categoria} onCambio={setCategoria} />
      <EncabezadoCatalogo temporada={temporada} onTemporada={setTemporada} filtro={filtro} onFiltro={setFiltro} />

      <View accessibilityLabel="Paginación del catálogo" className="mt-10 flex-row items-center justify-center gap-2">
        {[...paginas, TOTAL_PAGINAS].map((n, i) => (
          <View key={n} className="flex-row items-center">
            {i === paginas.length && <Texto className="px-1 font-sans text-sm text-neutral-500">…</Texto>}
            <Pressable accessibilityRole="button" accessibilityState={{ selected: pagina === n }} onPress={() => setPagina(n)} className={`h-7 min-w-7 items-center justify-center rounded-md px-2 active:scale-110 ${pagina === n ? "bg-primary-600" : ""}`}>
              <Texto className={`font-sans text-sm ${pagina === n ? "font-bold text-white" : "text-neutral-700"}`}>{n}</Texto>
            </Pressable>
          </View>
        ))}
      </View>

      {visibles.length > 0 ? (
        <View className="mt-8 gap-6">
          {visibles.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </View>
      ) : (
        <Texto className="mt-16 text-center font-sans text-sm text-neutral-500">No hay productos en esta área con los filtros seleccionados.</Texto>
      )}

      <Texto className="mt-16 font-sans text-2xl font-bold text-neutral-900">Mas Productos como estos</Texto>
      <View className="mt-6 flex-row flex-wrap gap-4 pb-6">
        {SUGERENCIAS.map((s) => (
          <BotonPill key={s} color="#364a2d" className="px-6 py-2.5" textClassName="font-sans text-sm font-medium" sinSombra>
            {s}
          </BotonPill>
        ))}
      </View>
    </Pagina>
  );
}
