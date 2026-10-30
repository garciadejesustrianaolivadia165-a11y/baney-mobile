import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";

import { BarraCategorias, EncabezadoCatalogo } from "@/components/catalog-header";
import Pagina from "@/components/dashboard/pagina";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { agregarAlCarrito } from "@/lib/carrito";
import { alternarFavorito, useFavoritos } from "@/lib/favoritos";
import { buscarProducto, CATALOGO, GALERIA, relacionadosDe, type ProductoCatalogo } from "@/lib/productos";
import type { Product } from "@/types/product";

const CARRITO = "M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.6L20 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z";
const CORAZON = "M12 20.5l-1.3-1.2C6 15.2 3 12.4 3 9a4.5 4.5 0 0 1 8.2-2.5L12 7.6l.8-1.1A4.5 4.5 0 0 1 21 9c0 3.4-3 6.2-7.7 10.3L12 20.5z";

// Ficha de producto del marketplace dentro del armazón del cliente. Los botones van bajo la foto (como la web en teléfono).
export default function ProductDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [categoria, setCategoria] = useState("Todas las áreas");
  const [temporada, setTemporada] = useState(false);
  const [filtro, setFiltro] = useState("Filtrar Por");
  const [principal, setPrincipal] = useState(0);
  const [accionesDe, setAccionesDe] = useState<string | null>(null);

  // El producto de la ficha (del catálogo; si el id no existe, el primero)
  const base: ProductoCatalogo = buscarProducto(id) ?? CATALOGO[0];
  const producto: Product = base;
  const [agregado, setAgregado] = useState(false);
  const favoritos = useFavoritos().productos;
  const enDeseos = favoritos.some((f) => f.id === producto.id);
  const relacionados = relacionadosDe(base);

  // Mismo orden de colores que la referencia
  const acciones = [
    { t: "Comprar ahora", color: "#ef4444", texto: "#fff", icono: false, onPress: () => { agregarAlCarrito(producto, 1, { categoria: base.categoria, unidad: base.unidad }); router.push("/cliente/carrito"); } },
    { t: agregado ? "¡Agregado al carrito!" : "Agregar al Carrito", color: "#5c641d", texto: "#fff", icono: true, onPress: () => { agregarAlCarrito(producto, 1, { categoria: base.categoria, unidad: base.unidad }); setAgregado(true); setTimeout(() => setAgregado(false), 1500); } },
    { t: enDeseos ? "Quitar de la lista de deseos" : "Agregar a lista de deseos", color: "#cdaf86", texto: "#20221f", icono: false, onPress: () => { if (alternarFavorito(producto)) router.push("/cliente/favoritos"); } },
  ];

  return (
    <Pagina className="gap-0">
        <View>
          <BarraCategorias activa={categoria} onCambio={setCategoria} />
          <EncabezadoCatalogo temporada={temporada} onTemporada={setTemporada} filtro={filtro} onFiltro={setFiltro} />

          <View className="mt-10 w-full">
            <Texto className="font-sans text-2xl font-bold text-neutral-900">{producto.name}</Texto>
            <View className="mt-2 flex-row flex-wrap items-center gap-2">
              <View className="rounded-full bg-primary-50 px-3 py-1"><Texto className="text-xs font-semibold text-primary-700">{base.categoria}</Texto></View>
              <Texto className="font-sans text-lg font-bold text-neutral-900">RD$ {base.price.toLocaleString("en-US")}<Texto className="text-xs font-normal text-neutral-500"> / {base.unidad}</Texto></Texto>
            </View>
            <Texto className="mt-2 font-sans text-sm leading-relaxed text-neutral-600">{base.descripcion}</Texto>
            <Texto className="mt-1 font-sans text-xs text-neutral-500">Vende {base.seller.name} · {base.seller.location}</Texto>

            <View style={SOMBRA.card} className="mt-5 overflow-hidden rounded-2xl">
              <Image source={imagen(principal === 0 ? producto.image : GALERIA[principal])} accessibilityLabel={producto.name} contentFit="cover" style={{ width: "100%", height: 240 }} />
            </View>
            <View className="mt-4 gap-3">
              {acciones.map((a) => (
                <BotonPill key={a.t} color={a.color} textoColor={a.texto} onPress={a.onPress} className="w-full px-5 py-3">
                  {(pressed) => (
                    <View className="flex-row items-center gap-2">
                      {a.icono && <Icono d={CARRITO} size={16} color={pressed ? a.color : a.texto} />}
                      <Texto className="font-sans text-sm font-semibold" style={{ color: pressed ? a.color : a.texto }}>{a.t}</Texto>
                    </View>
                  )}
                </BotonPill>
              ))}
            </View>

            {/* Miniaturas */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-5" contentContainerClassName="gap-5">
              {GALERIA.map((g, i) => (
                <Pressable
                  key={i}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver imagen ${i + 1}`}
                  accessibilityState={{ selected: principal === i }}
                  onPress={() => setPrincipal(i)}
                  className={`h-[105px] w-[150px] overflow-hidden rounded-xl border-2 ${principal === i ? "border-primary-600" : "border-transparent"}`}
                >
                  <Image source={imagen(g)} contentFit="cover" style={{ width: "100%", height: "100%" }} />
                </Pressable>
              ))}
            </ScrollView>

            {/* Productos relacionados */}
            <Texto className="mt-10 font-sans text-lg font-bold text-neutral-900">Productos relacionados</Texto>
            <View className="mt-5 gap-5 pb-24">
              {relacionados.map((r) => {
                const abierto = accionesDe === r.id;
                return (
                  <View key={r.id} style={SOMBRA.card} className="overflow-hidden rounded-2xl bg-secondary-200">
                    <Pressable accessibilityRole="button" onPress={() => setAccionesDe(abierto ? null : r.id)} className="h-[140px]">
                      <Image source={imagen(r.image)} accessibilityLabel={r.name} contentFit="cover" style={{ width: "100%", height: "100%" }} />
                      <View className="absolute left-3 top-3 flex-row items-center gap-1 rounded-full bg-black/35 px-2 py-0.5">
                        <Texto className="font-sans text-[11px] font-semibold text-white">{r.rating.toFixed(1)}</Texto>
                        <Icono d={ICONOS.estrella} size={12} color="#fff" relleno />
                      </View>
                      <View className="absolute right-3 top-3 flex-row items-center gap-3">
                        <Pressable accessibilityRole="button" accessibilityLabel={`Agregar ${r.name} a favoritos`} onPress={() => alternarFavorito(r)} hitSlop={6} className="active:scale-125">
                          <Icono d={CORAZON} size={20} color={favoritos.some((f) => f.id === r.id) ? "#ef4444" : "#fff"} relleno={favoritos.some((f) => f.id === r.id)} />
                        </Pressable>
                        <Pressable accessibilityRole="button" accessibilityLabel={`Agregar ${r.name} al carrito`} onPress={() => agregarAlCarrito(r, 1, { categoria: r.categoria, unidad: r.unidad })} hitSlop={6} className="active:scale-125">
                          <Icono d={CARRITO} size={20} color="#fff" />
                        </Pressable>
                      </View>
                      {abierto && (
                        <View className="absolute inset-0 items-center justify-center gap-3 bg-black/35">
                          <BotonPill color="#364a2d" textoColor="#fdf8f0" onPress={() => { agregarAlCarrito(r, 1, { categoria: r.categoria, unidad: r.unidad }); router.push("/cliente/carrito"); }} className="flex-row gap-2 px-5 py-2" sinSombra>
                            {(pressed) => (
                              <View className="flex-row items-center gap-2">
                                <Image source={IMAGENES["/images/image_home/Icono_01.png"]} contentFit="contain" style={{ width: 20, height: 20 }} />
                                <Texto className="font-sans text-sm font-semibold" style={{ color: pressed ? "#364a2d" : "#fdf8f0" }}>Comprar Ahora</Texto>
                              </View>
                            )}
                          </BotonPill>
                          <BotonPill color="#5d7f4d" onPress={() => router.push({ pathname: "/cliente/producto/[id]", params: { id: r.id } })} className="flex-row gap-2 px-5 py-2" sinSombra>
                            {(pressed) => (
                              <View className="flex-row items-center gap-2">
                                <Image source={IMAGENES["/images/image_home/Icono_02.png"]} contentFit="contain" style={{ width: 20, height: 20 }} />
                                <Texto className="font-sans text-sm font-semibold" style={{ color: pressed ? "#5d7f4d" : "#fff" }}>Ver mas detalles</Texto>
                              </View>
                            )}
                          </BotonPill>
                        </View>
                      )}
                    </Pressable>

                    <View className="flex-row items-center justify-between gap-4 px-5 py-4">
                      <View className="min-w-0 flex-1">
                        <Texto className="font-sans text-[15px] font-bold text-neutral-900">{r.name}</Texto>
                        <Texto numberOfLines={1} className="mt-0.5 font-sans text-xs text-neutral-600">{r.descripcion}</Texto>
                      </View>
                      <Texto className="font-sans text-base font-semibold text-neutral-900">RD$ {r.price.toLocaleString("en-US")}</Texto>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
    </Pagina>
  );
}
