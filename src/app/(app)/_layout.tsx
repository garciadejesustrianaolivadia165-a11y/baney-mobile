import { Tabs } from "expo-router";

import NavInferior from "@/components/movil/nav-inferior";

// Pantallas post-login del prototipo con la barra inferior. Los ítems de la barra
// los decide NavInferior según el rol (cliente o transportista), como en la web.
export default function AppLayout() {
  return (
    <Tabs tabBar={() => <NavInferior />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: "#ffffff" } }}>
      <Tabs.Screen name="mapa" />
      <Tabs.Screen name="historial" />
      <Tabs.Screen name="alertas" />
      <Tabs.Screen name="perfil" />
      <Tabs.Screen name="transportista" />
      <Tabs.Screen name="transportista-mapa" />
      <Tabs.Screen name="tracking" options={{ href: null }} />
    </Tabs>
  );
}
