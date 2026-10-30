import { View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import ItemProducto from "@/components/item-producto";
import Mapa from "@/components/mapa";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { IMAGENES } from "@/lib/imagenes";

// TODO: reemplazar por la imagen real del producto cuando se exporte del Figma
const IMG_ITEM = IMAGENES["/images/image_home/image_home_04.png"];

const items = [
  { nombre: "Lechuga importada", categoria: "Tubérculos", cantidad: "2 libras", precio: "$300.00" },
  { nombre: "Lechuga importada", categoria: "Tubérculos", cantidad: "2 libras", precio: "$300.00" },
  { nombre: "Lechuga importada", categoria: "Tubérculos", cantidad: "2 libras", precio: "$300.00" },
];

const resumen = [
  { label: "ID transacción", valor: "#12345678910" },
  { label: "Lechuga Importada", valor: "$300.00" },
  { label: "Lechuga Importada", valor: "$300.00" },
  { label: "Lechuga Importada", valor: "$300.00" },
  { label: "Costo subtotal", valor: "$900.00" },
  { label: "ITBIS", valor: "$300.00" },
];

export const TELEFONO = "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z";
export const UBICACION = "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z";

/** Mapa con la dirección y el chip de destino (lo comparten pedidos y rutas) */
export function MapaPedido({ alto = 288, destino = "MELLOS'S COLMADO", etiqueta = "Destino", chipColor = "#20221f" }: { alto?: number; destino?: string; etiqueta?: string; chipColor?: string }) {
  return (
    <View style={{ height: alto }} className="overflow-hidden rounded-[1.25rem] bg-neutral-200">
      <Mapa />
      <View pointerEvents="none" className="absolute right-6 top-6 items-end rounded-2xl bg-white/75 px-4 py-2">
        <Texto className="text-2xl font-bold text-neutral-900">Calle Juan Horacio #16</Texto>
        <Texto className="text-sm text-neutral-500">Santo Domingo, Republica Dominicana</Texto>
      </View>
      <View pointerEvents="none" style={SOMBRA.boton} className="absolute bottom-6 left-6 flex-row items-center gap-3 rounded-full bg-white py-2 pl-2 pr-6">
        <View className="h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: chipColor }}>
          <Icono d={ICONOS.pin} size={16} color="#fff" relleno />
        </View>
        <View>
          <Texto className="text-[10px] uppercase tracking-wide text-neutral-400">{etiqueta}</Texto>
          <Texto className="text-sm font-bold tracking-wide text-neutral-900">{destino}</Texto>
        </View>
      </View>
    </View>
  );
}

/** Bloque "Pedido de · Cesar Valdez · teléfono · dirección" */
export function DatosCliente({ titulo, redondo = true }: { titulo: string; redondo?: boolean }) {
  return (
    <View className="gap-4">
      <View>
        <Texto className={redondo ? "font-sans text-lg font-semibold text-[#3F443D]" : "text-2xl font-bold text-neutral-900"}>{titulo}</Texto>
        <View className="mt-3 flex-row items-center gap-3">
          <Image source={IMAGENES["/images/image_home/image_home_09.png"]} accessibilityLabel="Cesar Valdez" contentFit="cover" style={{ width: 48, height: 48, borderRadius: redondo ? 24 : 12 }} />
          <View>
            <Texto className="font-sans text-xl font-semibold text-neutral-900">Cesar Valdez</Texto>
            <Texto className="text-sm text-neutral-500">ID 123456</Texto>
          </View>
        </View>
      </View>
      <View className="gap-3">
        <View className="flex-row items-center gap-3">
          <Icono d={TELEFONO} size={20} color="#878c83" />
          <Texto className="text-sm text-neutral-700">(809) 000-0000</Texto>
        </View>
        <View className="flex-row items-center gap-3">
          <Icono d={UBICACION} circulos={[[12, 10, 3]]} size={20} color="#878c83" />
          <Texto className="text-sm text-neutral-700">Barrio Los Minas, San Juan de la Maguana</Texto>
        </View>
      </View>
    </View>
  );
}

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Pagina>
      <TituloSeccion titulo="Detalles De Pedido" enlace="Volver Atras" href="/dashboard/rutas" />

      <View style={SOMBRA.card} className="rounded-3xl bg-white p-2 pb-8">
        <MapaPedido />

        <View className="gap-6 px-4 pt-6">
          <DatosCliente titulo={`Pedido #${id}`} />
          <View className="flex-row gap-3">
            <BotonPill color="#afc79f" textoColor="#1e2a19" className="flex-1 px-4 py-2.5" textClassName="font-sans text-sm" sinSombra>
              Agregar Ítems
            </BotonPill>
            <BotonPill color="#f87171" variante="borde" textoColor="#ef4444" className="flex-1 px-4 py-2.5" textClassName="font-sans text-sm" sinSombra>
              Cancelar orden
            </BotonPill>
          </View>
        </View>

        {/* Ítems + resumen */}
        <View className="mt-8 gap-10 px-4">
          <View className="gap-5">
            {items.map((item, i) => (
              <ItemProducto key={i} img={IMG_ITEM} nombre={item.nombre} categoria={item.categoria} detalle={item.cantidad} precio={item.precio} onOpciones={() => {}} />
            ))}
          </View>

          <View className="w-full max-w-72 self-center">
            <View className="gap-4">
              {resumen.map((r, i) => (
                <View key={i} className="flex-row items-center justify-between">
                  <Texto className="text-xs uppercase tracking-wide text-neutral-500">{r.label}</Texto>
                  <Texto className="text-sm font-semibold text-neutral-900">{r.valor}</Texto>
                </View>
              ))}
            </View>
            <View className="mt-4 flex-row items-center justify-between border-t-2 border-neutral-800 pt-4">
              <Texto className="text-xs font-semibold uppercase tracking-wide text-neutral-700">Total</Texto>
              <Texto className="font-sans text-base font-bold text-neutral-900">$1200.00</Texto>
            </View>
          </View>
        </View>
      </View>
    </Pagina>
  );
}
