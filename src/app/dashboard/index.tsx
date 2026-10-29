import { useEffect, useRef, useState, type ComponentRef } from "react";
import { Modal, Pressable, ScrollView, View, type LayoutChangeEvent } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import TablaPedidos from "@/components/dashboard/tabla-pedidos";
import BotonPill from "@/components/movil/boton-pill";
import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";

const IMG = "/images/image_home";

// TODO: reemplazar por las fotos reales de productos cuando se exporten del Figma
const productos = [
  { nombre: "Zanahorias Criollas (Lb)", img: "/images/image_inicio/image_inicio_01.png", stock: true, progreso: 55 },
  { nombre: "Pimientos Maduros (Und)", img: "/images/image_inicio/image_inicio_02.png", stock: true, progreso: 40 },
  { nombre: "Maíz Tierno (Und)", img: "/images/image_inicio/image_inicio_03.png", stock: false, progreso: 65 },
];

const estados = [{ resumen: "0/8 Completo" }, { resumen: "50/135 Completo" }, { resumen: "2/8 Completo" }];

const pedidos = [
  { id: "00242772362", cliente: "Cesar Valdez", fecha: "25/2/2026", img: `${IMG}/image_home_09.png`, descripcion: "Plátanos Banilejos 12 Dz", precio: "$ 135,000.00" },
  { id: "00242772363", cliente: "Mini-Market Manolo", fecha: "25/2/2026", img: `${IMG}/image_home_12.png`, descripcion: "Pimientos Importados", precio: "$ 5,000.00" },
];

// Pasos de la guía interactiva
const pasosGuia = [
  { titulo: "Bienvenida", texto: "Este es tu panel de inicio. Aquí te saludamos y desde este botón puedes volver a abrir esta guía cuando quieras." },
  { titulo: "Estado de tus pedidos", texto: "Estas tarjetas te muestran un resumen rápido: cuántos pedidos nuevos tienes y qué tan completos están." },
  { titulo: "Tus Productos", texto: "Aquí ves tu inventario: cada producto con su foto, si tiene stock disponible y la barra de progreso de sus ventas." },
  { titulo: "Pedidos En Curso", texto: "Esta tabla lista los pedidos activos de tus clientes con su estado, descripción y precio. Toca uno para ver su detalle." },
];

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

// 6 opciones: los 3 productos repetidos, más 3 clones para el bucle sin salto
const productos6 = [...productos, ...productos];
const pistaProductos = [...productos6, ...productos6.slice(0, 3)];

export default function DashboardOverview() {
  const router = useRouter();
  // null = guía apagada; 0..n = paso activo
  const [paso, setPaso] = useState<number | null>(null);

  // Carrusel de productos: 1 tarjeta en teléfono, 2 en tablet, 3 en escritorio
  const [ancho, setAncho] = useState(0);
  const [idxProd, setIdxProd] = useState(0);
  const pista = useRef<ComponentRef<typeof ScrollView>>(null);
  const visiblesProd = ancho < 640 ? 1 : ancho < 1280 ? 2 : 3;
  const anchoTarjeta = ancho / visiblesProd;

  useEffect(() => {
    const timer = setInterval(() => setIdxProd((i) => Math.min(i + 1, productos6.length)), 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (ancho === 0) return;
    pista.current?.scrollTo({ x: idxProd * anchoTarjeta, animated: true });
    if (idxProd < productos6.length) return;
    const timer = setTimeout(() => {
      pista.current?.scrollTo({ x: 0, animated: false });
      setIdxProd(0);
    }, 720);
    return () => clearTimeout(timer);
  }, [idxProd, ancho, anchoTarjeta]);

  const anteriorProd = () => setIdxProd((i) => (i <= 0 ? productos6.length - 1 : i - 1));
  const siguienteProd = () => setIdxProd((i) => Math.min(i + 1, productos6.length));

  const resaltado = (i: number) => (paso === i ? "rounded-3xl border-4 border-primary-300" : "");

  return (
    <Pagina>
      {paso !== null && <TarjetaGuia paso={paso} setPaso={setPaso} />}

      {/* Banner de bienvenida */}
      <View style={SOMBRA.alta} className={`rounded-3xl border border-white/30 bg-primary-300/80 p-8 ${resaltado(0)}`}>
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

      {/* Tarjetas de estado */}
      <View className={`gap-6 ${resaltado(1)}`}>
        {estados.map((e, i) => (
          <View key={i} style={SOMBRA.card} className="flex-row items-center gap-4 rounded-2xl bg-white p-4">
            <Image source={IMAGENES["/icons/btn_pedido.png"]} contentFit="contain" style={{ width: 44, height: 44 }} />
            <View className="min-w-0 flex-1">
              <Texto className="text-xs text-neutral-500">{e.resumen}</Texto>
              <Texto className="font-sans text-sm font-medium text-neutral-900">Nuevo Pedido</Texto>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Ver detalle del pedido" onPress={() => router.push({ pathname: "/dashboard/bandeja/pedidos/[id]", params: { id: "00242772362" } })} className="px-1">
              <Texto className="text-lg text-neutral-400">⋮</Texto>
            </Pressable>
          </View>
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
          <ScrollView ref={pista} horizontal scrollEnabled={false} showsHorizontalScrollIndicator={false} className="mt-4" contentContainerClassName="pb-2">
            {pistaProductos.map((p, iProd) => (
              <View key={iProd} style={{ width: anchoTarjeta }} className="px-3">
                <View style={SOMBRA.card} className="overflow-hidden rounded-2xl bg-white p-4">
                  <View>
                    <Image source={imagen(p.img)} accessibilityLabel={p.nombre} contentFit="cover" style={{ width: "100%", height: 176, borderRadius: 12 }} />
                    {/* Favorito: círculo naranja con corazón blanco, como la referencia */}
                    <Pressable accessibilityRole="button" accessibilityLabel="Favorito" style={SOMBRA.boton} className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-secondary3-500/60 active:scale-110">
                      <Icono d="M12 20.25l-1.3-1.18C6.1 14.9 3 12.13 3 8.75 3 6 5.17 3.85 7.92 3.85c1.55 0 3.05.72 4.08 1.87a5.48 5.48 0 0 1 4.08-1.87C18.83 3.85 21 6 21 8.75c0 3.38-3.1 6.15-7.7 10.33L12 20.25z" size={18} color="#fff" strokeWidth={2.4} />
                    </Pressable>
                  </View>
                  <View className={`mt-4 self-start rounded-full px-4 py-1 ${p.stock ? "bg-success-200" : "bg-error-200"}`}>
                    <Texto className={`text-xs font-semibold uppercase tracking-wide ${p.stock ? "text-success-800" : "text-error-700"}`}>{p.stock ? "Stock" : "Sin Stock"}</Texto>
                  </View>
                  <Texto className="mt-3 font-sans text-xl font-semibold text-neutral-900">{p.nombre}</Texto>
                  <View className="mt-3 h-2.5 w-full rounded-full bg-neutral-200">
                    <View className="h-full rounded-full bg-secondary4-500" style={{ width: `${p.progreso}%` }} />
                  </View>
                  <View className="mt-4 flex-row items-center gap-3">
                    <Image source={IMAGENES["/images/image_home/Ellipse 5.png"]} contentFit="cover" style={{ width: 36, height: 36, borderRadius: 18 }} />
                    <View>
                      <Texto className="text-sm font-semibold text-neutral-900">José Pedro Guzmán</Texto>
                      <Texto className="text-xs text-neutral-500">San Juan</Texto>
                    </View>
                  </View>
                </View>
              </View>
            ))}
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
