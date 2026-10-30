import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { Desplegable } from "@/components/dashboard/campo";
import { TarjetaTotal } from "@/components/dashboard/graficos";
import ItemProducto from "@/components/item-producto";
import Pagina from "@/components/dashboard/pagina";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import SubirFoto from "@/components/ui/subir-foto";
import Texto from "@/components/ui/texto";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import { CATEGORIAS_PROD, ESTADOS, colorEstado, eliminarProducto, useMisProductos, type Estado } from "@/lib/mis-productos";

/** Galería de fotos seleccionables (las subidas primero); el recuadro "+" abre la galería del teléfono */
export function GaleriaFotos({ fotos, foto, onFoto, onSubir }: { fotos: string[]; foto: string; onFoto: (f: string) => void; onSubir?: (uri: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-4 pb-1">
      {onSubir && (
        <SubirFoto etiqueta="Subir foto desde mi dispositivo" onFoto={onSubir}>
          <View className="h-20 w-28 items-center justify-center rounded-2xl border-2 border-dashed border-[#9EAA31] bg-primary-50/40">
            <Icono d={ICONOS.mas} size={28} color="#9EAA31" strokeWidth={1.8} />
          </View>
        </SubirFoto>
      )}
      {fotos.map((f) => (
        <Pressable
          key={f}
          accessibilityRole="button"
          accessibilityLabel="Elegir foto"
          accessibilityState={{ selected: foto === f }}
          onPress={() => onFoto(f)}
          className={`h-20 w-28 overflow-hidden rounded-2xl border-2 ${foto === f ? "border-primary-600" : "border-transparent"}`}
        >
          <Image source={imagen(f)} contentFit="cover" style={{ width: "100%", height: "100%" }} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

/** Chip de estado de publicación (colorEstado trae clases "bg-… text-…") */
export function ChipEstado({ estado, className = "" }: { estado: Estado; className?: string }) {
  const [fondo, texto] = colorEstado[estado].split(" ");
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${fondo} ${className}`}>
      <Texto className={`text-[11px] font-semibold ${texto}`}>{estado}</Texto>
    </View>
  );
}

export default function MisProductos() {
  const router = useRouter();
  const productos = useMisProductos();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas las categorías");
  const [estado, setEstado] = useState("Todos los estados");
  const visibles = productos.filter((p) => {
    const coincide = p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase());
    const porCategoria = categoria === "Todas las categorías" || p.categoria === categoria;
    const porEstado = estado === "Todos los estados" || p.estado === estado;
    return coincide && porCategoria && porEstado;
  });

  const resumen = [
    { label: "Publicados", valor: String(productos.filter((p) => p.estado === "Publicado").length), icono: IMAGENES["/icons/icon_01.png"] },
    { label: "Agotados", valor: String(productos.filter((p) => p.estado === "Agotado").length), icono: IMAGENES["/icons/icon_02.png"] },
    { label: "Borradores", valor: String(productos.filter((p) => p.estado === "Borrador").length), icono: IMAGENES["/icons/icon_03.png"] },
  ];

  const irStock = (id: string) => router.push({ pathname: "/dashboard/productos/[id]/stock", params: { id } });

  return (
    <Pagina>
      {/* Título y acción principal */}
      <View className="flex-row flex-wrap items-end justify-between gap-4">
        <View>
          <Texto className="text-2xl font-bold text-[#3F443D]">Mis productos</Texto>
          <Texto className="mt-1 text-sm text-neutral-500">Publica y administra el catálogo de tu negocio.</Texto>
        </View>
        <BotonPill color="#364a2d" textoColor="#fdf8f0" href="/dashboard/productos/nuevo" className="px-6 py-3" sinSombra>
          {(pressed) => (
            <View className="flex-row items-center gap-2">
              <Icono d={ICONOS.mas} size={16} color={pressed ? "#364a2d" : "#fdf8f0"} strokeWidth={2} />
              <Texto className="text-sm font-semibold" style={{ color: pressed ? "#364a2d" : "#fdf8f0" }}>Agregar producto</Texto>
            </View>
          )}
        </BotonPill>
      </View>

      <View className="gap-6">
        {resumen.map((r) => (
          <TarjetaTotal key={r.label} {...r} />
        ))}
      </View>

      {/* Filtros */}
      <View className="gap-4">
        <View className="flex-row items-center gap-3 rounded-full border border-[#9EAA31] bg-white px-5 py-3">
          <Icono d="M21 21l-4.35-4.35" circulos={[[11, 11, 7]]} size={16} color="#a2a79e" strokeWidth={2} />
          <TextInput value={busqueda} onChangeText={setBusqueda} placeholder="Buscar en mis productos..." placeholderTextColor="rgba(65,89,54,0.5)" className="flex-1 font-inter text-sm text-[#415936]" style={{ paddingVertical: 0 }} />
        </View>
        <Desplegable etiqueta="Filtrar por categoría" valor={categoria} opciones={["Todas las categorías", ...CATEGORIAS_PROD]} onCambio={setCategoria} />
        <Desplegable etiqueta="Filtrar por estado" valor={estado} opciones={["Todos los estados", ...ESTADOS]} onCambio={setEstado} />
      </View>

      {/* Listado en tarjetas (la tabla de escritorio de la web no aplica en teléfono) */}
      {visibles.length === 0 ? (
        <View style={SOMBRA.alta} className="rounded-[2rem] bg-white p-10">
          <Texto className="text-center text-sm text-neutral-500">No tienes productos que coincidan con la búsqueda.</Texto>
        </View>
      ) : (
        <View className="gap-4">
          {visibles.map((p) => (
            <ItemProducto
              key={p.id}
              img={p.img}
              nombre={p.nombre}
              descripcion={p.descripcion}
              categoria={p.categoria}
              detalle={`${p.stock} ${p.unidad}`}
              precio={`RD$ ${p.precio.toLocaleString("es-DO")}`}
              precioDetalle={`por ${p.unidad}`}
              onPress={() => irStock(p.id)}
              derecha={<ChipEstado estado={p.estado} />}
              abajo={
                <View className="flex-row gap-3">
                  <BotonPill color="#486440" variante="borde" textoColor="#364a2d" onPress={() => irStock(p.id)} className="flex-1 py-2" textClassName="text-xs font-semibold" sinSombra>
                    Editar stock
                  </BotonPill>
                  <BotonPill color="#fecaca" variante="borde" textoColor="#ef4444" onPress={() => eliminarProducto(p.id)} className="px-4 py-2" textClassName="text-xs font-semibold" sinSombra>
                    Eliminar
                  </BotonPill>
                </View>
              }
            />
          ))}
        </View>
      )}
    </Pagina>
  );
}
