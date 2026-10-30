import { Redirect, useLocalSearchParams } from "expo-router";

// Ruta de la web: en móvil el checkout vive dentro del área del cliente (mismo armazón y menú).
export default function Redireccion() {
  const params = useLocalSearchParams<Record<string, string>>();
  return <Redirect href={{ pathname: "/cliente/pago", params }} />;
}
