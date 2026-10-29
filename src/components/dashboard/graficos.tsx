import { useState, type ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import Svg, { Circle, Defs, Line, LinearGradient, Polygon, Polyline, Stop, Text as SvgText } from "react-native-svg";

import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";

// Gráficos del dashboard dibujados a mano con react-native-svg (sin librería de
// charts), como en la web. El hover de la web se sustituye por tocar la barra/punto:
// el valor aparece en una burbuja sobre el gráfico.

/** Card blanca redondeada con la sombra fuerte del dashboard */
export function Tarjeta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <View style={SOMBRA.alta} className={`rounded-[2rem] bg-white p-6 ${className}`}>
      {children}
    </View>
  );
}

export function Burbuja({ texto }: { texto: string | null }) {
  if (!texto) return null;
  return (
    <View style={SOMBRA.boton} className="absolute right-0 top-0 z-10 rounded-lg bg-neutral-900 px-2.5 py-1.5">
      <Texto className="text-[10px] font-medium text-white">{texto}</Texto>
    </View>
  );
}

export function Flecha({ sube, color = "currentColor", size = 12 }: { sube: boolean; color?: string; size?: number }) {
  return <Icono d={sube ? "M4 17l6-6 4 3 6-7M14 7h6v6" : "M4 7l6 6 4-3 6 7M14 17h6v-6"} size={size} color={color} strokeWidth={2} />;
}

const CHIPS: Record<string, { fondo: string; texto: string; hex: string }> = {
  success: { fondo: "bg-success-100", texto: "text-success-700", hex: "#047857" },
  warning: { fondo: "bg-warning-200", texto: "text-warning-800", hex: "#92400e" },
  error: { fondo: "bg-error-200", texto: "text-error-700", hex: "#b91c1c" },
};

/** Tarjeta de total (Total Ventas, Total Producto…) */
export function TarjetaTotal({
  label,
  valor,
  cambio,
  sube = true,
  tono = "success",
  icono,
  iconoD,
}: {
  label: string;
  valor: string;
  cambio?: string;
  sube?: boolean;
  tono?: keyof typeof CHIPS;
  icono?: number;
  iconoD?: string;
}) {
  const chip = CHIPS[tono];
  return (
    <View style={SOMBRA.alta} className="rounded-[1.5rem] bg-white p-5">
      <View className="flex-row items-center gap-3">
        {icono !== undefined ? (
          <Image source={icono} contentFit="contain" style={{ width: 40, height: 40 }} />
        ) : (
          <View className={`h-10 w-10 items-center justify-center rounded-xl ${chip.fondo}`}>
            <Icono d={iconoD ?? ""} size={20} color={chip.hex} strokeWidth={1.7} />
          </View>
        )}
        <Texto className="flex-1 text-sm text-neutral-700">{label}</Texto>
        {cambio && (
          <View className={`flex-row items-center gap-1 rounded-full px-2.5 py-1 ${chip.fondo}`}>
            <Texto className={`text-xs font-medium ${chip.texto}`}>{cambio}</Texto>
            <Flecha sube={sube} color={chip.hex} />
          </View>
        )}
      </View>
      <Texto className="mt-4 font-sans text-4xl font-medium text-neutral-900">{valor}</Texto>
    </View>
  );
}

export function Leyenda({ items, className = "mt-3" }: { items: { nombre: string; color: string }[]; className?: string }) {
  return (
    <View className={`flex-row flex-wrap gap-5 ${className}`}>
      {items.map((l, i) => (
        <View key={`${l.nombre}-${i}`} className="flex-row items-center gap-1.5">
          <View className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
          <Texto className="text-xs text-neutral-600">{l.nombre}</Texto>
        </View>
      ))}
    </View>
  );
}

/** Cabecera de gráfico: título en mayúsculas + control a la derecha */
export function CabeceraGrafico({ titulo, mayusculas = true, children }: { titulo: string; mayusculas?: boolean; children?: ReactNode }) {
  return (
    <View className="flex-row items-center justify-between" style={{ zIndex: 5 }}>
      <Texto className={`font-sans ${mayusculas ? "text-sm font-semibold uppercase tracking-wide text-neutral-900" : "text-lg font-semibold text-neutral-900"}`}>{titulo}</Texto>
      {children}
    </View>
  );
}

export function Cifra({ valor, sub }: { valor: string; sub: string }) {
  return (
    <>
      <Texto className="mt-3 font-sans text-3xl font-medium text-primary-600">{valor}</Texto>
      <Texto className="text-sm text-neutral-600">{sub}</Texto>
    </>
  );
}

/** Dona de 3 segmentos (stroke-dasharray sobre un círculo girado -90°) */
export function Dona({
  segmentos,
  size = 176,
  porcentajes,
}: {
  segmentos: { color: string; dash: string; offset: string; titulo: string }[];
  size?: number;
  /** Muestra 35% / 50% / 15% sobre la dona, como en Finanzas */
  porcentajes?: boolean;
}) {
  const [activo, setActivo] = useState<string | null>(null);
  return (
    <View className="flex-row items-center gap-8">
      <View style={{ width: size, height: size }}>
        <Svg viewBox="0 0 42 42" width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
          {segmentos.map((seg) => (
            <Circle
              key={seg.color}
              cx="21"
              cy="21"
              r="15.9"
              fill="none"
              stroke={seg.color}
              strokeWidth={activo === seg.titulo ? 9 : 7}
              strokeDasharray={seg.dash}
              strokeDashoffset={seg.offset}
              opacity={activo && activo !== seg.titulo ? 0.6 : 1}
              onPress={() => setActivo((a) => (a === seg.titulo ? null : seg.titulo))}
            />
          ))}
        </Svg>
        {porcentajes && (
          <>
            <Texto className="absolute left-1/2 top-1 -translate-x-1/2 text-[10px] font-medium text-white">35%</Texto>
            <Texto className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-medium text-white">50%</Texto>
            <Texto className="absolute bottom-6 left-2 text-[10px] font-medium text-white">15%</Texto>
          </>
        )}
        {activo && (
          <View style={SOMBRA.boton} className="absolute inset-x-0 bottom-0 items-center">
            <View className="rounded-lg bg-neutral-900 px-2.5 py-1.5">
              <Texto className="text-[10px] font-medium text-white">{activo}</Texto>
            </View>
          </View>
        )}
      </View>
      <View className="gap-2">
        {segmentos.map((s) => (
          <View key={s.color} className="flex-row items-center gap-1.5">
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
            <Texto className="text-xs text-neutral-600">{s.titulo.split(":")[0]}</Texto>
          </View>
        ))}
      </View>
    </View>
  );
}

/** Barras verticales; tocar una muestra su valor */
export function Barras({
  valores,
  alto = 130,
  color = "#9eaa31",
  colorActivo = "#5c641d",
  formato,
  ejeX,
  ejeY,
  gap = 6,
  max = 100,
}: {
  valores: number[];
  alto?: number;
  color?: string;
  colorActivo?: string;
  formato: (v: number, i: number) => string;
  ejeX?: string[];
  ejeY?: string[];
  gap?: number;
  max?: number;
}) {
  const [activo, setActivo] = useState<number | null>(null);
  return (
    <View className="flex-row gap-3">
      {ejeY && (
        <View className="justify-between pb-5">
          {ejeY.map((v) => (
            <Texto key={v} className="text-[10px] text-neutral-500">{v}</Texto>
          ))}
        </View>
      )}
      <View className="flex-1">
        <Burbuja texto={activo !== null ? formato(valores[activo], activo) : null} />
        <View style={{ height: alto, gap }} className="flex-row items-end border-b border-dashed border-neutral-200">
          {valores.map((h, i) => (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={formato(h, i)}
              onPress={() => setActivo((a) => (a === i ? null : i))}
              className="flex-1 justify-end"
              style={{ height: alto }}
            >
              <View className="w-full rounded-t-sm" style={{ height: (h * alto) / max, backgroundColor: activo === i ? colorActivo : color }} />
            </Pressable>
          ))}
        </View>
        {ejeX && (
          <View className="mt-1 flex-row justify-between px-4">
            {ejeX.map((q) => (
              <Texto key={q} className="text-[10px] text-neutral-500">{q}</Texto>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

/** Barras agrupadas (varias series por categoría), con valores negativos opcionales */
export function BarrasAgrupadas({
  categorias,
  series,
  alto = 150,
  max,
  min = 0,
  anchoBarra = 14,
  ejeY,
  formato,
  colorEjeX = "#878c83",
}: {
  categorias: string[];
  series: { nombre: string; color: string; valores: number[] }[];
  alto?: number;
  max: number;
  min?: number;
  anchoBarra?: number;
  ejeY?: string[];
  formato: (serie: string, categoria: string, v: number) => string;
  colorEjeX?: string;
}) {
  const [activo, setActivo] = useState<string | null>(null);
  const rango = max - min;
  const yCero = alto * (max / rango);
  return (
    <View className="flex-row gap-3">
      {ejeY && (
        <View className="justify-between pb-5">
          {ejeY.map((v) => (
            <Texto key={v} className="text-[10px] text-neutral-500">{v}</Texto>
          ))}
        </View>
      )}
      <View className="flex-1">
        <Burbuja texto={activo} />
        <View style={{ height: alto }} className="flex-row">
          {min < 0 && <View className="absolute left-0 right-0 border-t border-neutral-200" style={{ top: yCero }} />}
          {min === 0 && <View className="absolute bottom-0 left-0 right-0 border-t border-neutral-200" />}
          {categorias.map((cat, ci) => (
            <View key={cat} className={`flex-1 flex-row justify-center gap-1 ${min < 0 && ci > 0 ? "border-l border-neutral-100" : ""}`}>
              {series.map((s) => {
                const v = s.valores[ci];
                const h = (Math.abs(v) / rango) * alto;
                const etiqueta = formato(s.nombre, cat, v);
                return (
                  <Pressable key={s.nombre} accessibilityRole="button" accessibilityLabel={etiqueta} onPress={() => setActivo((a) => (a === etiqueta ? null : etiqueta))} style={{ width: anchoBarra, height: alto }}>
                    <View
                      className="absolute w-full rounded-sm"
                      style={{ backgroundColor: s.color, height: h, opacity: activo === etiqueta ? 0.75 : 1, ...(v >= 0 ? { bottom: alto - yCero } : { top: yCero }) }}
                    />
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
        <View className="mt-1 flex-row">
          {categorias.map((m) => (
            <Texto key={m} className="flex-1 text-center text-[10px]" style={{ color: colorEjeX }}>{m}</Texto>
          ))}
        </View>
      </View>
    </View>
  );
}

/** Líneas con puntos (varias series, Jan-Jun) */
export function Lineas({
  series,
  meses,
  ancho = 340,
  alto = 130,
  formato,
}: {
  series: { nombre: string; color: string; puntos: number[] }[];
  meses: string[];
  ancho?: number;
  alto?: number;
  formato: (serie: string, mes: string, v: number) => string;
}) {
  const [activo, setActivo] = useState<string | null>(null);
  const paso = ancho / (meses.length - 1);
  const aY = (v: number) => alto - (v / 100) * alto;
  return (
    <View>
      <Burbuja texto={activo} />
      <Svg viewBox={`-8 -8 ${ancho + 16} ${alto + 32}`} style={{ width: "100%", aspectRatio: (ancho + 16) / (alto + 32) }} accessibilityLabel="Indicadores mensuales">
        {[0, 33, 66, 100].map((v) => (
          <Line key={v} x1="0" x2={ancho} y1={aY(v)} y2={aY(v)} stroke="#e5e7e5" strokeDasharray="3 4" />
        ))}
        {series.map((s) => (
          <Polyline key={s.nombre} fill="none" stroke={s.color} strokeWidth="1.8" points={s.puntos.map((v, j) => `${j * paso},${aY(v)}`).join(" ")} />
        ))}
        {series.map((s) =>
          s.puntos.map((v, j) => {
            const etiqueta = formato(s.nombre, meses[j], v);
            return <Circle key={`${s.nombre}-${j}`} cx={j * paso} cy={aY(v)} r={activo === etiqueta ? 4.5 : 3} fill={s.color} onPress={() => setActivo((a) => (a === etiqueta ? null : etiqueta))} />;
          }),
        )}
        {meses.map((m, j) => (
          <SvgText key={m} x={j * paso} y={alto + 18} textAnchor="middle" fontSize="9" fill="#878c83" fontFamily="Inter">{m}</SvgText>
        ))}
      </Svg>
    </View>
  );
}

/** Área con degradado bajo una curva */
export function Area({
  valores,
  ancho = 420,
  alto = 180,
  max = 500,
  color = "#ec8a3c",
  degradado = "#f5a45c",
  grosor = 2.5,
  ejeX,
  ejeY,
  formato,
  destacado,
}: {
  valores: number[];
  ancho?: number;
  alto?: number;
  max?: number;
  color?: string;
  degradado?: string;
  grosor?: number;
  ejeX: string[];
  ejeY?: string[];
  formato: (v: number, i: number) => string;
  /** Burbuja fija sobre un punto (índice) con un texto */
  destacado?: { indice: number; texto: string; sub?: string };
}) {
  const [activo, setActivo] = useState<number | null>(null);
  const paso = ancho / (valores.length - 1);
  const aY = (v: number) => alto - (v / max) * alto;
  const puntos = valores.map((v, i) => `${i * paso},${aY(v)}`).join(" ");
  const id = `area-${color.replace("#", "")}`;
  return (
    <View className="flex-row gap-3">
      {ejeY && (
        <View className="justify-between pb-6">
          {ejeY.map((v) => (
            <Texto key={v} className="text-[10px] text-neutral-500">{v}</Texto>
          ))}
        </View>
      )}
      <View className="flex-1">
        <Burbuja texto={activo !== null ? formato(valores[activo], activo) : null} />
        <Svg viewBox={`0 0 ${ancho} ${alto}`} preserveAspectRatio="none" style={{ width: "100%", height: 176 }} accessibilityLabel="Gráfico de área">
          <Defs>
            <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={degradado} stopOpacity="0.85" />
              <Stop offset="100%" stopColor={degradado} stopOpacity="0.05" />
            </LinearGradient>
          </Defs>
          <Polygon points={`0,${alto} ${puntos} ${ancho},${alto}`} fill={`url(#${id})`} />
          <Polyline points={puntos} fill="none" stroke={color} strokeWidth={grosor} strokeLinejoin="round" strokeLinecap="round" />
          {valores.map((v, i) => (
            <Circle key={i} cx={i * paso} cy={aY(v)} r="7" fill={activo === i ? color : "transparent"} onPress={() => setActivo((a) => (a === i ? null : i))} />
          ))}
        </Svg>
        {destacado && (
          <View pointerEvents="none" className="absolute items-center" style={{ left: `${(destacado.indice / (valores.length - 1)) * 100}%`, top: `${(aY(valores[destacado.indice]) / alto) * 100 - 24}%`, transform: [{ translateX: -30 }] }}>
            <View style={SOMBRA.boton} className={`rounded-lg px-2.5 py-1 ${destacado.sub ? "bg-white" : "bg-neutral-900"}`}>
              <Texto className={`text-xs font-medium ${destacado.sub ? "font-semibold text-neutral-900" : "text-white"}`}>{destacado.texto}</Texto>
              {destacado.sub && <Texto className="text-[9px] text-neutral-400">{destacado.sub}</Texto>}
            </View>
            <View className="mt-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-secondary2-500" />
          </View>
        )}
        <View className="mt-1 flex-row justify-between">
          {ejeX.map((d) => (
            <Texto key={d} className="text-[10px] text-neutral-500">{d}</Texto>
          ))}
        </View>
      </View>
    </View>
  );
}

/** Botón "Filtrar periodos" con rango de fechas (abre el CalendarioFiltro) */
export function BotonPeriodo({ titulo, rango, abierto, onPress }: { titulo: string; rango: string; abierto: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: abierto }} onPress={onPress} className="flex-row items-center gap-3 rounded-2xl bg-primary-200/70 px-5 py-3 active:bg-primary-300">
      <Icono d={["M3 5h18v17H3z", "M8 3v4M16 3v4M3 10h18"]} size={24} color="#1e2a19" />
      <View>
        <Texto className="font-sans text-sm font-semibold text-primary-800">{titulo}</Texto>
        <Texto className="text-xs text-primary-800/80">{rango}</Texto>
      </View>
      <View className="ml-2" style={{ transform: [{ rotate: abierto ? "180deg" : "0deg" }] }}>
        <Icono d="M6 9l6 6 6-6" size={16} color="#1e2a19" strokeWidth={2} />
      </View>
    </Pressable>
  );
}

export function Tabs({ opciones, activa, onCambio }: { opciones: string[]; activa: string; onCambio: (t: string) => void }) {
  return (
    <View className="flex-row items-center gap-5">
      {opciones.map((t) => (
        <Pressable key={t} accessibilityRole="tab" accessibilityState={{ selected: activa === t }} onPress={() => onCambio(t)} className={`border-b-2 pb-1 ${activa === t ? "border-primary-600" : "border-transparent"}`}>
          <Texto className={`text-sm ${activa === t ? "font-semibold text-primary-700" : "text-neutral-500"}`}>{t}</Texto>
        </Pressable>
      ))}
    </View>
  );
}

export function Estrellas({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <View className="flex-row gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Svg key={s} viewBox="0 0 20 20" width={size} height={size}>
          <Polygon points="10,1.5 12.6,6.8 18.5,7.7 14.2,11.8 15.2,17.6 10,14.9 4.8,17.6 5.8,11.8 1.5,7.7 7.4,6.8" fill={s <= n ? "#fbbf24" : "#d3d6d0"} />
        </Svg>
      ))}
    </View>
  );
}

export function AnilloProgreso({ pct }: { pct: number }) {
  const circ = 2 * Math.PI * 15.9;
  return (
    <View className="h-16 w-16 items-center justify-center">
      <Svg viewBox="0 0 42 42" width={64} height={64} style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
        <Circle cx="21" cy="21" r="15.9" fill="none" stroke="#efefef" strokeWidth="4" />
        <Circle cx="21" cy="21" r="15.9" fill="none" stroke="#b1864e" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(pct / 100) * circ} ${circ}`} />
      </Svg>
      <Texto className="text-xs font-medium text-neutral-700">{pct}%</Texto>
    </View>
  );
}

export function Sparkline({ sube }: { sube: boolean }) {
  return (
    <Svg viewBox="0 0 48 20" width={48} height={20}>
      <Polyline fill="none" stroke={sube ? "#10b981" : "#ef4444"} strokeWidth="2" strokeLinecap="round" points={sube ? "2,16 14,12 26,14 38,6 46,3" : "2,4 14,8 26,6 38,14 46,17"} />
    </Svg>
  );
}

/** Medidor semicircular (85%) */
export function Medidor({ pct, texto }: { pct: number; texto: string }) {
  return (
    <View className="h-40 w-40 items-center justify-center">
      <Svg viewBox="0 0 42 42" width={160} height={160} style={{ position: "absolute", transform: [{ rotate: "-220deg" }] }}>
        <Circle cx="21" cy="21" r="17" fill="none" stroke="#e9e9e9" strokeWidth="5" strokeLinecap="round" strokeDasharray="85 107" />
        <Circle cx="21" cy="21" r="17" fill="none" stroke="#9eaa31" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 85} 107`} />
      </Svg>
      <View style={SOMBRA.alta} className="h-24 w-24 items-center justify-center rounded-full bg-white">
        <Texto className="font-sans text-2xl font-semibold text-neutral-900">{texto}</Texto>
      </View>
    </View>
  );
}

/** Lista de valores a la izquierda del gráfico, alineados con su altura */
export function EjeY({ valores, pb = "pb-5" }: { valores: string[]; pb?: string }) {
  return (
    <View className={`justify-between ${pb}`}>
      {valores.map((v) => (
        <Texto key={v} className="text-[10px] text-neutral-500">{v}</Texto>
      ))}
    </View>
  );
}

export const DONA_STATUS = [
  { color: "#9eaa31", dash: "50 50", offset: "0", titulo: "Completado: 50%" },
  { color: "#e0b84a", dash: "35 65", offset: "-50", titulo: "En proceso: 35%" },
  { color: "#6b4926", dash: "15 85", offset: "-85", titulo: "Incompleto: 15%" },
];
