import { createElement } from "react";
import type { ViewStyle } from "react-native";

const MAPA_SRC =
  "https://maps.google.com/maps?q=Santo%20Domingo%2C%20Republica%20Dominicana&z=14&output=embed";

// Versión web: el mismo iframe de Google Maps del prototipo web.
export default function Mapa({ style }: { style?: ViewStyle }) {
  return createElement("iframe", {
    title: "Mapa",
    src: MAPA_SRC,
    loading: "lazy",
    style: { border: 0, width: "100%", height: "100%", ...(style as object) },
  });
}
