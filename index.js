// Punto de entrada de la app. El orden importa: primero se instala la captura
// global de errores (si un módulo falla al cargar, el APK mostraría "BANEY keeps
// stopping" sin ningún mensaje) y después arranca Expo Router.
import "./src/lib/errores";
import "expo-router/entry";
