import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import type { FontSource } from "expo-font";

/**
 * Mismas familias y pesos que cargaba app/root.tsx desde Google Fonts en la web:
 * Poppins (sitio público, `font-sans`) e Inter (dashboard, `font-inter`).
 * Se registran como UNA familia con varias caras para que `font-semibold`,
 * `font-bold`, `italic`… elijan el archivo correcto (API de expo-font SDK 58).
 */
type Cara = { path: FontSource; weight: number; style?: "normal" | "italic" };
type Familia = { fontFamily: string; fontDefinitions: Cara[] };

export const FUENTES: Familia[] = [
  {
    fontFamily: "Poppins",
    fontDefinitions: [
      { path: Poppins_300Light, weight: 300 },
      { path: Poppins_400Regular, weight: 400 },
      { path: Poppins_400Regular_Italic, weight: 400, style: "italic" },
      { path: Poppins_500Medium, weight: 500 },
      { path: Poppins_600SemiBold, weight: 600 },
      { path: Poppins_700Bold, weight: 700 },
    ],
  },
  {
    fontFamily: "Inter",
    fontDefinitions: [
      { path: Inter_400Regular, weight: 400 },
      { path: Inter_500Medium, weight: 500 },
      { path: Inter_600SemiBold, weight: 600 },
      { path: Inter_700Bold, weight: 700 },
    ],
  },
];
