import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import PasosCheckout from "@/components/checkout/pasos-checkout";
import ResumenCompra from "@/components/checkout/resumen-compra";
import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import MediosPago from "@/components/movil/medios-pago";
import TarjetaSeleccion, { TONO } from "@/components/movil/tarjeta-seleccion";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { TarjetaDireccion } from "../cuenta/direcciones";
import { COSTO_ENVIO, ITBIS, subtotalCarrito, useCarrito, vaciarCarrito } from "@/lib/carrito";
import { useDirecciones } from "@/lib/direcciones";
import { crearPedidoCliente, pesos } from "@/lib/pedidos-cliente";

type Entrega = "Transporte BANEY" | "Recoger en la finca";

// 05 · Entrega y pago: dirección guardada, tipo de entrega y la misma pasarela
// "Escoge tu medio de pago" del transporte (MediosPago modo="pago").
export default function MetodoPago() {
  const router = useRouter();
  const items = useCarrito();
  const direcciones = useDirecciones();
  const [direccionId, setDireccionId] = useState(direcciones.find((d) => d.predeterminada)?.id ?? direcciones[0]?.id ?? "");
  const [entrega, setEntrega] = useState<Entrega>("Transporte BANEY");
  const direccion = direcciones.find((d) => d.id === direccionId);
  const subtotal = subtotalCarrito(items);
  const itbis = Math.round(subtotal * ITBIS);
  const envio = entrega === "Transporte BANEY" ? COSTO_ENVIO : 0;
  const total = subtotal + itbis + envio;

  if (items.length === 0) {
    return (
      <Pagina>
        <TituloSeccion titulo="Entrega y pago" enlace="Ir al carrito" href="/cliente/carrito" />
        <Texto className="text-center text-sm text-neutral-500">No hay productos en el carrito.</Texto>
      </Pagina>
    );
  }

  function confirmar(metodo: string) {
    const pedido = crearPedidoCliente(items, {
      direccion: entrega === "Transporte BANEY" ? (direccion ? `${direccion.direccion}` : "Sin dirección") : `Recoger en ${items[0].producto.seller.location}`,
      envio,
      metodoPago: metodo,
      entrega,
    });
    vaciarCarrito();
    router.replace({ pathname: "/cliente/confirmacion", params: { id: pedido.id } });
  }

  return (
    <Pagina>
      <TituloSeccion titulo="Entrega y pago" enlace="Volver al carrito" href="/cliente/carrito" />
      <PasosCheckout actual={2} />

      <View>
        <Texto className="font-sans text-lg font-semibold text-[#3F443D]">¿Cómo lo recibes?</Texto>
        <View className="mt-3 flex-row gap-3">
          {(["Transporte BANEY", "Recoger en la finca"] as Entrega[]).map((e) => {
            const activo = entrega === e;
            return (
              <TarjetaSeleccion key={e} activo={activo} onPress={() => setEntrega(e)} className="flex-1 items-center gap-2 px-3 py-4">
                <Icono d={e === "Transporte BANEY" ? ICONOS.camion : ICONOS.pin} size={24} color={activo ? TONO.activo : TONO.inactivo} strokeWidth={1.7} />
                <Texto className="text-center text-[13px] font-semibold" style={{ color: activo ? TONO.activo : TONO.inactivo }}>{e}</Texto>
                <Texto className="text-[12px] text-neutral-500">{e === "Transporte BANEY" ? pesos(COSTO_ENVIO) : "Gratis"}</Texto>
              </TarjetaSeleccion>
            );
          })}
        </View>
      </View>

      {entrega === "Transporte BANEY" && (
        <View>
          <View className="flex-row items-center justify-between">
            <Texto className="font-sans text-lg font-semibold text-[#3F443D]">Dirección de entrega</Texto>
            <Pressable accessibilityRole="link" onPress={() => router.push("/cuenta/direccion")}>
              <Texto className="text-sm font-medium text-caney-sky underline">Agregar dirección</Texto>
            </Pressable>
          </View>
          <View className="mt-3 gap-3">
            {direcciones.length === 0 && <Texto className="text-sm text-neutral-500">Todavía no tienes direcciones guardadas. Agrega una para que el transportista sepa a dónde llevar tu pedido.</Texto>}
            {direcciones.map((d) => (
              <TarjetaSeleccion key={d.id} activo={direccionId === d.id} onPress={() => setDireccionId(d.id)} className="px-4 py-3" accessibilityLabel={`Entregar en ${d.etiqueta}`}>
                <TarjetaDireccion d={d} compacta />
              </TarjetaSeleccion>
            ))}
          </View>
        </View>
      )}

      <ResumenCompra subtotal={subtotal} itbis={itbis} envio={envio} />

      <View>
        <Texto className="font-sans text-lg font-semibold text-[#3F443D]">Escoge tu medio de pago</Texto>
        <View className="mt-3">
          <MediosPago
            modo="pago"
            resumen={{
              lineas: items.map((i) => ({ t: `${i.producto.name} × ${i.cantidad}`, v: pesos(i.producto.price * i.cantidad) })),
              subtotal: pesos(subtotal),
              despues: [{ t: "ITBIS (18%)", v: pesos(itbis) }, { t: "Envío", v: envio === 0 ? "Gratis" : pesos(envio) }],
              total: pesos(total),
            }}
            onContinuar={confirmar}
          />
        </View>
        <Pressable accessibilityRole="link" onPress={() => router.push("/cliente/tarjeta")} className="mt-4 self-center">
          <Texto className="text-sm font-medium text-caney-sky underline">Agregar una tarjeta nueva y guardarla</Texto>
        </Pressable>
      </View>
    </Pagina>
  );
}
