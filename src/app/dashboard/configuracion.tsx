import Pagina from "@/components/dashboard/pagina";
import Texto from "@/components/ui/texto";

// Port de routes/dashboard/configuracion.tsx: en la web esta vista aún es un marcador ("<div>Settings</div>").
export default function Settings() {
  return (
    <Pagina>
      <Texto className="font-sans text-xl font-semibold text-[#3F443D]">Settings</Texto>
    </Pagina>
  );
}
