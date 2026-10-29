import Pagina from "@/components/dashboard/pagina";
import FormularioPerfil from "@/components/perfil/formulario-perfil";
import { actualizarPerfil, useSesion } from "@/lib/sesion";

// Mi Perfil del cliente: el mismo formulario del proveedor (usuario + empresa)
export default function PerfilCliente() {
  const { perfil } = useSesion();
  return (
    <Pagina className="gap-8">
      <FormularioPerfil inicial={perfil} secciones={["usuario", "empresa"]} onGuardar={(v) => actualizarPerfil({ nombres: v.nombres, apellidos: v.apellidos, cedula: v.cedula, correo: v.correo, telefono: v.telefono, provincia: v.provincia, pais: v.pais, avatar: v.avatar, empresa: v.empresa })} />
    </Pagina>
  );
}
