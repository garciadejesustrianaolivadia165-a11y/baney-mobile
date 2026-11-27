import { useEffect, useState } from "react";
import { AppState, Linking, Platform, Pressable, Text, View } from "react-native";
import Constants from "expo-constants";
import { newerAndroidRelease, type AndroidRelease } from "@/lib/android-update";

export default function AndroidUpdateNotice() {
  const [release, setRelease] = useState<AndroidRelease | null>(null);
  const [dismissed, setDismissed] = useState<number | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const config = Constants.expoConfig;
    const url = config?.extra?.androidUpdateUrl;
    const applicationId = config?.extra?.androidApplicationId;
    if (typeof url !== "string" || typeof applicationId !== "string" || !config?.android?.versionCode) return;
    let lastCheck = 0, stopped = false;
    let active: AbortController | undefined;
    const check = async () => {
      if (Date.now() - lastCheck < 6 * 60 * 60 * 1000) return;
      lastCheck = Date.now(); active = new AbortController();
      const timeout = setTimeout(() => active?.abort(), 8000);
      try {
        const response = await fetch(url, { signal: active.signal });
        if (response.ok) {
          const update = newerAndroidRelease(await response.json(), applicationId, config.android!.versionCode!, url);
          if (!stopped) setRelease(update);
        }
      } catch { /* Offline or not published yet: don't interrupt the application. */ }
      finally { clearTimeout(timeout); }
    };
    void check();
    const listener = AppState.addEventListener("change", state => { if (state === "active") void check(); });
    return () => { stopped = true; active?.abort(); listener.remove(); };
  }, []);
  if (!release || dismissed === release.versionCode) return null;
  return <View style={{ backgroundColor: "#e9efdb", padding: 14 }} accessibilityLiveRegion="polite">
    <Text style={{ color: "#213e31", fontWeight: "bold" }}>Baney {release.versionName}: actualización disponible</Text>
    <Text>Descarga la APK. Android te pedirá confirmar la instalación.</Text>
    {error && <Text>No se pudo abrir la descarga. Intenta de nuevo.</Text>}
    <View style={{ flexDirection: "row", gap: 24, paddingTop: 10 }}>
      <Pressable accessibilityRole="link" onPress={() => { setError(false); void Linking.openURL(release.apkUrl).catch(() => setError(true)); }}><Text>Descargar</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={() => setDismissed(release.versionCode)}><Text>Más tarde</Text></Pressable>
    </View>
  </View>;
}
