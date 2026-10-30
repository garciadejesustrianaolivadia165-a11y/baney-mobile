import { useState, type ReactNode } from "react";
import { Pressable, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";

import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";
import type { Archivo } from "@/lib/documentos";

const MAX_MB = 10;

/**
 * Selector de archivo (imagen o PDF) con expo-document-picker, incluido en Expo Go.
 * Mismo contrato que SubirFoto: devuelve el archivo elegido; la API recibirá el binario.
 */
export default function SubirArchivo({ onArchivo, etiqueta = "Subir archivo", children, className = "" }: { onArchivo: (a: Archivo) => void; etiqueta?: string; children?: ReactNode; className?: string }) {
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function elegir() {
    setError("");
    setCargando(true);
    try {
      const r = await DocumentPicker.getDocumentAsync({ type: ["image/*", "application/pdf"], copyToCacheDirectory: true, multiple: false });
      if (r.canceled) return;
      const a = r.assets[0];
      if (a.size && a.size > MAX_MB * 1024 * 1024) {
        setError(`El archivo supera los ${MAX_MB} MB.`);
        return;
      }
      onArchivo({ uri: a.uri, nombre: a.name, tipo: a.mimeType ?? "application/octet-stream" });
    } catch {
      setError("No se pudo abrir el archivo, inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <View className={className}>
      {children ? (
        <Pressable accessibilityRole="button" accessibilityLabel={etiqueta} onPress={elegir}>
          {children}
        </Pressable>
      ) : (
        <Pressable accessibilityRole="button" onPress={elegir} className="flex-row items-center gap-2 self-start rounded-full border-2 border-primary-500 px-5 py-2.5 active:bg-primary-600">
          {({ pressed }) => (
            <>
              <Icono d="M12 16V4M8 8l4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" size={16} color={pressed ? "#fff" : "#364a2d"} />
              <Texto className="text-sm font-semibold" style={{ color: pressed ? "#fff" : "#364a2d" }}>{cargando ? "Cargando…" : etiqueta}</Texto>
            </>
          )}
        </Pressable>
      )}
      {error ? <Texto accessibilityRole="alert" className="mt-2 text-xs text-error-500">{error}</Texto> : null}
    </View>
  );
}
