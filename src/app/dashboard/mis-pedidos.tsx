import Pagina from "@/components/dashboard/pagina";
import Texto from "@/components/ui/texto";

// Port de routes/dashboard/mis-pedidos.tsx: en la web esta vista aún es un marcador ("<div>MyOrders</div>").
export default function MyOrders() {
  return (
    <Pagina>
      <Texto className="font-sans text-xl font-semibold text-[#3F443D]">MyOrders</Texto>
    </Pagina>
  );
}
