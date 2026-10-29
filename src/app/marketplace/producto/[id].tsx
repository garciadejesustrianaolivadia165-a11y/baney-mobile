import { Redirect, useLocalSearchParams } from "expo-router";

export default function ProductoRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={{ pathname: "/cliente/producto/[id]", params: { id: id ?? "1" } }} />;
}
