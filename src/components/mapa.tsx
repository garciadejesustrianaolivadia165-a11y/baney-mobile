import MapView from "react-native-maps";
import type { ViewStyle } from "react-native";

// Santo Domingo, mismo centro que el iframe de Google Maps de la web.
// En Android/iOS usa react-native-maps (incluido en Expo Go); en web, mapa.web.tsx.
export default function Mapa({ style }: { style?: ViewStyle }) {
  return (
    <MapView
      style={[{ width: "100%", height: "100%" }, style]}
      initialRegion={{
        latitude: 18.4861,
        longitude: -69.9312,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }}
    />
  );
}
