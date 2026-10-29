import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import { ConfiguracionContenido } from "../cuenta/configuracion";

export default function ConfiguracionCliente() {
  return (
    <Pagina className="gap-7">
      <TituloSeccion titulo="Configuración" />
      <ConfiguracionContenido />
    </Pagina>
  );
}
