import { useState } from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";

import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { agregarAlCarrito } from "@/lib/carrito";
import { alternarFavorito, useFavoritos } from "@/lib/favoritos";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import type { Product } from "@/types/product";

function Stars({ rating }: { rating: number }) {
  return (
    <View className="flex-row gap-0.5" accessibilityLabel={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Svg key={star} viewBox="0 0 20 20" width={16} height={16}>
          <Path fill={star <= rating ? "#fbbf24" : "#d3d6d0"} d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </Svg>
      ))}
    </View>
  );
}

const CORAZON = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

function Accion({ icono, texto, onPress, className = "" }: { icono: number; texto: string; onPress?: () => void; className?: string }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={SOMBRA.boton} className={`flex-row items-center gap-2 rounded-full px-5 py-2 active:bg-white ${className}`}>
      <Image source={icono} contentFit="contain" style={{ width: 20, height: 20 }} />
      <Texto className="font-sans text-sm font-semibold text-white">{texto}</Texto>
    </Pressable>
  );
}

// En móvil no hay hover: tocar la foto muestra/oculta las acciones de compra.
export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [acciones, setAcciones] = useState(false);
  const favorito = useFavoritos().productos.some((f) => f.id === product.id);
  const [agregado, setAgregado] = useState(false);
  const currency = product.currency ?? "RD$";
  const categoria = (product as Product & { categoria?: string }).categoria;

  function alCarrito() {
    agregarAlCarrito(product, 1, { categoria });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  }

  return (
    <View style={SOMBRA.card} className="overflow-hidden rounded-2xl bg-white">
      <Pressable accessibilityRole="button" accessibilityLabel={`Ver acciones de ${product.name}`} onPress={() => setAcciones((a) => !a)} className="aspect-square">
        <Image source={imagen(product.image)} accessibilityLabel={product.name} contentFit="cover" style={{ width: "100%", height: "100%" }} />
        {acciones && (
          <View className="absolute inset-0 items-center justify-center gap-3 bg-black/40">
            <Accion icono={IMAGENES["/images/image_home/Icono_01.png"]} texto="Comprar Ahora" className="bg-primary-600" onPress={() => { agregarAlCarrito(product, 1, { categoria }); router.push("/cliente/carrito"); }} />
            <Accion icono={IMAGENES["/images/image_home/Icono_02.png"]} texto="Ver mas detalles" className="bg-primary-400/90" onPress={() => router.push({ pathname: "/cliente/producto/[id]", params: { id: product.id } })} />
            <Accion icono={IMAGENES["/images/image_home/Icono_03.png"]} texto={agregado ? "¡Agregado!" : "Añadir al Carrito"} className={agregado ? "bg-success-600" : "border-2 border-white bg-transparent"} onPress={alCarrito} />
          </View>
        )}
      </Pressable>

      <View className="gap-2 p-4">
        <View className="flex-row items-center gap-2">
          <Image source={imagen(product.seller.avatar)} accessibilityLabel={product.seller.name} contentFit="cover" style={{ width: 36, height: 36, borderRadius: 18 }} />
          <View className="min-w-0 flex-1">
            <Texto numberOfLines={1} className="font-sans text-sm font-semibold text-neutral-900">{product.seller.name}</Texto>
            <Texto numberOfLines={1} className="font-sans text-xs text-neutral-500">{product.seller.location}</Texto>
          </View>
        </View>

        <Texto className="font-sans text-sm font-medium text-neutral-800">{product.name}</Texto>

        <View className="flex-row items-end justify-between">
          <Stars rating={product.rating} />
          <View className="items-end">
            <Texto className="font-sans text-xs text-neutral-500">A partir de</Texto>
            <Texto className="font-sans text-lg font-bold text-neutral-900">{currency}{product.price.toFixed(2)}</Texto>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          onPress={() => alternarFavorito(product)}
          hitSlop={6}
          className="mt-1 self-start"
        >
          <Icono d={CORAZON} size={24} color={favorito ? "#ef4444" : "#bdc1b9"} relleno />
        </Pressable>
      </View>
    </View>
  );
}
