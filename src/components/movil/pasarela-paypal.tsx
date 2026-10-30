import { useState } from "react";
import { Modal, Pressable, View } from "react-native";

import { EntradaPago, LogoPayPal } from "@/components/movil/pago";
import BotonPill from "@/components/movil/boton-pill";
import Texto from "@/components/ui/texto";
import { SOMBRA } from "@/lib/estilos";

/**
 * Pantalla intermedia de PayPal (simulada): inicio de sesión y confirmación del
 * cargo. Cuando exista el SDK real, esta ventana se sustituye por el navegador de PayPal.
 */
export default function PasarelaPayPal({ visible, total, comercio = "BANEY RD", onAprobar, onCancelar }: { visible: boolean; total: string; comercio?: string; onAprobar: () => void; onCancelar: () => void }) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [paso, setPaso] = useState<"acceso" | "confirmar" | "procesando">("acceso");
  const [error, setError] = useState("");

  function entrar() {
    if (!/^\S+@\S+\.\S+$/.test(correo) || clave.length < 4) {
      setError("Revisa tu correo y tu contraseña de PayPal.");
      return;
    }
    setError("");
    setPaso("confirmar");
  }

  function pagar() {
    setPaso("procesando");
    setTimeout(() => {
      setPaso("acceso");
      setCorreo("");
      setClave("");
      onAprobar();
    }, 1200);
  }

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onCancelar}>
      <View className="flex-1 justify-end bg-black/50">
        <View style={SOMBRA.alta} className="rounded-t-[28px] bg-white px-6 pb-8 pt-5">
          <View className="mx-auto mb-4 h-[5px] w-12 rounded-full bg-[#E3E6E0]" />
          <View className="flex-row items-center justify-between">
            <LogoPayPal size={24} />
            <Pressable accessibilityRole="button" onPress={onCancelar} className="rounded-full bg-neutral-100 px-3 py-1.5 active:bg-neutral-200">
              <Texto className="text-[12px] font-semibold text-neutral-600">Cancelar</Texto>
            </Pressable>
          </View>
          <View className="mt-4 rounded-2xl bg-[#F5F7FA] px-4 py-3">
            <Texto className="text-[12px] text-neutral-500">Pagar a {comercio}</Texto>
            <Texto className="text-[22px] font-bold text-[#003087]">{total}</Texto>
          </View>

          {paso === "acceso" && (
            <View className="mt-5 gap-3">
              <Texto className="text-[15px] font-bold text-[#16202E]">Inicia sesión en PayPal</Texto>
              <EntradaPago placeholder="Correo electrónico o número de móvil" tipo="email" value={correo} onChange={setCorreo} />
              <EntradaPago placeholder="Contraseña" value={clave} onChange={setClave} secreto />
              {error !== "" && <Texto accessibilityRole="alert" className="text-[12px] text-error-600">{error}</Texto>}
              <BotonPill color="#0070BA" onPress={entrar} className="mt-1 w-full py-3.5" textClassName="text-[15px]">
                Iniciar sesión
              </BotonPill>
              <Texto className="text-center text-[11px] text-neutral-400">Simulación: cualquier correo válido y una contraseña de 4+ caracteres.</Texto>
            </View>
          )}

          {paso === "confirmar" && (
            <View className="mt-5 gap-3">
              <Texto className="text-[15px] font-bold text-[#16202E]">Confirma tu pago</Texto>
              <View className="rounded-2xl border border-[#E3E6E0] px-4 py-3">
                <Texto className="text-[13px] text-neutral-500">Cuenta</Texto>
                <Texto className="text-[14px] font-semibold text-[#16202E]">{correo}</Texto>
                <Texto className="mt-2 text-[13px] text-neutral-500">Método</Texto>
                <Texto className="text-[14px] font-semibold text-[#16202E]">Saldo de PayPal</Texto>
              </View>
              <BotonPill color="#FFC439" textoColor="#003087" onPress={pagar} className="w-full py-3.5" textClassName="text-[15px]">
                {`Pagar ${total}`}
              </BotonPill>
              <Pressable accessibilityRole="button" onPress={() => setPaso("acceso")} className="self-center py-1">
                <Texto className="text-[13px] font-semibold text-[#0070BA]">Usar otra cuenta</Texto>
              </Pressable>
            </View>
          )}

          {paso === "procesando" && (
            <View className="mt-8 items-center gap-3 pb-4">
              <View className="h-10 w-10 rounded-full border-4 border-[#0070BA] border-t-transparent" />
              <Texto className="text-[14px] font-semibold text-[#16202E]">Procesando tu pago…</Texto>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
