import { Redirect } from "expo-router";

// El acceso del prototipo usa las vistas de Inicio de Sección / Crea tu cuenta ((auth)/login y register).
export default function Auth() {
  return <Redirect href="/register" />;
}
