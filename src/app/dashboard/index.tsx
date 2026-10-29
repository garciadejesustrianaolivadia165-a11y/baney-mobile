import { useEffect, useRef, useState, type ComponentRef } from "react";
import { Modal, Pressable, ScrollView, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import TablaPedidos from "@/components/dashboard/tabla-pedidos";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import { useMisProductos } from "@/lib/mis-productos";
import { TarjetaAlerta } from "../(app)/alertas";

const IMG = "/images/image_home";

// Nuevos pedidos con el mismo formato de las alertas de transporte
const nuevosPedidos = [
  { id: "00242772362", cliente: "Cesar Valdez", hora: "10:45 AM", texto: "Cesar Valdez pidió Plátanos Banilejos 12 Dz · 0/8 completo", nueva: true, destacada: true },
  { id: "00242772363", cliente: "Mini-Market Manolo", hora: "09:12 AM", texto: "Mini-Market Manolo pidió Pimientos Importados · 50/135 completo", nueva: true },
  { id: "00242772364", cliente: "Mini-Market Manolo", hora: "Ayer, 04:30 PM", texto: "Mini-Market Manolo pidió Pimientos Importados · 2/8 completo" },
];

const pedidos = [
  { id: "00242772362", cliente: "Cesar Valdez", fecha: "25/2/2026", img: `${IMG}/image_home_09.png`, descripcion: "Plátanos Banilejos 12 Dz", precio: "$ 135,000.00" },
  { id: "00242772363", cliente: "Mini-Market Manolo", fecha: "25/2/2026", img: `${IMG}/image_home_12.png`, descripcion: "Pimientos Importados", precio: "$ 5,000.00" },
];

// Pasos de la guía interactiva
const pasosGuia = [
  { titulo: "Bienvenida", texto: "Este es tu panel de inicio. Aquí te saludamos y desde este botón puedes volver a abrir esta guía cuando quieras." },
  { titulo: "Nuevos pedidos", texto: "Estas alertas te avisan de cada pedido nuevo y qué tan completo está. Toca una para ver el pedido." },
  { titulo: "Tus Productos", texto: "Aquí ves tu inventario: desliza con el dedo, toca un producto para editar su stock y marca tus favoritos con el corazón." },
  { titulo: "Pedidos En Curso", texto: "Esta tabla lista los pedidos activos de tus clientes con su estado, descripción y precio. Toca uno para ver su detalle." },
];

const CORAZON = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
const PEDIDO = "M6 2l1.5 4h9L18 2M3 6h18l-2 14H5L3 6zM9 10v4M15 10v4";

// En la web la tarjeta flota junto a la sección resaltada; aquí va en un Modal
// sobre el fondo oscurecido y la sección activa se marca con un anillo verde.
function TarjetaGuia({ paso, setPaso }: { paso: number; setPaso: (p: number | null) => void }) {
  const info = pasosGuia[paso];
  return (
    <Modal transparent animationType="fade" visible onRequestClose={() => setPaso(null)}>
      <Pressable accessibilityLabel="Cerrar guía" onPress={() => setPaso(null)} className="flex-1 items-center justify-end bg-black/60 p-6">
        <Pressable onPress={() => {}} style={SOMBRA.alta} className="w-80 rounded-2xl bg-white p-5">
          <Texto className="font-sans text-base font-bold text-[#415936]">{info.titulo}</Texto>
          <Texto className="mt-2 text-sm leading-relaxed text-neutral-600">{info.texto}</Texto>
          <View className="mt-4 flex-row items-center justify-between">
            <Texto className="text-xs font-medium text-neutral-400">Paso {paso + 1} de {pasosGuia.length}</Texto>
            <View className="flex-row gap-2">
              {paso > 0 && (
                <BotonPill color="#bdc1b9" variante="borde" textoColor="#4d5148" onPress={() => setPaso(paso - 1)} className="px-4 py-1.5" textClassName="text-xs font-semibold" sinSombra>
                  Anterior
                </BotonPill>
              )}
              <BotonPill color="#364a2d" onPress={() => setPaso(paso < pasosGuia.length - 1 ? paso + 1 : null)} className="px-4 py-1.5" textClassName="text-xs font-semibold" sinSombra>
                {paso < pasosGuia.length - 1 ? "Siguiente" : "Terminar"}
              </BotonPill>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function DashboardOverview() {
  const router = useRouter();
  const productos = useMisProductos();
  // null = guía apagada; 0..n = paso activo
  const [paso, setPaso] = useState<number | null>(null);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  // Carrusel de "Tus Productos": 1 tarjeta en teléfono, 2 en tablet, 3 en escritorio.
  // Se desliza con el dedo y avanza solo cada 3,5 s (se pausa mientras se arrastra).
  const [ancho, setAncho] = useState(0);
  const [idxProd, setIdxProd] = useState(0);
  const [pausado, setPausado] = useState(false);
  const pista = useRef<ComponentRef<typeof ScrollView>>(null);
  const visiblesProd = ancho < 640 ? 1 : ancho < 1280 ? 2 : 3;
  const anchoTarjeta = ancho / visiblesProd;
  const total = productos.length;

  useEffect(() => {
    if (pausado || total === 0) return;
    const timer = setInterval(() => setIdxProd((i) => (i + 1) % total), 3500);
    return () => clearInterval(timer);
  }, [pausado, total]);

  useEffect(() => {
    if (ancho === 0) return;
    pista.current?.scrollTo({ x: idxProd * anchoTarjeta, animated: true });
  }, [idxProd, ancho, anchoTarjeta]);

  function alSoltar(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setPausado(false);
    if (anchoTarjeta > 0) setIdxProd(Math.max(0, Math.min(total - 1, Math.round(e.nativeEvent.contentOffset.x / anchoTarjeta))));
  }

  const anteriorProd = () => setIdxProd((i) => (i <= 0 ? total - 1 : i - 1));
  const siguienteProd = () => setIdxProd((i) => (i + 1) % total);
  const resaltado = (i: number) => (paso === i ? "rounded-3xl border-4 border-primary-300" : "");
  const progreso = (stock: number) => Math.min(100, Math.round((stock / 150) * 100));

  return (
    <Pagina>
      {paso !== null && <TarjetaGuia paso={paso} setPaso={setPaso} />}

      {/* Banner de bienvenida */}
      <View style={SOMBRA.alta} className={`rounded-3xl bg-[#556B2F] p-8 ${resaltado(0)}`}>
        <Texto className="text-xs font-semibold uppercase tracking-widest text-white/85">Bienvenido Nuevamente</Texto>
        <Texto className="mt-2 font-sans text-3xl font-bold text-white">José Pérez Guzmán</Texto>
        <BotonPill color="#20221f" onPress={() => setPaso(0)} className="mt-6 self-start px-5 py-2.5">
          {(pressed) => (
            <View className="flex-row items-center gap-2">
              <Texto className="text-sm font-medium" style={{ color: pressed ? "#20221f" : "#fff" }}>Guía interactiva</Texto>
              <View className={`h-6 w-6 items-center justify-center rounded-full border ${pressed ? "border-neutral-900/60" : "border-white/60"}`}>
                <Icono d="M8 5v14l11-7z" size={12} color={pressed ? "#20221f" : "#fff"} relleno />
              </View>
            </View>
          )}
        </BotonPill>
      </View>

      {/* Nuevos pedidos: mismas alertas que la versión de transporte */}
      <View className={resaltado(1)}>
        <Texto className="font-sans text-xl font-semibold text-[#3F443D]">Nuevos pedidos</Texto>
        {nuevosPedidos.map((n) => (
          <Pressable key={n.id + n.hora} accessibilityRole="link" accessibilityLabel={`Ver pedido de ${n.cliente}`} onPress={() => router.push({ pathname: "/dashboard/bandeja/pedidos/[id]", params: { id: n.id } })} className="active:opacity-80">
            <TarjetaAlerta
              destacada={n.destacada}
              nueva={n.nueva}
              fondoIcono={n.destacada ? "bg-error-100" : "bg-success-100"}
              icono={<Icono d={PEDIDO} size={20} color={n.destacada ? "#ef4444" : "#059669"} strokeWidth={1.8} />}
              titulo="Nuevo Pedido"
              hora={n.hora}
              texto={n.texto}
              accion="Ver pedido"
            />
          </Pressable>
        ))}
      </View>

      {/* Tus Productos */}
      <View className={resaltado(2)} onLayout={(e: LayoutChangeEvent) => setAncho(e.nativeEvent.layout.width)}>
        <View className="flex-row items-center justify-between">
          <Texto className="font-sans text-xl font-semibold text-[#3F443D]">Tus Productos</Texto>
          <View className="flex-row gap-2">
            {[
              { d: "M15 18l-6-6 6-6", accion: anteriorProd, label: "Anterior" },
              { d: "M9 6l6 6-6 6", accion: siguienteProd, label: "Siguiente" },
            ].map((btn) => (
              <Pressable key={btn.label} accessibilityRole="button" accessibilityLabel={btn.label} onPress={btn.accion} className="h-8 w-8 items-center justify-center rounded-full border border-neutral-300 active:border-primary-400">
                <Icono d={btn.d} size={16} color="#696e64" strokeWidth={2} />
              </Pressable>
            ))}
          </View>
        </View>

        {ancho > 0 && (
          <ScrollView
            ref={pista}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={anchoTarjeta}
            decelerationRate="fast"
            onScrollBeginDrag={() => setPausado(true)}
            onMomentumScrollEnd={alSoltar}
            className="mt-4"
            contentContainerClassName="pb-2"
          >
            {productos.map((p) => {
              const fav = favoritos.includes(p.id);
              return (
                <View key={p.id} style={{ width: anchoTarjeta }} className="px-3">
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel={`Editar stock de ${p.nombre}`}
                    onPress={() => router.push({ pathname: "/dashboard/productos/[id]/stock", params: { id: p.id } })}
                    style={SOMBRA.card}
                    className="overflow-hidden rounded-2xl bg-white p-4 active:bg-primary-400/10"
                  >
                    <Image source={imagen(p.img)} accessibilityLabel={p.nombre} contentFit="cover" style={{ width: "100%", height: 176, borderRadius: 12 }} />
                    <View className={`mt-4 self-start rounded-full px-4 py-1 ${p.stock > 0 ? "bg-success-200" : "bg-error-200"}`}>
                      <Texto className={`text-xs font-semibold uppercase tracking-wide ${p.stock > 0 ? "text-success-800" : "text-error-700"}`}>{p.stock > 0 ? "Stock" : "Sin Stock"}</Texto>
                    </View>
                    <Texto className="mt-3 font-sans text-xl font-semibold text-neutral-900">{p.nombre}</Texto>
                    <View className="mt-3 h-2.5 w-full rounded-full bg-neutral-200">
                      <View className="h-full rounded-full bg-secondary4-500" style={{ width: `${progreso(p.stock)}%` }} />
                    </View>
                    <View className="mt-4 flex-row items-center gap-3">
                      <Image source={IMAGENES["/images/image_home/Ellipse 5.png"]} contentFit="cover" style={{ width: 36, height: 36, borderRadius: 18 }} />
                      <View className="flex-1">
                        <Texto className="text-sm font-semibold text-neutral-900">José Pedro Guzmán</Texto>
                        <Texto className="text-xs text-neutral-500">San Juan · {p.stock} {p.unidad}</Texto>
                      </View>
                      {/* Mismo corazón de favoritos que las tarjetas del marketplace */}
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
                        onPress={() => setFavoritos((f) => (fav ? f.filter((x) => x !== p.id) : [...f, p.id]))}
                        hitSlop={6}
                      >
                        <Icono d={CORAZON} size={24} color={fav ? "#ef4444" : "#bdc1b9"} relleno />
                      </Pressable>
                    </View>
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Pedidos En Curso */}
      <View className={resaltado(3)}>
        <TituloSeccion titulo="Pedidos En Curso" enlace="Ver Todos" href="/dashboard/rutas" />
        <TablaPedidos pedidos={pedidos} onFila={(p) => router.push({ pathname: "/dashboard/rutas/[pedidoId]", params: { pedidoId: p.id } })} />
      </View>
    </Pagina>
  );
}
