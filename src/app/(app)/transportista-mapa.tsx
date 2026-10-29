import { useRouter } from "expo-router";

import Mapa from "@/components/mapa";
import PanelDesplegable from "@/components/movil/panel-desplegable";
import PanelMapa from "@/components/movil/panel-mapa";
import TarjetaCercano from "@/components/movil/tarjeta-cercano";
import { imagen } from "@/lib/imagenes";
import { VIAJES } from "@/lib/viajes";

// ============ MAPA TRANSPORTISTA (clientes disponibles) ============
// Misma estructura que el mapa del cliente; tocar un cliente abre el detalle del viaje.
export default function MapaTransportista() {
  const router = useRouter();

  return (
    <PanelDesplegable
      fondo={
        <>
          <Mapa />
          <PanelMapa placeholder="¿Dónde buscas carga hoy?" oportunidad="3 clientes en La Romana" onVer={() => router.push("/flota")} />
        </>
      }
      titulo="Clientes cercanos"
      accion="Ver todos"
    >
      {VIAJES.map((v) => (
        <TarjetaCercano
          key={v.id}
          img={imagen(v.img)}
          titulo={v.cliente}
          detalle={`${v.detalle} hacia ${v.destino.split(",")[0]}`}
          conPin
          precio={`RD$ ${v.precio.toLocaleString("en-US")}`}
          chip={v.chip}
          tono={v.tono}
          onPress={() => router.push({ pathname: "/viaje/[id]", params: { id: v.id } })}
        />
      ))}
    </PanelDesplegable>
  );
}
