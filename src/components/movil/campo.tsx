import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import Icono, { ICONOS } from "@/components/ui/icono";
import Texto from "@/components/ui/texto";

// Campo del login/registro del prototipo: etiqueta, ícono y ojo para la contraseña
export default function Campo({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: "text" | "email" | "password" | "tel";
  value?: string;
  onChange?: (v: string) => void;
}) {
  const [verClave, setVerClave] = useState(false);
  const esClave = type === "password";
  const icono = type === "email" ? ICONOS.correo : esClave ? ICONOS.clave : ICONOS.perfil;

  return (
    <View>
      <Texto className="mb-1.5 text-[13px] font-semibold text-[#2B3620]">{label}</Texto>
      <View className="flex-row items-center gap-2.5 rounded-2xl bg-[#F1F4F2] px-4 py-3">
        <Icono d={icono} size={18} color="#8C9A8B" strokeWidth={1.5} />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#9AA69C"
          secureTextEntry={esClave && !verClave}
          keyboardType={type === "email" ? "email-address" : type === "tel" ? "phone-pad" : "default"}
          autoCapitalize={type === "email" || esClave ? "none" : "words"}
          className="flex-1 font-inter text-sm text-neutral-800"
          style={{ paddingVertical: 0 }}
        />
        {esClave && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={verClave ? "Ocultar contraseña" : "Mostrar contraseña"}
            onPress={() => setVerClave((v) => !v)}
            hitSlop={8}
          >
            <Icono
              d={verClave ? [ICONOS.ojo] : [ICONOS.ojo, "M4 20L20 4"]}
              circulos={[[12, 12, 3]]}
              size={18}
              color="#8C9A8B"
              strokeWidth={1.5}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
