import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import { ConfiguracionContenido } from "../cuenta/configuracion";

// Configuración del proveedor: las mismas preferencias y seguridad que el cliente
// (UC-USER-10); en la web esta vista sigue siendo un marcador.
export default function ConfiguracionProveedor() {
  return (
    <Pagina className="gap-7">
      <TituloSeccion titulo="Configuración" />
      <ConfiguracionContenido />
    </Pagina>
  );
}
