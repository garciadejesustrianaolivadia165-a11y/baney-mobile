import { useState } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

type InputFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** "password" oculta el texto; "email" ajusta teclado y autocompletado. */
  type?: "text" | "password" | "email" | "number";
  className?: string;
} & Pick<TextInputProps, "autoCapitalize" | "returnKeyType" | "onSubmitEditing">;

// Port de components/ui/input.tsx: etiqueta + campo con fondo neutral-100 y
// anillo primary-400 al enfocar (error-400 si hay error).
export default function InputField({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  className = "",
  ...rest
}: InputFieldProps) {
  const [enfocado, setEnfocado] = useState(false);
  const anillo = error ? "border-error-400" : enfocado ? "border-primary-400" : "border-transparent";

  return (
    <View className={className}>
      <Text className="mb-1.5 font-sans text-sm font-medium text-neutral-800">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#a2a79e"
        secureTextEntry={type === "password"}
        keyboardType={type === "email" ? "email-address" : type === "number" ? "numeric" : "default"}
        autoCapitalize={type === "email" ? "none" : rest.autoCapitalize}
        autoComplete={type === "email" ? "email" : type === "password" ? "password" : undefined}
        onFocus={() => setEnfocado(true)}
        onBlur={() => setEnfocado(false)}
        className={`w-full rounded-xl border-2 bg-neutral-100 px-4 py-2.5 font-sans text-sm font-medium text-neutral-900 ${anillo}`}
        {...rest}
      />
      {error ? <Text className="mt-1 font-sans text-sm text-error-600">{error}</Text> : null}
    </View>
  );
}
