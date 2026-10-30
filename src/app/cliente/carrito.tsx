import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import PasosCheckout from "@/components/checkout/pasos-checkout";
import ResumenCompra from "@/components/checkout/resumen-compra";
import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import ItemProducto from "@/components/item-producto";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { agregarAlCarrito, cambiarCantidad, COSTO_ENVIO, ITBIS, plural, quitarDelCarrito, subtotalCarrito, useCarrito } from "@/lib/carrito";
import { pesos } from "@/lib/pedidos-cliente";
import { CATALOGO } from "@/lib/productos";

const CARRITO = "M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.6L20 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z";

// 04 · Carrito: lista con cantidades, resumen y paso al pago.
// "Comprar Ahora" llega con ?producto=ID y lo añade antes de mostrar la lista.
export default function Carrito() {
  const router = useRouter();
  const { producto } = useLocalSearchParams<{ producto?: string }>();
  const items = useCarrito();

  useEffect(() => {
    if (!producto) return;
    const p = CATALOGO.find((x) => x.id === producto);
    if (p && !items.some((i) => i.producto.id === p.id)) agregarAlCarrito(p, 1, { categoria: p.categoria });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [producto]);

  const subtotal = subtotalCarrito(items);
  const itbis = Math.round(subtotal * ITBIS);

  if (items.length === 0) {
    return (
      <Pagina>
        <TituloSeccion titulo="Carrito" enlace="Seguir comprando" href="/cliente" />
        <View className="items-center gap-3 py-16">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-50">
            <Icono d={CARRITO} size={36} color="#486440" strokeWidth={1.6} />
          </View>
          <Texto className="font-sans text-lg font-semibold text-neutral-700">Tu carrito está vacío</Texto>
          <Texto className="text-center text-sm text-neutral-500">Explora el marketplace y toca "Añadir al Carrito" en los productos que quieras.</Texto>
          <BotonPill color="#364a2d" textoColor="#fdf8f0" href="/cliente" className="mt-3 px-8 py-3" textClassName="font-sans text-sm">
            Ir al marketplace
          </BotonPill>
        </View>
      </Pagina>
    );
  }

  return (
    <Pagina>
      <TituloSeccion titulo="Carrito" enlace="Seguir comprando" href="/cliente" />
      <PasosCheckout actual={1} />

      <View className="gap-4">
        {items.map((i) => (
          <ItemProducto
            key={i.producto.id}
            img={i.producto.image}
            nombre={i.producto.name}
            categoria={i.categoria ?? i.producto.seller.location}
            detalle={plural(i.cantidad, i.unidad)}
            precio={pesos(i.producto.price * i.cantidad)}
            precioDetalle={`${pesos(i.producto.price)} por ${i.unidad}`}
            derecha={
              <Pressable accessibilityRole="button" accessibilityLabel={`Quitar ${i.producto.name}`} onPress={() => quitarDelCarrito(i.producto.id)} hitSlop={8} className="h-9 w-9 items-center justify-center rounded-full border border-error-200 active:bg-error-500">
                {({ pressed }) => <Icono d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" size={16} color={pressed ? "#fff" : "#ef4444"} />}
              </Pressable>
            }
            abajo={
              <View className="flex-row items-center justify-between">
                <Texto numberOfLines={1} className="flex-1 text-[12px] text-neutral-500">{i.producto.seller.name}</Texto>
                <View className="flex-row items-center gap-3 rounded-full bg-white px-2 py-1">
                  <Pressable accessibilityRole="button" accessibilityLabel={`Una ${i.unidad} menos de ${i.producto.name}`} onPress={() => cambiarCantidad(i.producto.id, i.cantidad - 1)} className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100 active:bg-[#4A5720]">
                    {({ pressed }) => <Icono d="M5 12h14" size={14} color={pressed ? "#fff" : "#3F443D"} strokeWidth={2.4} />}
                  </Pressable>
                  <Texto className="min-w-6 text-center text-[15px] font-bold text-neutral-900">{i.cantidad}</Texto>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Una ${i.unidad} más de ${i.producto.name}`} onPress={() => cambiarCantidad(i.producto.id, i.cantidad + 1)} className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100 active:bg-[#4A5720]">
                    {({ pressed }) => <Icono d={ICONOS.mas} size={14} color={pressed ? "#fff" : "#3F443D"} strokeWidth={2.4} />}
                  </Pressable>
                </View>
              </View>
            }
          />
        ))}
      </View>

      <ResumenCompra subtotal={subtotal} itbis={itbis} envio={COSTO_ENVIO} nota="El envío se calcula con Transporte BANEY; en el siguiente paso puedes elegir recoger en la finca sin costo." />

      <BotonPill color="#364a2d" textoColor="#fdf8f0" onPress={() => router.push("/cliente/pago")} className="w-full py-4" textClassName="font-sans text-[15px] font-semibold">
        Continuar al pago
      </BotonPill>
    </Pagina>
  );
}
