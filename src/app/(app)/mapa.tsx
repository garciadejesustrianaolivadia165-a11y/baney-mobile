import { useRouter } from "expo-router";

import Mapa from "@/components/mapa";
import PanelDesplegable from "@/components/movil/panel-desplegable";
import PanelMapa from "@/components/movil/panel-mapa";
import TarjetaCercano from "@/components/movil/tarjeta-cercano";
import { IMAGENES } from "@/lib/imagenes";

// ============ VISTA 6: MAPA CLIENTE ============
// El panel blanco de camiones cercanos se arrastra hacia abajo para ver solo el mapa.
export default function MapaCliente() {
  const router = useRouter();
  const abrirSolicitud = () => router.push("/solicitud");

  return (
    <PanelDesplegable
      fondo={
        <>
          <Mapa />
          <PanelMapa placeholder="¿A dónde enviamos hoy?" oportunidad="3 camiones en La Romana" onVer={abrirSolicitud} />
        </>
      }
      titulo="Camiones cercanos"
      accion="Ver todos"
    >
      <TarjetaCercano
        img={IMAGENES["/images/image_mobile/truck image.png"]}
        titulo="Camión Volteo (12m³)"
        detalle="Santo Domingo Este • 2km"
        conPin
        precio="RD$ 4,500"
        chip="Disponible"
        onPress={abrirSolicitud}
      />
      <TarjetaCercano titulo="Plataforma (20 Tons)" detalle="Camino a Santiago" chip={"En 45\nmin"} tono="espera" />
    </PanelDesplegable>
  );
}
