import type { ViewStyle } from "react-native";

// Colores "sueltos" del prototipo móvil (vienen literales en el Figma de la Fase 1)
export const C = {
  tinta: "#16202E",
  gris: "#6B7688",
  grisClaro: "#8A93A2",
  grisEtiqueta: "#9AA3AF",
  chevron: "#B9C0CB",
  oliva: "#4A5720",
  olivaTitulo: "#3D4D18",
  olivaOscuro: "#2F3E17",
  olivaCard: "#5A6A20",
  olivaSuave: "#9ba671",
  borde: "#EDEFEB",
  bordeInput: "#E3E6E0",
  campo: "#F1F4F2",
  fondoSuave: "#FBFBFA",
  arena: "#C4B291",
  arenaBoton: "#C4A97C",
  rojo: "#E9564F",
} as const;

// Las sombras CSS arbitrarias (shadow-[0_6px_24px_rgba(...)]) no existen en
// NativeWind: se pasan como style. iOS usa shadow*, Android usa elevation.
function sombra(opacity: number, radius: number, alto: number, elevation: number): ViewStyle {
  return {
    shadowColor: "#141E0F",
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowOffset: { width: 0, height: alto },
    elevation,
  };
}

export const SOMBRA = {
  suave: sombra(0.06, 8, 4, 2),
  card: sombra(0.1, 12, 6, 4),
  alta: sombra(0.16, 17, 10, 8),
  panel: sombra(0.22, 22, -14, 12),
  boton: { ...sombra(0.15, 6, 3, 3), shadowColor: "#000000" },
} as const;
