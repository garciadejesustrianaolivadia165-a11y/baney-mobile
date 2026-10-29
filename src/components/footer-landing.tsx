import { View } from "react-native";

import { ColumnasPie, Sociales } from "@/components/footer";

const columns = [
  { title: "Nosotros", items: ["Quienes Somos", "Marketing digital", "Hazte miembro", "DGII"] },
  { title: "Descargas", items: ["Certificaciones", "APP Movil", "Academia BANEY", "RRSS"] },
  { title: "Ventas", items: ["Hazte vendedor", "Hazte Cliente", "Inversiones", "Desarrollo"] },
  { title: "Support", items: ["Atención al cliente", "Membresias", "Catalogo", "Rutas y Logistica"] },
];

export default function FooterLanding() {
  return (
    <View className="bg-secondary4-500 px-6 py-14">
      <ColumnasPie columnas={columns} />
      <Sociales className="mt-10" />
    </View>
  );
}
