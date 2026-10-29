import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { Campo, Desplegable } from "@/components/dashboard/campo";
import { TarjetaTotal } from "@/components/dashboard/graficos";
import Pagina from "@/components/dashboard/pagina";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import SubirFoto from "@/components/ui/subir-foto";
import Texto from "@/components/ui/texto";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import { CATEGORIAS_PROD, ESTADOS, FOTOS, UNIDADES, agregarProducto, colorEstado, eliminarProducto, useMisProductos, type Estado } from "@/lib/mis-productos";

/** Galería de fotos seleccionables (las subidas primero) */
export function GaleriaFotos({ fotos, foto, onFoto }: { fotos: string[]; foto: string; onFoto: (f: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-4 pb-1">
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
  const [formulario, setFormulario] = useState(false);

  // Producto en creación
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cat, setCat] = useState<string>(CATEGORIAS_PROD[0]);
  const [unidad, setUnidad] = useState(UNIDADES[0]);
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [foto, setFoto] = useState(FOTOS[0]);
  const [subidas, setSubidas] = useState<string[]>([]);
  const [nuevoEstado, setNuevoEstado] = useState<Estado>("Publicado");

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

  function limpiar() {
    setNombre("");
    setDescripcion("");
    setCat(CATEGORIAS_PROD[0]);
    setUnidad(UNIDADES[0]);
    setPrecio("");
    setStock("");
    setFoto(FOTOS[0]);
    setNuevoEstado("Publicado");
  }

  function guardar() {
    if (nombre.trim() === "") return;
    agregarProducto({ nombre: nombre.trim(), descripcion: descripcion.trim(), categoria: cat, unidad, precio: Number(precio) || 0, stock: Number(stock) || 0, estado: nuevoEstado, img: foto });
    limpiar();
    setFormulario(false);
  }

  const irStock = (id: string) => router.push({ pathname: "/dashboard/productos/[id]/stock", params: { id } });

  return (
    <Pagina buscador>
      {/* Título y acción principal */}
      <View className="flex-row flex-wrap items-end justify-between gap-4">
        <View>
          <Texto className="text-2xl font-bold text-[#3F443D]">Mis productos</Texto>
          <Texto className="mt-1 text-sm text-neutral-500">Publica y administra el catálogo de tu negocio.</Texto>
        </View>
        <BotonPill color="#364a2d" textoColor="#fdf8f0" onPress={() => setFormulario((f) => !f)} className="px-6 py-3" sinSombra>
          {(pressed) => (
            <View className="flex-row items-center gap-2">
              <Icono d={ICONOS.mas} size={16} color={pressed ? "#364a2d" : "#fdf8f0"} strokeWidth={2} />
              <Texto className="text-sm font-semibold" style={{ color: pressed ? "#364a2d" : "#fdf8f0" }}>{formulario ? "Cerrar formulario" : "Agregar producto"}</Texto>
            </View>
          )}
        </BotonPill>
      </View>

      <View className="gap-6">
        {resumen.map((r) => (
          <TarjetaTotal key={r.label} {...r} />
        ))}
      </View>

      {/* Formulario de alta */}
      {formulario && (
        <View style={SOMBRA.alta} className="rounded-[2rem] bg-white p-6">
          <Texto className="text-lg font-bold text-[#415936]">Nuevo producto</Texto>
          <View className="mt-5 gap-5">
            <Campo label="Nombre del producto" value={nombre} onChange={setNombre} placeholder="Ej: Aguacate Semil 34" redondo={false} />
            <Desplegable label="Categoría" etiqueta="Categoría" valor={cat} opciones={CATEGORIAS_PROD} onCambio={setCat} />
            <Campo label="Descripción" value={descripcion} onChange={setDescripcion} placeholder="Describe calidad, presentación y origen del producto." redondo={false} multiline />
            <Desplegable label="Unidad de medida" etiqueta="Unidad de medida" valor={unidad} opciones={UNIDADES} onCambio={setUnidad} />
            <Campo label={`Precio por ${unidad.toLowerCase()} (RD$)`} value={precio} onChange={(t) => setPrecio(t.replace(/[^\d.]/g, ""))} placeholder="0.00" redondo={false} keyboardType="decimal-pad" />
            <Campo label={`Existencia disponible (${unidad})`} value={stock} onChange={(t) => setStock(t.replace(/[^\d]/g, ""))} placeholder="0" redondo={false} keyboardType="number-pad" />
            <Desplegable label="Estado de publicación" etiqueta="Estado de publicación" valor={nuevoEstado} opciones={ESTADOS} onCambio={(v) => setNuevoEstado(v as Estado)} />
            <View>
              <View className="mb-3 flex-row flex-wrap items-center justify-between gap-3">
                <Texto className="text-sm text-[#3F443D]">Foto del producto</Texto>
                <SubirFoto
                  etiqueta="Subir desde mi dispositivo"
                  onFoto={(uri) => {
                    setSubidas((prev) => [uri, ...prev]);
                    setFoto(uri);
                  }}
                />
              </View>
              <GaleriaFotos fotos={[...subidas, ...FOTOS]} foto={foto} onFoto={setFoto} />
            </View>
          </View>
          <View className="mt-6 flex-row flex-wrap gap-4">
            <BotonPill color="#364a2d" textoColor="#fdf8f0" onPress={guardar} className="px-8 py-3" textClassName="text-sm" sinSombra>
              Guardar producto
            </BotonPill>
            <BotonPill color="#486440" variante="borde" textoColor="#364a2d" onPress={() => { limpiar(); setFormulario(false); }} className="px-8 py-3" textClassName="text-sm" sinSombra>
              Cancelar
            </BotonPill>
          </View>
        </View>
      )}

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
            <View key={p.id} style={SOMBRA.card} className="rounded-[1.5rem] bg-white p-4">
              <Pressable accessibilityRole="link" accessibilityLabel={`Editar ${p.nombre}`} onPress={() => irStock(p.id)} className="flex-row items-start gap-4">
                <Image source={imagen(p.img)} accessibilityLabel={p.nombre} contentFit="cover" style={{ width: 64, height: 64, borderRadius: 16 }} />
                <View className="min-w-0 flex-1">
                  <View className="flex-row items-start justify-between gap-3">
                    <Texto className="flex-1 text-[15px] font-bold text-[#3F443D]">{p.nombre}</Texto>
                    <ChipEstado estado={p.estado} />
                  </View>
                  <Texto numberOfLines={2} className="mt-1 text-xs text-neutral-500">{p.descripcion}</Texto>
                  <Texto className="mt-2 text-xs text-neutral-500">{p.categoria} · {p.stock} {p.unidad}</Texto>
                  <Texto className="mt-1 text-base font-bold text-primary-600">
                    RD$ {p.precio.toLocaleString("es-DO")}<Texto className="text-xs font-normal text-neutral-500"> / {p.unidad}</Texto>
                  </Texto>
                </View>
              </Pressable>
              <View className="mt-4 flex-row gap-3">
                <BotonPill color="#486440" variante="borde" textoColor="#364a2d" onPress={() => irStock(p.id)} className="flex-1 py-2" textClassName="text-xs font-semibold" sinSombra>
                  Editar stock
                </BotonPill>
                <BotonPill color="#fecaca" variante="borde" textoColor="#ef4444" onPress={() => eliminarProducto(p.id)} className="px-4 py-2" textClassName="text-xs font-semibold" sinSombra>
                  Eliminar
                </BotonPill>
              </View>
            </View>
          ))}
        </View>
      )}
    </Pagina>
  );
}
