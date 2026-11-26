import "@/global.css";

import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, type ErrorBoundaryProps } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import PantallaError from "@/components/pantalla-error";
import { limpiarError, useErrorCapturado } from "@/lib/errores";
import { FUENTES } from "@/lib/fuentes";

// El splash (fondo caney-dark con el logotipo blanco, ver app.json) se mantiene
// hasta que las fuentes están listas, igual que la LoadingScreen de la web.
SplashScreen.preventAutoHideAsync().catch(() => undefined);

// Errores de render dentro de cualquier pantalla (expo-router los enruta aquí).
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <PantallaError mensaje={`${error.name}: ${error.message}`} pila={error.stack ?? ""} onReintentar={retry} />;
}

export default function RootLayout() {
  const [cargadas, error] = useFonts(FUENTES);
  const capturado = useErrorCapturado();

  useEffect(() => {
    if (cargadas || error) SplashScreen.hideAsync().catch(() => undefined);
  }, [cargadas, error]);

  if (capturado) {
    return <PantallaError mensaje={capturado.mensaje} pila={capturado.pila} onReintentar={limpiarError} />;
  }
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
