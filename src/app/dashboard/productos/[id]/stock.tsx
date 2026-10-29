import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Campo, Desplegable } from "@/components/dashboard/campo";
import Pagina from "@/components/dashboard/pagina";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import SubirFoto from "@/components/ui/subir-foto";
import Texto from "@/components/ui/texto";
import { imagen } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import { CATEGORIAS_PROD, ESTADOS, FOTOS, UNIDADES, actualizarProducto, buscarProducto, eliminarProducto, type Estado } from "@/lib/mis-productos";
import { ChipEstado, GaleriaFotos } from "../index";

export default function EditarProducto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const producto = buscarProducto(id);

  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [categoria, setCategoria] = useState<string>(producto?.categoria ?? CATEGORIAS_PROD[0]);
  const [unidad, setUnidad] = useState(producto?.unidad ?? UNIDADES[0]);
  const [precio, setPrecio] = useState(String(producto?.precio ?? ""));
  const [stock, setStock] = useState(String(producto?.stock ?? ""));
  const [estado, setEstado] = useState<Estado>(producto?.estado ?? "Publicado");
  const [foto, setFoto] = useState(producto?.img ?? FOTOS[0]);
  const [subidas, setSubidas] = useState<string[]>([]);
  const [guardado, setGuardado] = useState(false);

  // La foto actual primero, luego las subidas y por último las de la galería
  const galeria = [...new Set([foto, ...subidas, ...FOTOS])];

  if (!producto) {
    return (
      <Pagina>
        <View style={SOMBRA.alta} className="items-center rounded-[2rem] bg-white p-10">
          <Texto className="text-center text-sm text-neutral-500">Ese producto ya no existe en tu catálogo.</Texto>
          <BotonPill color="#364a2d" textoColor="#fdf8f0" href="/dashboard/productos" className="mt-6 px-8 py-3" textClassName="text-sm">
            Volver a Mis productos
          </BotonPill>
        </View>
      </Pagina>
    );
  }

  const existencias = Number(stock) || 0;
  const tocar = () => setGuardado(false);

  function ajustar(delta: number) {
    setStock(String(Math.max(0, existencias + delta)));
    tocar();
  }

  function guardar() {
    actualizarProducto(producto!.id, { nombre: nombre.trim() || producto!.nombre, descripcion: descripcion.trim(), categoria, unidad, precio: Number(precio) || 0, stock: existencias, estado, img: foto });
    setGuardado(true);
  }

  function borrar() {
    eliminarProducto(producto!.id);
    router.replace("/dashboard/productos");
  }

  return (
    <Pagina>
      {/* Cabecera */}
      <View className="flex-row flex-wrap items-center gap-4">
        <Pressable accessibilityRole="link" accessibilityLabel="Volver a Mis productos" onPress={() => router.push("/dashboard/productos")} className="h-11 w-11 items-center justify-center rounded-full border border-[#E3E6E0] active:bg-primary-600">
          {({ pressed }) => <Icono d={ICONOS.volver} size={16} color={pressed ? "#fff" : "#3F443D"} strokeWidth={2} />}
        </Pressable>
        <View className="min-w-0 flex-1">
          <Texto numberOfLines={1} className="text-2xl font-bold text-[#3F443D]">{producto.nombre}</Texto>
          <Texto className="mt-1 text-sm text-neutral-500">Modifica la información y las existencias de tu producto.</Texto>
        </View>
        <ChipEstado estado={estado} className="px-4 py-1.5" />
      </View>

      {/* Existencias */}
      <View style={SOMBRA.alta} className="rounded-[2rem] bg-white p-6">
        <Texto className="text-lg font-bold text-[#415936]">Existencias</Texto>
        <View className="mt-5 overflow-hidden rounded-2xl">
          <Image source={imagen(foto)} accessibilityLabel={producto.nombre} contentFit="cover" style={{ width: "100%", height: 160 }} />
        </View>
        <View className="mt-6 flex-row items-center justify-between gap-4">
          <Pressable accessibilityRole="button" accessibilityLabel="Restar una unidad" onPress={() => ajustar(-1)} className="h-11 w-11 items-center justify-center rounded-full border-2 border-primary-500 active:bg-primary-50">
            <Icono d="M5 12h14" size={16} color="#364a2d" strokeWidth={2.2} />
          </Pressable>
          <View className="items-center">
            <TextInput
              keyboardType="number-pad"
              value={stock}
              onChangeText={(t) => {
                setStock(t.replace(/[^\d]/g, ""));
                tocar();
              }}
              accessibilityLabel="Existencia disponible"
              className="w-28 text-center font-inter text-4xl font-bold text-[#3F443D]"
            />
            <Texto className="text-xs text-neutral-500">{unidad} disponibles</Texto>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Sumar una unidad" onPress={() => ajustar(1)} className="h-11 w-11 items-center justify-center rounded-full border-2 border-primary-500 active:bg-primary-50">
            <Icono d={ICONOS.mas} size={16} color="#364a2d" strokeWidth={2.2} />
          </Pressable>
        </View>
        <View className="mt-5 flex-row flex-wrap gap-3">
          {[10, 50, 100].map((n) => (
            <Pressable key={n} accessibilityRole="button" onPress={() => ajustar(n)} className="rounded-full bg-primary-50 px-4 py-2 active:bg-primary-100">
              <Texto className="text-xs font-semibold text-primary-600">+{n}</Texto>
            </Pressable>
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setStock("0");
              setEstado("Agotado");
              tocar();
            }}
            className="rounded-full bg-error-50 px-4 py-2 active:bg-error-100"
          >
            <Texto className="text-xs font-semibold text-error-500">Marcar agotado</Texto>
          </Pressable>
        </View>
        <Texto className="mt-5 border-t border-neutral-100 pt-5 text-sm text-neutral-500">Valor del inventario</Texto>
        <Texto className="text-2xl font-bold text-primary-600">RD$ {(existencias * (Number(precio) || 0)).toLocaleString("es-DO")}</Texto>
      </View>

      {/* Datos del producto */}
      <View style={SOMBRA.alta} className="rounded-[2rem] bg-white p-6">
        <Texto className="text-lg font-bold text-[#415936]">Información del producto</Texto>
        <View className="mt-5 gap-5">
          <Campo label="Nombre del producto" value={nombre} onChange={(t) => { setNombre(t); tocar(); }} redondo={false} />
          <Desplegable label="Categoría" etiqueta="Categoría" valor={categoria} opciones={CATEGORIAS_PROD} onCambio={(v) => { setCategoria(v); tocar(); }} />
          <Campo label="Descripción" value={descripcion} onChange={(t) => { setDescripcion(t); tocar(); }} redondo={false} multiline />
          <Desplegable label="Unidad de medida" etiqueta="Unidad de medida" valor={unidad} opciones={UNIDADES} onCambio={(v) => { setUnidad(v); tocar(); }} />
          <Campo label={`Precio por ${unidad.toLowerCase()} (RD$)`} value={precio} onChange={(t) => { setPrecio(t.replace(/[^\d.]/g, "")); tocar(); }} redondo={false} keyboardType="decimal-pad" />
          <Desplegable label="Estado de publicación" etiqueta="Estado de publicación" valor={estado} opciones={ESTADOS} onCambio={(v) => { setEstado(v as Estado); tocar(); }} />
          <View>
            <View className="mb-3 flex-row flex-wrap items-center justify-between gap-3">
              <Texto className="text-sm text-[#3F443D]">Foto del producto</Texto>
              <SubirFoto
                etiqueta="Subir desde mi dispositivo"
                onFoto={(uri) => {
                  setSubidas((prev) => [uri, ...prev]);
                  setFoto(uri);
                  tocar();
                }}
              />
            </View>
            <GaleriaFotos fotos={galeria} foto={foto} onFoto={(f) => { setFoto(f); tocar(); }} />
          </View>
        </View>

        <View className="mt-6 flex-row flex-wrap items-center gap-4">
          <BotonPill color="#364a2d" textoColor="#fdf8f0" onPress={guardar} className="px-8 py-3" textClassName="text-sm" sinSombra>
            Guardar cambios
          </BotonPill>
          <BotonPill color="#486440" variante="borde" textoColor="#364a2d" href="/dashboard/productos" className="px-8 py-3" textClassName="text-sm" sinSombra>
            Volver
          </BotonPill>
          <BotonPill color="#fecaca" variante="borde" textoColor="#ef4444" onPress={borrar} className="px-6 py-3" textClassName="text-sm" sinSombra>
            Eliminar producto
          </BotonPill>
          {guardado && (
            <View accessibilityRole="alert" className="rounded-full bg-success-100 px-4 py-2">
              <Texto className="text-xs font-semibold text-success-700">Cambios guardados</Texto>
            </View>
          )}
        </View>
      </View>
    </Pagina>
  );
}
