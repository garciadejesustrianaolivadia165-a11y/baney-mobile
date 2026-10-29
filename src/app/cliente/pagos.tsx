import Pagina, { TituloSeccion } from "@/components/dashboard/pagina";
import MediosPago from "@/components/movil/medios-pago";
import Texto from "@/components/ui/texto";

// Métodos de pago del cliente: la misma pasarela de "Escoge tu medio de pago" en modo gestión
export default function PagosCliente() {
  return (
    <Pagina>
      <TituloSeccion titulo="Métodos de pago" />
      <Texto className="-mt-3 text-sm text-neutral-500">Toca un método para ver sus datos, hacerlo principal o eliminarlo. Registra tarjetas nuevas o vincula tu PayPal.</Texto>
      <MediosPago modo="gestion" />
    </Pagina>
  );
}
