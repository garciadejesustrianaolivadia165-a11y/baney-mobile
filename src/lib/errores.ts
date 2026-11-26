import { useSyncExternalStore } from "react";
import { Alert } from "react-native";

// Captura de errores no controlados. En los builds de producción (APK) un error
// de JavaScript sin capturar cierra la app sin aviso; aquí se guarda y se muestra
// en pantalla (ver app/_layout.tsx) para poder diagnosticarlo.
export type ErrorCapturado = { mensaje: string; pila: string; fatal: boolean; fecha: string };

let ultimo: ErrorCapturado | null = null;
const oyentes = new Set<() => void>();

function describir(e: unknown): { mensaje: string; pila: string } {
  if (e instanceof Error) return { mensaje: `${e.name}: ${e.message}`, pila: (e.stack ?? "").split("\n").slice(0, 12).join("\n") };
  return { mensaje: String(e), pila: "" };
}

export function registrarError(e: unknown, fatal = false) {
  const d = describir(e);
  ultimo = { ...d, fatal, fecha: new Date().toISOString() };
  oyentes.forEach((f) => f());
  if (fatal) {
    // Alert funciona aunque el árbol de React ya no exista.
    Alert.alert("Error al iniciar BANEY", `${d.mensaje}\n\n${d.pila}`.slice(0, 1500));
  }
}

export function limpiarError() {
  ultimo = null;
  oyentes.forEach((f) => f());
}

export function useErrorCapturado() {
  return useSyncExternalStore(
    (f) => {
      oyentes.add(f);
      return () => oyentes.delete(f);
    },
    () => ultimo,
    () => ultimo,
  );
}

type GlobalConErrorUtils = typeof globalThis & {
  ErrorUtils?: { getGlobalHandler?: () => (e: unknown, fatal?: boolean) => void; setGlobalHandler: (h: (e: unknown, fatal?: boolean) => void) => void };
};

export function instalarCapturaGlobal() {
  const eu = (globalThis as GlobalConErrorUtils).ErrorUtils;
  if (!eu || (instalarCapturaGlobal as { hecho?: boolean }).hecho) return;
  (instalarCapturaGlobal as { hecho?: boolean }).hecho = true;
  eu.setGlobalHandler((e, fatal) => {
    registrarError(e, !!fatal);
    // No se reenvía al manejador nativo: en producción cerraría la app.
    if (__DEV__) console.error(e);
  });
}
