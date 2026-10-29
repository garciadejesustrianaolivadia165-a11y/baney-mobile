import { Text, type TextProps } from "react-native";

type Props = TextProps & { className?: string };

// Todo texto del prototipo va en Inter (el marco del teléfono tenía `font-inter`);
// si la clase trae `font-sans` (Poppins) se respeta esa.
export default function Texto({ className = "", ...props }: Props) {
  const base = /\bfont-(sans|inter)\b/.test(className) ? "" : "font-inter";
  return <Text className={`${base} ${className}`} {...props} />;
}
