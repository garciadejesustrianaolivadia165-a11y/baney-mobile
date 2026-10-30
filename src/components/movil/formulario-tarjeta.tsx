import { useState } from "react";
import { View } from "react-native";

import { BotonPago, Casilla, EntradaPago } from "@/components/movil/pago";
import Texto from "@/components/ui/texto";
import { agregarMetodo } from "@/lib/pagos";

export type DatosTarjeta = { titular: string; numero: string; vencimiento: string; cvc: string };

/**
 * "Completa la información" de una tarjeta nueva. Lo comparten la pasarela
 * (MediosPago) y la pantalla Agregar tarjeta del checkout. Si `guardar` es true,
 * la tarjeta queda en Perfil → Métodos de pago (lib/pagos.ts).
 */
export default function FormularioTarjeta({ textoBoton, onListo, guardar = false, titulo = "Completa la información" }: { textoBoton: string; onListo: (t: DatosTarjeta) => void; guardar?: boolean; titulo?: string }) {
  const [titular, setTitular] = useState("");
  const [numero, setNumero] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState("");
  const digitos = numero.replace(/\D/g, "");

  function enviar() {
    if (titular.trim() === "") return setError("Escribe el nombre del titular");
    if (digitos.length < 12) return setError("El número de tarjeta está incompleto");
    if (!/^\d{2}\/\d{2}$/.test(vencimiento)) return setError("Vencimiento en formato MM/AA");
    if (cvc.length < 3) return setError("CVC de 3 o 4 dígitos");
    setError("");
    if (guardar) agregarMetodo({ tipo: "debito", titulo: "Tarjeta Débito", detalle: `**** ${digitos.slice(-4)}`, titular: titular.trim(), vencimiento });
    onListo({ titular: titular.trim(), numero: digitos, vencimiento, cvc });
  }

  return (
    <View>
      <Texto className="text-[20px] font-bold text-[#16202E]">{titulo}</Texto>
      <View className="mt-4 gap-3">
        <EntradaPago placeholder="Nombre del titular" value={titular} onChange={setTitular} />
        <EntradaPago placeholder="Número de tarjeta" value={numero} onChange={(t) => setNumero(t.replace(/[^\d ]/g, "").slice(0, 19))} tipo="numero" />
        <View className="flex-row gap-3">
          <View className="flex-1"><EntradaPago placeholder="CVC/CVV" tipo="numero" value={cvc} onChange={(t) => setCvc(t.replace(/\D/g, "").slice(0, 4))} /></View>
          <View className="flex-1"><EntradaPago placeholder="MM/AA" value={vencimiento} onChange={(t) => setVencimiento(t.replace(/[^\d/]/g, "").slice(0, 5))} /></View>
        </View>
      </View>
      {error !== "" && <Texto accessibilityRole="alert" className="mt-3 text-[12px] text-error-600">{error}</Texto>}
      <Casilla>Guardar esta tarjeta de forma segura para mi compra posterior</Casilla>
      <BotonPago onPress={enviar}>{textoBoton}</BotonPago>
    </View>
  );
}
