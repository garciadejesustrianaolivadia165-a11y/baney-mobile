import "@/global.css";

import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import { FUENTES } from "@/lib/fuentes";

// El splash (fondo caney-dark con el logotipo blanco, ver app.json) se mantiene
// hasta que las fuentes están listas, igual que la LoadingScreen de la web.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [cargadas, error] = useFonts(FUENTES);

  useEffect(() => {
    if (cargadas || error) SplashScreen.hideAsync();
  }, [cargadas, error]);

  if (!cargadas && !error) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#ffffff" },
        }}
      />
    </>
  );
}
