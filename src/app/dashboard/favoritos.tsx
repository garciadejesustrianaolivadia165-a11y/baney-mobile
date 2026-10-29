import Pagina from "@/components/dashboard/pagina";
import Texto from "@/components/ui/texto";

// Port de routes/dashboard/favoritos.tsx: en la web esta vista aún es un marcador ("<div>Favorites</div>").
export default function Favorites() {
  return (
    <Pagina>
      <Texto className="font-sans text-xl font-semibold text-[#3F443D]">Favorites</Texto>
    </Pagina>
  );
}
