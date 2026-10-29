import { useState, type ReactNode } from "react";
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

type Props = Omit<PressableProps, "style" | "children" | "className"> & {
  /** Estilo en función del estado pulsado (NativeWind descarta las funciones `style` del Pressable) */
  estilo?: (pressed: boolean) => StyleProp<ViewStyle>;
  className?: string | ((pressed: boolean) => string);
  children?: ReactNode | ((pressed: boolean) => ReactNode);
};

// Pressable que lleva el estado `pressed` en React en vez de en la función `style`:
// NativeWind (web y nativo) ignora `style={({pressed}) => ...}` cuando hay className.
export default function Presionable({ estilo, className, children, onPressIn, onPressOut, ...rest }: Props) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      {...rest}
      onPressIn={(e) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        onPressOut?.(e);
      }}
      style={estilo?.(pressed)}
      className={typeof className === "function" ? className(pressed) : className}
    >
      {typeof children === "function" ? children(pressed) : children}
    </Pressable>
  );
}
