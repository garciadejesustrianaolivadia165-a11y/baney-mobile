import { Pressable, ScrollView, Text, View } from "react-native";

// Pantalla de diagnóstico: sustituye el cierre silencioso del APK por el mensaje
// del error. Sin NativeWind ni fuentes propias, para que se vea aunque fallen.
export default function PantallaError({ mensaje, pila, onReintentar }: { mensaje: string; pila: string; onReintentar?: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", paddingTop: 56, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", color: "#3F443D" }}>Algo salió mal</Text>
      <Text style={{ marginTop: 8, color: "#7E8A80" }}>Envía una captura de esta pantalla al equipo de desarrollo.</Text>
      <ScrollView style={{ marginTop: 16, flex: 1 }}>
        <Text selectable style={{ fontSize: 14, fontWeight: "600", color: "#B42318" }}>{mensaje}</Text>
        <Text selectable style={{ marginTop: 12, fontSize: 11, color: "#3F443D", fontFamily: "monospace" }}>{pila}</Text>
      </ScrollView>
      {onReintentar && (
        <Pressable onPress={onReintentar} style={{ alignSelf: "center", marginBottom: 40, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 999, backgroundColor: "#415936" }}>
          <Text style={{ color: "#ffffff", fontWeight: "600" }}>Reintentar</Text>
        </Pressable>
      )}
    </View>
  );
}
