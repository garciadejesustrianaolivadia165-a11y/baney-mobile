import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import MediosPago from "@/components/movil/medios-pago";
import Texto from "@/components/ui/texto";

// Métodos de pago del proveedor: la misma pasarela de "Escoge tu medio de pago" en modo gestión
export default function PagosProveedor() {
  return (
    <Pagina>
      <TituloSeccion titulo="Métodos de pago" enlace="Volver a Mi Perfil" href="/dashboard/perfil" />
      <Texto className="-mt-3 text-sm text-neutral-500">Toca un método para ver sus datos, hacerlo principal o eliminarlo.</Texto>
      <MediosPago modo="gestion" />
    </Pagina>
  );
}
