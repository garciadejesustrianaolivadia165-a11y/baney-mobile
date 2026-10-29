import { Redirect, useLocalSearchParams } from "expo-router";

// El marketplace es el inicio del cliente (src/app/cliente). Esta ruta se conserva por los enlaces de la web.
export default function Marketplace() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  return <Redirect href={q ? { pathname: "/cliente", params: { q } } : "/cliente"} />;
}
