import Pagina from "@/components/dashboard/pagina";
import Texto from "@/components/ui/texto";

// Port de routes/dashboard/clientes/index.tsx: en la web esta vista aún es un marcador ("<div>Clients</div>").
export default function Clients() {
  return (
    <Pagina>
      <Texto className="font-sans text-xl font-semibold text-[#3F443D]">Clients</Texto>
    </Pagina>
  );
}
