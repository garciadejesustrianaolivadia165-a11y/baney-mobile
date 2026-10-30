import { useEffect, useRef, useState, type ComponentRef } from "react";
import { Pressable, ScrollView, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import GuiaInteractiva, { type PasoGuia } from "@/components/dashboard/guia";
import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import TablaPedidos from "@/components/dashboard/tabla-pedidos";
import BotonPill from "@/components/movil/boton-pill";
import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { alternarDestacado, useFavoritos } from "@/lib/favoritos";
import { useGuia, type Rect } from "@/lib/guia";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import { useMisProductos } from "@/lib/mis-productos";
import { filaPedido, resumenAlerta, usePedidosProveedor } from "@/lib/pedidos-proveedor";
import { TarjetaAlerta } from "../(app)/alertas";

const IMG = "/images/image_home";

// Pasos de la guía interactiva: 0–3 enfocan una sección del inicio; el último, el menú lateral
const MENU_ICONOS = {
  inicio: ICONOS.inicio,
  bandeja: "M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13l3.5 7v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7l3.5-7z",
  finanzas: "M3 3v18h18M7 14l4-4 4 4 5-6",
  productos: "M9 3H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM20 3h-5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 14H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1zM20 14h-5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1z",
  clientes: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  rutas: ICONOS.camion,
  proveedores: ICONOS.empresa,
  config: ICONOS.ajustes,
  salir: ICONOS.salir,
};
const pasosGuia: PasoGuia[] = [
  { titulo: "Bienvenida", texto: "Este es tu panel de inicio. Aquí te saludamos y desde este botón puedes volver a abrir esta guía cuando quieras." },
  { titulo: "Nuevos pedidos", texto: "Estas alertas te avisan de cada pedido nuevo y qué tan completo está. Toca una para ver el pedido." },
  { titulo: "Tus Productos", texto: "Aquí ves tu inventario: desliza con el dedo, toca un producto para editar su stock y marca tus favoritos con el corazón." },
  { titulo: "Pedidos En Curso", texto: "Esta tabla lista los pedidos activos de tus clientes con su estado, descripción y precio. Toca uno para ver dónde va, cuándo llega y contactar al transportista." },
  {
    titulo: "Menú lateral",
    texto: "Desde este botón abres el menú con todas las secciones de tu negocio:",
    lista: [
      { icono: MENU_ICONOS.inicio, nombre: "Inicio", detalle: "Este panel: bienvenida, alertas, tus productos y pedidos en curso." },
      { icono: MENU_ICONOS.bandeja, nombre: "Bandeja de entrada", detalle: "Los pedidos que llegan: ábrelos, acéptalos o recházalos." },
      { icono: MENU_ICONOS.finanzas, nombre: "Finanzas", detalle: "Ventas, ingresos, gráficos e indicadores económicos y de productos." },
      { icono: MENU_ICONOS.productos, nombre: "Mis productos", detalle: "Tu catálogo: publica productos, edita precio y stock." },
      { icono: MENU_ICONOS.clientes, nombre: "Clientes", detalle: "Quién te ha comprado, qué pidió y a dónde se envió." },
      { icono: MENU_ICONOS.rutas, nombre: "Rutas", detalle: "Pedidos en camino: mapa, hora de llegada y transportista." },
      { icono: MENU_ICONOS.proveedores, nombre: "Otros proveedores", detalle: "Conoce a otros productores de BANEY y lo que distribuyen." },
      { icono: MENU_ICONOS.config, nombre: "Configuración", detalle: "Notificaciones, seguridad, direcciones, documentos y tu cuenta." },
      { icono: MENU_ICONOS.salir, nombre: "Cerrar Sección", detalle: "Sal de tu cuenta; volverás a la pantalla de inicio de sesión." },
    ],
  },
];
const PASO_MENU = pasosGuia.length - 1;

const CORAZON = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
const PEDIDO = "M6 2l1.5 4h9L18 2M3 6h18l-2 14H5L3 6zM9 10v4M15 10v4";

export default function DashboardOverview() {
  const router = useRouter();
  const productos = useMisProductos();
  const todosPedidos = usePedidosProveedor();
  const nuevosPedidos = todosPedidos.filter((p) => p.estado === "NUEVO");
  const pedidos = todosPedidos.filter((p) => p.estado === "EN PROCESO").map(filaPedido);
  // null = guía apagada; 0..n = paso activo
  const [paso, setPaso] = useState<number | null>(null);
  const favoritos = useFavoritos().destacados;

  // Foco de la guía: cada sección guarda su ref y su posición en la página; al cambiar
  // de paso se desplaza hasta ella y se mide en coordenadas de ventana para el hueco.
  const scrollPagina = useRef<ComponentRef<typeof ScrollView>>(null);
  const secciones = useRef<(ComponentRef<typeof View> | null)[]>([]);
  const posiciones = useRef<number[]>([]);
  const [rect, setRect] = useState<Rect | null>(null);
  const { botonMenu, sidebar } = useGuia();
  useEffect(() => {
    if (paso === null) return;
    setRect(null);
    if (paso === PASO_MENU) {
      setRect(sidebar ?? botonMenu);
      return;
    }
    scrollPagina.current?.scrollTo({ y: Math.max(0, (posiciones.current[paso] ?? 0) - 12), animated: true });
    const t = setTimeout(() => secciones.current[paso]?.measureInWindow((x, y, w, h) => setRect({ x, y, w, h })), 450);
    return () => clearTimeout(t);
  }, [paso, botonMenu, sidebar]);
  const seccion = (i: number) => ({
    ref: (el: ComponentRef<typeof View> | null) => {
      secciones.current[i] = el;
    },
    onLayout: (e: LayoutChangeEvent) => {
      posiciones.current[i] = e.nativeEvent.layout.y;
    },
  });

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
  const progreso = (stock: number) => Math.min(100, Math.round((stock / 150) * 100));

  return (
    <Pagina scrollRef={scrollPagina}>
      {paso !== null && <GuiaInteractiva pasos={pasosGuia} paso={paso} setPaso={setPaso} rect={rect} />}

      {/* Banner de bienvenida */}
      <View {...seccion(0)} style={SOMBRA.alta} className="rounded-3xl bg-[#556B2F] p-8">
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
      <View {...seccion(1)}>
        <Texto className="font-sans text-xl font-semibold text-[#3F443D]">Nuevos pedidos</Texto>
        {nuevosPedidos.length === 0 && (
          <View style={SOMBRA.card} className="mt-3 rounded-2xl bg-white p-5">
            <Texto className="text-sm text-neutral-500">No tienes pedidos nuevos por revisar. Los pedidos que aceptes aparecen abajo, en "Pedidos En Curso".</Texto>
          </View>
        )}
        {nuevosPedidos.map((n, i) => (
          <Pressable key={n.id} accessibilityRole="link" accessibilityLabel={`Ver pedido de ${n.cliente.nombre}`} onPress={() => router.push({ pathname: "/dashboard/bandeja/pedidos/[id]", params: { id: n.id } })} className="active:opacity-80">
            <TarjetaAlerta
              destacada={i === 0}
              nueva
              fondoIcono={i === 0 ? "bg-error-100" : "bg-success-100"}
              icono={<Icono d={PEDIDO} size={20} color={i === 0 ? "#ef4444" : "#059669"} strokeWidth={1.8} />}
              titulo="Nuevo Pedido"
              hora={n.hora}
              texto={resumenAlerta(n)}
              accion="Ver pedido"
            />
          </Pressable>
        ))}
      </View>

      {/* Tus Productos */}
      <View ref={(el) => { secciones.current[2] = el; }} onLayout={(e: LayoutChangeEvent) => { setAncho(e.nativeEvent.layout.width); posiciones.current[2] = e.nativeEvent.layout.y; }}>
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
                        onPress={() => alternarDestacado(p.id)}
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
      <View {...seccion(3)}>
        <TituloSeccion titulo="Pedidos En Curso" enlace="Ver Todos" href="/dashboard/rutas" />
        {pedidos.length === 0 ? (
          <View style={SOMBRA.card} className="mt-4 rounded-3xl bg-white p-5">
            <Texto className="text-sm text-neutral-500">Ningún pedido en camino ahora mismo.</Texto>
          </View>
        ) : (
          <TablaPedidos pedidos={pedidos} onFila={(p) => router.push({ pathname: "/dashboard/rutas/[pedidoId]", params: { pedidoId: p.id } })} />
        )}
      </View>
    </Pagina>
  );
}
