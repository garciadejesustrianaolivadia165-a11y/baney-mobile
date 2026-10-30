import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";

import Texto from "@/components/ui/texto";
import { imagen, type FuenteImagen } from "@/lib/imagenes";

/**
 * Tarjeta de ítem de producto (el recuadro verde grisáceo del "Detalles De Pedido"):
 * foto, nombre, categoría · cantidad y precio. La usan TODAS las listas de productos
 * (detalle de pedido del proveedor y del cliente, carrito, confirmación, Mis productos)
 * para que se vean iguales. `derecha` sustituye al menú "⋯" y `abajo` añade una fila
 * dentro del mismo recuadro (cantidad, botones…).
 */
export default function ItemProducto({
  img,
  nombre,
  categoria,
  detalle,
  precio,
  precioDetalle,
  descripcion,
  onPress,
  onOpciones,
  derecha,
  abajo,
  className = "",
}: {
  img: FuenteImagen | string;
  nombre: string;
  /** Texto verde ("Tubérculos"); va seguido de ` · detalle` */
  categoria?: string;
  /** "2 libras", "San Juan · 40 qq"… */
  detalle?: string;
  precio: string;
  /** Texto pequeño junto al precio ("/ lb", "RD$ 300.00 por unidad") */
  precioDetalle?: string;
  /** Línea opcional bajo el nombre (descripción corta de Mis productos) */
  descripcion?: string;
  onPress?: () => void;
  /** Botón "⋯" de la referencia */
  onOpciones?: () => void;
  derecha?: ReactNode;
  abajo?: ReactNode;
  className?: string;
}) {
  const fuente = typeof img === "string" ? imagen(img) : img;
  const Contenedor = onPress ? Pressable : View;
  return (
    <View className={`rounded-2xl bg-neutral-100 p-3 pr-5 ${className}`}>
      <Contenedor accessibilityRole={onPress ? "button" : undefined} accessibilityLabel={onPress ? nombre : undefined} onPress={onPress} className="flex-row items-center gap-4">
        <Image source={fuente} accessibilityLabel={nombre} contentFit="cover" style={{ width: 72, height: 72, borderRadius: 12 }} />
        <View className="min-w-0 flex-1">
          <Texto numberOfLines={2} className="font-sans text-base font-semibold text-neutral-900">{nombre}</Texto>
          {descripcion ? <Texto numberOfLines={2} className="text-xs text-neutral-500">{descripcion}</Texto> : null}
          {(categoria || detalle) && (
            <Texto className="text-sm text-neutral-500">
              {categoria ? <Texto className="text-sm font-medium text-primary-500">{categoria}</Texto> : null}
              {categoria && detalle ? " · " : ""}
              {detalle}
            </Texto>
          )}
          <Texto className="mt-1 font-sans text-lg font-bold text-neutral-900">{precio}</Texto>
          {precioDetalle ? <Texto className="text-xs text-neutral-500">{precioDetalle}</Texto> : null}
        </View>
        {derecha ??
          (onOpciones && (
            <Pressable accessibilityRole="button" accessibilityLabel={`Opciones de ${nombre}`} onPress={onOpciones} hitSlop={8} className="px-1">
              <Texto className="text-xl leading-none text-neutral-500">⋯</Texto>
            </Pressable>
          ))}
      </Contenedor>
      {abajo && <View className="mt-3">{abajo}</View>}
    </View>
  );
}
