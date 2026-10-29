import Cascaron from "@/components/dashboard/cascaron";

// Área privada del cliente: mismo armazón que el proveedor con otro menú
// (Marketplace es su inicio, Historial, Métodos de pago, Configuración).
export default function ClienteLayout() {
  return <Cascaron rol="cliente" />;
}
