import { useState } from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";

import FiltroPeriodo from "@/components/dashboard/filtro-periodo";
import { AnilloProgreso, Area, BotonPeriodo, Estrellas, Sparkline, Tabs, Tarjeta } from "@/components/dashboard/graficos";
import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import { CalendarioFiltro } from "@/components/dashboard/search-header";
import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { imagen } from "@/lib/imagenes";

const IMGH = "/images/image_home";
const IMGI = "/images/image_inicio";

// ==== Simulación de datos ====
// Cada combinación de período + fecha produce los mismos números (determinístico),
// como si se consultara un backend real. TODO: reemplazar por la API.
const FACTOR_TAB: Record<string, number> = { Mensual: 1, Semanal: 0.3, Diario: 0.05, Monthly: 1, Weekly: 0.3, Daily: 0.05 };

// Ruido determinístico en [-0.5, 0.5]
const ruido = (seed: number, i: number) => Math.sin(seed * 3.7 + i * 1.93) * 0.5;
const variar = (base: number, seed: number, i: number, amplitud = 0.35) => base * (1 + ruido(seed, i) * amplitud * 2);
const dinero = (v: number) => `$${Math.max(1, Math.round(v)).toLocaleString("en-US")}.00`;

const MESES_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// TODO: reemplazar las fotos por las reales de cada producto cuando se exporten del Figma
const misProductosBase = [
  { nombre: "Guayaba Fresca", categoria: "Frutas", img: `${IMGH}/image_home_17.png`, ventas: 2441, estrellas: 5, pct: 75 },
  { nombre: "Lechuga importada", categoria: "Tuberculos", img: `${IMGH}/image_home_04.png`, ventas: 3515, estrellas: 3, pct: 21 },
  { nombre: "Naranja Dulce", categoria: "Frutas", img: `${IMGH}/image_home_16.png`, ventas: 3515, estrellas: 4, pct: 85 },
  { nombre: "Zanahoria Criolla", categoria: "Tuberculos", img: `${IMGI}/image_inicio_01.png`, ventas: 3515, estrellas: 3, pct: 45 },
  { nombre: "Tomates cherry", categoria: "Frutas", img: `${IMGI}/image_inicio_02.png`, ventas: 3515, estrellas: 4, pct: 52 },
  { nombre: "Aji Morrón Variado", categoria: "Tuberculos", img: `${IMGI}/image_inicio_03.png`, ventas: 2441, estrellas: 2, pct: 35 },
];
const masVendidosBase = [
  { nombre: "Aji Morrón Variado", precio: 15.6, img: `${IMGI}/image_inicio_02.png` },
  { nombre: "Maiz Dulce", precio: 15.6, img: `${IMGI}/image_inicio_03.png` },
  { nombre: "Papa Criolla", precio: 15.6, img: `${IMGH}/image_home_14.png` },
  { nombre: "Esparrago importado", precio: 5.6, img: `${IMGH}/image_home_04.png` },
  { nombre: "Coliflor", precio: 5.6, img: `${IMGH}/image_home_17.png` },
];
const ventasProductoBase = [
  { nombre: "Lechuga importada", categoria: "Tubérculos", precio: 7999, img: `${IMGH}/image_home_04.png` },
  { nombre: "Papa criolla", categoria: "Frutas", precio: 12500, img: `${IMGH}/image_home_14.png` },
  { nombre: "Repollo importado", categoria: "Tubérculos", precio: 585, img: `${IMGH}/image_home_04.png` },
  { nombre: "Aji picante", categoria: "Tubérculos", precio: 7999, img: `${IMGI}/image_inicio_02.png` },
  { nombre: "Zanahoria Criolla", categoria: "Frutas", precio: 1050, img: `${IMGI}/image_inicio_01.png` },
  { nombre: "Zanahoria Criolla", categoria: "Frutas", precio: 1050, img: `${IMGI}/image_inicio_01.png` },
  { nombre: "Zanahoria Criolla", categoria: "Frutas", precio: 1050, img: `${IMGI}/image_inicio_01.png` },
];
const promedioBase = [
  { nombre: "Tuna soup spinach with himalaya salt", precio: "$12.56", tag: "MAIN COURSE", valor: 524, img: `${IMGH}/image_home_04.png` },
  { nombre: "Chicken curry special with cucumber", precio: "$14.99", tag: "MAIN COURSE", valor: 215, img: `${IMGI}/image_inicio_02.png` },
  { nombre: "Italiano pizza with garlic", precio: "$14.99", tag: "PIZZA", valor: 120, img: `${IMGH}/image_home_14.png` },
  { nombre: "Watermelon juice with ice", precio: "$14.99", tag: "DRINK", valor: 76, img: `${IMGH}/image_home_16.png` },
  { nombre: "Chicken curry special with cucumber", precio: "$14.99", tag: "MAIN COURSE", valor: 215, img: `${IMGH}/image_home_17.png` },
];
const curvaBase = [640, 520, 700, 420, 380, 560, 400, 340, 760, 300, 480];
const ETIQUETAS_CURVA: Record<string, string[]> = {
  Mensual: ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
  Semanal: ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"],
  Diario: ["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm", "12am", "2am"],
};
const BARRAS = "M5 20V10M12 20V4M19 20v-7";

function Subtitulo({ titulo, sub }: { titulo: string; sub: string }) {
  return (
    <View>
      <Texto className="font-sans text-lg font-semibold text-neutral-900">{titulo}</Texto>
      <Texto className="text-xs text-neutral-400">{sub}</Texto>
    </View>
  );
}

export default function ProductIndicators() {
  const [calAbierto, setCalAbierto] = useState(false);
  const [fecha, setFecha] = useState<Date | null>(null);
  const [tabProductos, setTabProductos] = useState("Filtar Todo");
  const [tabVentas, setTabVentas] = useState("Semanal");
  const [tabPedidos, setTabPedidos] = useState("Mensual");
  const [perPromedio, setPerPromedio] = useState("Monthly");

  // Semilla de la simulación: cambia con la fecha del calendario
  const semilla = fecha ? fecha.getDate() + (fecha.getMonth() + 1) * 31 : 0;

  const productosFiltrados = (tabProductos === "Filtar Todo" ? misProductosBase : misProductosBase.filter((p) => p.categoria === tabProductos)).map((p, i) => ({
    ...p,
    pct: Math.min(98, Math.max(5, Math.round(variar(p.pct, semilla, i)))),
    ventas: Math.round(variar(p.ventas, semilla, i + 3)),
  }));
  const masVendidos = masVendidosBase.map((p, i) => ({ ...p, orden: Math.max(2, Math.round(10 + ruido(semilla, i + 7) * 10)) }));
  const factorVentas = FACTOR_TAB[tabVentas];
  const ventasPorProducto = ventasProductoBase.map((p, i) => ({ ...p, monto: variar(p.precio * factorVentas * 4, semilla, i + 11), pedidos: Math.max(1, Math.round(7 + ruido(semilla, i + 5) * 8)) }));
  const factorPedidos = FACTOR_TAB[tabPedidos];
  const curva = curvaBase.map((v, i) => Math.max(120, Math.round(variar(v, semilla + FACTOR_TAB[tabPedidos] * 17, i))));
  const etiquetasCurva = ETIQUETAS_CURVA[tabPedidos];
  const totalVentas = Math.round(257 * factorPedidos * (1 + ruido(semilla, 1) * 0.4));
  const totalPedidos = Math.round(1245 * factorPedidos * (1 + ruido(semilla, 2) * 0.4));
  const iMax = curva.indexOf(Math.max(...curva));
  const gasto = (85.66 * factorPedidos * (1 + ruido(semilla, 3) * 0.5)).toFixed(2);
  const factorPromedio = FACTOR_TAB[perPromedio];
  const promedioVenta = promedioBase.map((p, i) => {
    const cambio = Math.round(ruido(semilla, i + 13) * 24);
    return { ...p, valor: Math.max(5, Math.round(p.valor * factorPromedio * (1 + ruido(semilla, i + 9) * 0.5))), pct: `${cambio}%`, sube: cambio >= 0 };
  });

  // Rango mostrado en el botón de filtro
  const inicio = fecha ?? new Date(2026, 5, 4);
  const fin = new Date(inicio.getFullYear(), inicio.getMonth() + 1, inicio.getDate());
  const rango = `${inicio.getDate()} de ${MESES_ES[inicio.getMonth()]} ${inicio.getFullYear()} - ${fin.getDate()} de ${MESES_ES[fin.getMonth()]} ${fin.getFullYear()}`;

  return (
    <Pagina>
      <TituloSeccion titulo="Indicadores de productos" enlace="Volver Atrás" href="/dashboard/finanzas" />
      <View className="flex-row flex-wrap items-center justify-between gap-4" style={{ zIndex: calAbierto ? 50 : 1 }}>
        <Texto className="max-w-64 font-sans text-xl leading-snug text-neutral-500">Resumen de stock por producto registrados</Texto>
        <View>
          <BotonPeriodo titulo="Filter Periode" rango={rango} abierto={calAbierto} onPress={() => setCalAbierto((o) => !o)} />
          {calAbierto && (
            <CalendarioFiltro
              onSeleccion={(f) => {
                setFecha(f);
                setCalAbierto(false);
              }}
            />
          )}
        </View>
      </View>

      {/* Mis Productos */}
      <Tarjeta>
        <View className="flex-row flex-wrap items-center justify-between gap-4">
          <Subtitulo titulo="Mis Productos" sub="Resumen del stock y ventas de tus productos" />
          <Tabs opciones={["Filtar Todo", "Tuberculos", "Frutas"]} activa={tabProductos} onCambio={setTabProductos} />
        </View>
        <View className="mt-6 gap-8">
          {productosFiltrados.map((p, i) => (
            <View key={`${p.nombre}-${i}`} className="flex-row items-center gap-4">
              <Image source={imagen(p.img)} accessibilityLabel={p.nombre} contentFit="cover" style={{ width: 80, height: 80, borderRadius: 12 }} />
              <View className="min-w-0 flex-1">
                <Texto numberOfLines={1} className="font-sans text-sm font-semibold text-neutral-900">{p.nombre}</Texto>
                <View className="mt-1 flex-row items-center gap-1.5">
                  <Icono d={BARRAS} size={14} color="#878c83" strokeWidth={2} />
                  <Texto className="text-xs text-neutral-600"><Texto className="text-xs font-semibold text-neutral-800">{p.ventas.toLocaleString("en-US")}</Texto> Total Sales</Texto>
                </View>
                <View className="mt-1 flex-row items-center gap-2">
                  <Estrellas n={p.estrellas} />
                  <Texto className="text-[10px] text-neutral-400">(454 revies)</Texto>
                </View>
              </View>
              <AnilloProgreso pct={p.pct} />
            </View>
          ))}
        </View>
      </Tarjeta>

      {/* Productos mas vendidos */}
      <Tarjeta>
        <Subtitulo titulo="Productos mas vendidos" sub="Los favoritos de tus clientes" />
        <View className="mt-5 gap-5">
          {masVendidos.map((p, i) => (
            <View key={`${p.nombre}-${i}`} className={`flex-row items-center gap-4 ${i < masVendidos.length - 1 ? "border-b border-neutral-100 pb-4" : ""}`}>
              <Texto className="w-7 font-sans text-lg font-semibold text-neutral-400">#{i + 1}</Texto>
              <View className="min-w-0 flex-1">
                <Texto numberOfLines={1} className="text-sm font-semibold text-neutral-900">{p.nombre}</Texto>
                <Texto className="mt-0.5 text-xs text-neutral-600"><Texto className="text-xs font-semibold text-neutral-800">${p.precio}</Texto> Orden {p.orden}x</Texto>
              </View>
              <Image source={imagen(p.img)} accessibilityLabel={p.nombre} contentFit="cover" style={{ width: 48, height: 48, borderRadius: 12 }} />
            </View>
          ))}
        </View>
      </Tarjeta>

      {/* Ventas por producto */}
      <Tarjeta>
        <Subtitulo titulo="Ventas por producto" sub="Ingresos por producto activo" />
        <View className="mt-3">
          <Tabs opciones={["Mensual", "Semanal", "Diario"]} activa={tabVentas} onCambio={setTabVentas} />
        </View>
        <View className="mt-4 gap-4">
          {ventasPorProducto.map((p, i) => (
            <View key={i} className={`flex-row items-center gap-3 ${i < ventasPorProducto.length - 1 ? "border-b border-neutral-100 pb-3" : ""}`}>
              <Image source={imagen(p.img)} accessibilityLabel={p.nombre} contentFit="cover" style={{ width: 48, height: 48, borderRadius: 12 }} />
              <View className="min-w-0 flex-1">
                <Texto numberOfLines={1} className="text-sm font-semibold text-neutral-900">{p.nombre}</Texto>
                <Texto className="text-xs font-medium text-primary-500">{p.categoria}</Texto>
                <Texto className="text-[10px] text-neutral-400">{p.pedidos} pedidos activos</Texto>
              </View>
              <Texto className="font-sans text-sm font-semibold text-neutral-900">{dinero(p.monto)}</Texto>
              <Pressable accessibilityRole="button" accessibilityLabel={`Opciones de ${p.nombre}`} className="px-1">
                <Texto className="text-lg leading-none text-neutral-400">⋯</Texto>
              </Pressable>
            </View>
          ))}
        </View>
        <Pressable accessibilityRole="button" className="mt-4 flex-row items-center gap-1 self-center">
          <Texto className="text-sm font-medium text-neutral-700 underline">Ver mas</Texto>
          <Icono d="M6 9l6 6 6-6" size={14} color="#4d5148" strokeWidth={2} />
        </Pressable>
      </Tarjeta>

      {/* Pedidos Activos */}
      <Tarjeta>
        <View className="flex-row flex-wrap items-center justify-between gap-3">
          <Subtitulo titulo="Pedidos Activos" sub="Comportamiento anual de tus pedidos" />
          <Tabs opciones={["Mensual", "Semanal", "Diario"]} activa={tabPedidos} onCambio={setTabPedidos} />
        </View>
        <View className="mt-5 flex-row gap-10">
          {[
            { v: `${totalVentas}k`, t: "Total de ventas" },
            { v: totalPedidos.toLocaleString("en-US"), t: "Total de pedidos" },
          ].map((c) => (
            <View key={c.t} className="flex-row items-center gap-2">
              <Icono d={BARRAS} size={20} color="#878c83" strokeWidth={2} />
              <View>
                <Texto className="font-sans text-xl font-semibold text-neutral-900">{c.v}</Texto>
                <Texto className="text-xs text-neutral-400">{c.t}</Texto>
              </View>
            </View>
          ))}
        </View>
        <View className="mt-4">
          <Area
            valores={curva}
            alto={150}
            max={800}
            color="#f97316"
            degradado="#f97316"
            grosor={3}
            ejeY={["800k", "600k", "400k", "200k"]}
            ejeX={etiquetasCurva}
            formato={(v, i) => `${etiquetasCurva[Math.min(i, etiquetasCurva.length - 1)]}: ${v}k`}
            destacado={{ indice: iMax, texto: `$${gasto}`, sub: "Expense" }}
          />
        </View>
      </Tarjeta>

      {/* Promedio de venta por producto */}
      <Tarjeta>
        <View className="flex-row items-center justify-between" style={{ zIndex: 5 }}>
          <Subtitulo titulo="Promedio de venta por producto" sub="Los productos con mejor rendimiento" />
          <FiltroPeriodo valor={perPromedio} onCambio={setPerPromedio} opciones={["Monthly", "Weekly", "Daily"]} />
        </View>
        <View className="mt-5 gap-4">
          {promedioVenta.map((p, i) => (
            <View key={i} className={`flex-row items-center gap-3 ${i < promedioVenta.length - 1 ? "border-b border-neutral-100 pb-4" : ""}`}>
              <Texto className="w-7 font-sans text-lg font-semibold text-neutral-400">#{i + 1}</Texto>
              <Image source={imagen(p.img)} accessibilityLabel={p.nombre} contentFit="cover" style={{ width: 56, height: 56, borderRadius: 12 }} />
              <View className="min-w-0 flex-1">
                <Texto numberOfLines={1} className="text-sm font-semibold text-neutral-900">{p.nombre}</Texto>
                <Texto className="mt-0.5 text-xs text-neutral-600"><Texto className="text-xs font-semibold">{p.precio}</Texto>  <Texto className="text-[10px] font-semibold text-caney-sky">{p.tag}</Texto></Texto>
              </View>
              <Sparkline sube={p.sube} />
              <View className="w-16 items-end">
                <Texto className="font-sans text-lg font-semibold text-neutral-900">{p.valor}</Texto>
                <Texto className="text-[10px] text-neutral-400">Ventas ({p.pct})</Texto>
              </View>
            </View>
          ))}
        </View>
      </Tarjeta>
    </Pagina>
  );
}
