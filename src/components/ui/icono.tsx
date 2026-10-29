import Svg, { Circle, Path } from "react-native-svg";

type Props = {
  /** Uno o varios `d` de <path>, en viewBox 0 0 24 24 (los mismos de la web) */
  d: string | string[];
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** true = ícono relleno (fill) en lugar de trazo */
  relleno?: boolean;
  /** Círculos extra: [cx, cy, r] */
  circulos?: [number, number, number][];
};

// Equivalente de los <svg viewBox="0 0 24 24" stroke="currentColor"> inline de la web.
export default function Icono({
  d,
  size = 20,
  color = "#16202E",
  strokeWidth = 1.8,
  relleno = false,
  circulos = [],
}: Props) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <Svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={relleno ? color : "none"}
      stroke={relleno ? "none" : color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {circulos.map(([cx, cy, r], i) => (
        <Circle key={`c${i}`} cx={cx} cy={cy} r={r} />
      ))}
      {paths.map((p, i) => (
        <Path key={i} d={p} />
      ))}
    </Svg>
  );
}

// Trazos compartidos por varias pantallas del prototipo
export const ICONOS = {
  inicio: "M3 10.5L12 3l9 7.5M5 9.5V21h14V9.5",
  historial: "M12 8v4l3 2M21 12a9 9 0 1 1-9-9c3.6 0 6.7 2.1 8.1 5.1M21 3v5h-5",
  alertas: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  perfil: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1",
  dashboard: "M4 19l4-6 4 3 4-7 4 4M4 5h16",
  mapa: "M9 4l6 2 6-2v14l-6 2-6-2-6 2V6l6-2zM9 4v14M15 6v14",
  flota: "M2 16V6h11v10M13 9h5l3 4v3h-3M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  camion: "M2 16V6h11v10M13 9h4l3 4v3h-2M6 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 6 19zM17 19a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z",
  chevron: "M9 5l7 7-7 7",
  volver: "M15 5l-7 7 7 7",
  cerrar: "M6 6l12 12M18 6L6 18",
  check: "M5 13l4.5 4.5L19 7",
  pin: "M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z",
  estrella: "M12 2l2.9 6.3 6.6.7-4.9 4.5 1.4 6.5L12 16.7 6 20l1.4-6.5L2.5 9l6.6-.7L12 2z",
  reloj: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  calendario: "M4 6h16v14H4zM8 3v4M16 3v4M4 10h16",
  flecha: "M4 12h15M13 6l6 6-6 6",
  mas: "M12 5v14M5 12h14",
  lapiz: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  salir: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  ajustes:
    "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.18V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 7.26 19.4l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.25 13.7H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 7.26l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 2.82-1.18V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 2.82 1.18l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0 1.18 2.82H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.02z",
  fuego: "M12 2c1 3-1.5 4.5-1.5 7A3.5 3.5 0 0 0 14 12c1.5 0 2-1 2-1 .8 1.2 1.5 2.5 1.5 4a5.5 5.5 0 1 1-11 0c0-4.5 4-6.5 5.5-13z",
  compartir: "M8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
  llamar:
    "M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.6a1 1 0 0 1-.25 1l-2.22 2.2z",
  mensaje:
    "M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 20.5l1.5-4.6A8.4 8.4 0 0 1 3.6 11.5a8.4 8.4 0 0 1 8.4-8.4h.6a8.4 8.4 0 0 1 8.4 8.4z",
  subirBajar: "M7 20V5M7 5L4 8M7 5l3 3M17 4v15M17 19l3-3M17 19l-3-3",
  tendencia: "M4 15l6-6 4 4 6-6M20 7v5h-5",
  correo: "M3 7l9 6 9-6M3 5h18v14H3z",
  clave: "M7 10V7a5 5 0 0 1 10 0v3M5 10h14v10H5z",
  ojo: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z",
  tarjeta: "M3 7h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7zM3 10h18M6 14h3",
  empresa: "M4 21V4h11v17M15 9h5v12M8 8h3M8 12h3M8 16h3",
} as const;
