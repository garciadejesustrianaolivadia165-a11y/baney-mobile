import Pagina from "@/components/dashboard/pagina";
import FormularioPerfil from "@/components/perfil/formulario-perfil";
import type { Perfil } from "@/lib/sesion";

// Mi Perfil del proveedor (routes/dashboard/profile.tsx). TODO: enviar a la API cuando exista el backend.
const PROVEEDOR: Perfil & { cuenta: string } = {
  nombres: "Juan Rafael",
  apellidos: "Pérez Guzmán",
  cedula: "001-1234567-8",
  correo: "agroyucaRD@gmail.com",
  telefono: "+1 (809)-884-3392",
  provincia: "San Pedro de Macorís",
  pais: "República Dominicana",
  avatar: "/images/image_home/Ellipse 5.png",
  empresa: { nombre: "AgroYUCA_RD", correo: "agroyucaRD@gmail.com", telefono: "+1 (809)-884-3392", direccion: "Calle Duarte #12, San Pedro de Macorís", rnc: "1-31-85274-9", dueno: "Juan Rafael Pérez Guzmán" },
  licencia: { numero: "", categoria: "", vencimiento: "" },
  cuenta: "1234567890",
};

export default function Profile() {
  return (
    <Pagina className="gap-8">
      <FormularioPerfil inicial={PROVEEDOR} onGuardar={() => {}} />
    </Pagina>
  );
}
