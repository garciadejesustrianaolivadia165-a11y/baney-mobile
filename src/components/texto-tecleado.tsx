import { useEffect, useRef, useState } from "react";
import { Animated, Text, type TextProps } from "react-native";

/**
 * Escribe el texto carácter a carácter al montarse, con un cursor parpadeante
 * en el verde de la paleta. Se usa dentro de un <Texto>/<Text> padre que fija la fuente.
 */
export default function TextoTecleado({
  texto,
  velocidad = 38,
  retraso = 250,
  ...rest
}: { texto: string; velocidad?: number; retraso?: number } & TextProps) {
  const [escritos, setEscritos] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const parpadeo = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setEscritos(0);
    setTerminado(false);
    let intervalo: ReturnType<typeof setInterval> | undefined;
    const inicio = setTimeout(() => {
      intervalo = setInterval(() => {
        setEscritos((n) => {
          if (n >= texto.length) {
            clearInterval(intervalo);
            setTerminado(true);
            return n;
          }
          return n + 1;
        });
      }, velocidad);
    }, retraso);
    return () => {
      clearTimeout(inicio);
      clearInterval(intervalo);
    };
  }, [texto, velocidad, retraso]);

  useEffect(() => {
    if (!terminado) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(parpadeo, { toValue: 0, duration: 0, delay: 550, useNativeDriver: true }),
        Animated.timing(parpadeo, { toValue: 1, duration: 0, delay: 550, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [terminado, parpadeo]);

  return (
    <Text {...rest} accessibilityLabel={texto}>
      {texto.slice(0, escritos)}
      <Animated.Text style={{ opacity: parpadeo, color: "#364a2d" }}>▏</Animated.Text>
    </Text>
  );
}
