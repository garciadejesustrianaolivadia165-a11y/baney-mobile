import Pagina from "@/components/dashboard/pagina";
import Texto from "@/components/ui/texto";

// Port de routes/dashboard/clientes/[id].tsx: en la web esta vista aún es un marcador ("<div>ClientDetail</div>").
export default function ClientDetail() {
  return (
    <Pagina>
      <Texto className="font-sans text-xl font-semibold text-[#3F443D]">ClientDetail</Texto>
    </Pagina>
  );
}
