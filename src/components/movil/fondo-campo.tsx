import { View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import { IMAGENES } from "@/lib/imagenes";

// Fondo de campo compartido por rol, búsqueda y login: se dibuja igual en las
// tres pantallas para que empalmen al pasar de una a otra.
export default function FondoCampo() {
  return (
    <View pointerEvents="none" className="absolute inset-x-0 bottom-0 z-0 h-[440px]">
      <Image
        source={IMAGENES["/images/image_mobile/fondo_campo.png"]}
        contentFit="cover"
        style={{ width: "100%", height: "100%" }}
      />
      <LinearGradient
        colors={["#ffffff", "rgba(255,255,255,0.85)", "rgba(255,255,255,0)"]}
        className="absolute inset-x-0 top-0 h-48"
      />
    </View>
  );
}
