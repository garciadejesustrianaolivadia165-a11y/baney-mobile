import { useState, type ReactNode } from "react";
import { Pressable, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

import Icono from "@/components/ui/icono";
import Texto from "@/components/ui/texto";

const MAX_MB = 5;

/**
 * Selector de imagen desde la galería del teléfono (expo-image-picker, incluido en Expo Go).
 * Devuelve la URI local de la foto; al conectar la API habrá que subir el archivo real.
 */
export default function SubirFoto({
  onFoto,
  etiqueta = "Subir foto",
  className = "",
  children,
}: {
  onFoto: (uri: string) => void;
  etiqueta?: string;
  className?: string;
  /** Si se pasa contenido, se usa como disparador en vez del botón normal */
  children?: ReactNode;
}) {
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function elegir() {
    setError("");
    setCargando(true);
    try {
      const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permiso.granted) {
        setError("Necesitamos permiso para abrir tu galería.");
        return;
      }
      const resultado = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.85, allowsEditing: true, aspect: [1, 1] });
      if (resultado.canceled) return;
      const foto = resultado.assets[0];
      if (foto.fileSize && foto.fileSize > MAX_MB * 1024 * 1024) {
        setError(`La imagen supera los ${MAX_MB} MB.`);
        return;
      }
      onFoto(foto.uri);
    } catch {
      setError("No se pudo leer la imagen, inténtalo de nuevo.");
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
