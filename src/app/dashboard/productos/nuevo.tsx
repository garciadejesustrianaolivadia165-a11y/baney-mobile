import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import { Campo, Desplegable } from "@/components/dashboard/campo";
import Pagina from "@/components/dashboard/pagina";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { CATEGORIAS_PROD, ESTADOS, FOTOS, UNIDADES, agregarProducto, type Estado } from "@/lib/mis-productos";
import { GaleriaFotos } from "./index";

// Alta de producto en su propia pantalla (desde "Agregar producto" de Mis productos)
export default function NuevoProducto() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cat, setCat] = useState<string>(CATEGORIAS_PROD[0]);
  const [unidad, setUnidad] = useState(UNIDADES[0]);
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [foto, setFoto] = useState(FOTOS[0]);
  const [subidas, setSubidas] = useState<string[]>([]);
  const [nuevoEstado, setNuevoEstado] = useState<Estado>("Publicado");

  function guardar() {
    if (nombre.trim() === "") return;
    agregarProducto({ nombre: nombre.trim(), descripcion: descripcion.trim(), categoria: cat, unidad, precio: Number(precio) || 0, stock: Number(stock) || 0, estado: nuevoEstado, img: foto });
    router.replace("/dashboard/productos");
  }

  return (
    <Pagina>
      <View className="flex-row items-center gap-4">
        <Pressable accessibilityRole="link" accessibilityLabel="Volver a Mis productos" onPress={() => router.back()} className="h-11 w-11 items-center justify-center rounded-full border border-[#E3E6E0] active:bg-primary-600">
          {({ pressed }) => <Icono d={ICONOS.volver} size={16} color={pressed ? "#fff" : "#3F443D"} strokeWidth={2} />}
        </Pressable>
        <View className="min-w-0 flex-1">
          <Texto className="text-2xl font-bold text-[#3F443D]">Nuevo producto</Texto>
          <Texto className="mt-1 text-sm text-neutral-500">Publica un producto en el catálogo de tu negocio.</Texto>
        </View>
      </View>

        <View style={SOMBRA.alta} className="rounded-[2rem] bg-white p-6">
          <Texto className="text-lg font-bold text-[#415936]">Información del producto</Texto>
          <View className="mt-5 gap-5">
            <Campo label="Nombre del producto" value={nombre} onChange={setNombre} placeholder="Ej: Aguacate Semil 34" redondo={false} />
            <Desplegable label="Categoría" etiqueta="Categoría" valor={cat} opciones={CATEGORIAS_PROD} onCambio={setCat} />
            <Campo label="Descripción" value={descripcion} onChange={setDescripcion} placeholder="Describe calidad, presentación y origen del producto." redondo={false} multiline />
            <Desplegable label="Unidad de medida" etiqueta="Unidad de medida" valor={unidad} opciones={UNIDADES} onCambio={setUnidad} />
            <Campo label={`Precio por ${unidad.toLowerCase()} (RD$)`} value={precio} onChange={(t) => setPrecio(t.replace(/[^\d.]/g, ""))} placeholder="0.00" redondo={false} keyboardType="decimal-pad" />
            <Campo label={`Existencia disponible (${unidad})`} value={stock} onChange={(t) => setStock(t.replace(/[^\d]/g, ""))} placeholder="0" redondo={false} keyboardType="number-pad" />
            <Desplegable label="Estado de publicación" etiqueta="Estado de publicación" valor={nuevoEstado} opciones={ESTADOS} onCambio={(v) => setNuevoEstado(v as Estado)} />
            <View>
              <Texto className="mb-3 text-sm text-[#3F443D]">Foto del producto</Texto>
              <GaleriaFotos
                fotos={[...subidas, ...FOTOS]}
                foto={foto}
                onFoto={setFoto}
                onSubir={(uri) => {
                  setSubidas((prev) => [uri, ...prev]);
                  setFoto(uri);
                }}
              />
            </View>
          </View>
          <View className="mt-6 flex-row flex-wrap gap-4">
            <BotonPill color="#364a2d" textoColor="#fdf8f0" onPress={guardar} className="px-8 py-3" textClassName="text-sm" sinSombra>
              Guardar producto
            </BotonPill>
            <BotonPill color="#486440" variante="borde" textoColor="#364a2d" onPress={() => router.back()} className="px-8 py-3" textClassName="text-sm" sinSombra>
              Cancelar
            </BotonPill>
          </View>
        </View>


    </Pagina>
  );
}
