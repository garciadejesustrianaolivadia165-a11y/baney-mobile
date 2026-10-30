# Estado del frontend móvil · visión general

Actualizado: 2026-10-30 (commit `9b847ea` de `caneyRD/baney-frontend-mobile`).

Leyenda: ✅ hecho · 🟡 parcial · ❌ pendiente.

## 1. Resumen en una mirada

| Área | Pantallas (sin API) | Integración con API | Pruebas |
|---|---|---|---|
| Auth Service (12 issues del tablero) | 11 ✅ · 1 ❌ (#4 Refresh token no tiene pantalla: es capa de API) | 0 / 12 ❌ | 0 / 12 ❌ |
| User Service (11 issues del tablero) | 11 ✅ | 0 / 11 ❌ | 0 / 11 ❌ |
| Transporte (prototipo Fase 1, sin issues aún) | ✅ onboarding, solicitud en 3 pasos, confirmación, mapa cliente/transportista, solicitudes cercanas, detalle de viaje, historial, alertas, flota, alta de camión, tracking | ❌ | ❌ |
| Mercado · cliente (Fase 2, sin issues aún) | ✅ marketplace, ficha, carrito, entrega y pago, tarjeta, confirmación, historial, detalle de pedido, notificaciones, perfil, pagos, configuración | ❌ | ❌ |
| Mercado · proveedor (Fase 2, sin issues aún) | ✅ inicio con guía, bandeja, pedidos, detalle, finanzas (5 vistas), productos, alta, stock, rutas, detalle de ruta, clientes, detalle, otros proveedores, perfil, pagos, configuración · ❌ Favoritos y Mis pedidos (marcadores) | ❌ | ❌ |
| Notification / Chat / Payment Service | 🟡 notificaciones y alertas con datos locales; pasarela de pago y PayPal solo visuales · ❌ chat no existe | ❌ | ❌ |

Cifras: 80 archivos de pantalla en `src/app/`, 2 marcadores restantes, 0 llamadas HTTP, 0 pruebas automatizadas.

## 2. Tablero caneyRD · Proyecto 1 (23 issues de frontend)

El tablero solo contiene el Período 1 (Auth + User Service): el cuaderno de Colab importó únicamente esos 23 casos (Paso 7). Los 395 casos restantes del Excel `BANEY_Cronograma_OFICIAL_2026-09-28.xlsx` (Transporte, Payment, Chat, Notification, Admin, Mercado…) no están en GitHub; para completarlos hay que correr el Paso 8 del cuaderno con `REPO_FRONTEND = "baney-frontend-mobile"`.

Cada issue tiene tres casillas (pantallas · integración · pruebas). **Ninguna está marcada todavía**; conviene ir marcando "Pantallas, estados y validaciones" en los que ya están hechos.

| Issue | Caso de uso | Pantalla | Dónde |
|---|---|---|---|
| #1 | Registro | ✅ | `(auth)/register.tsx` (valida campos, prellena el perfil) |
| #2 | Login | ✅ | `(auth)/login.tsx` (olvidé contraseña, intentos, dos pasos) |
| #3 | Logout | ✅ | "Cerrar Sección" en menú y Configuración → splash → login |
| #4 | Refresh token | ❌ | Sin pantalla: va en `src/lib/api.ts` (pendiente) |
| #5 | Forgot password | ✅ | `(auth)/olvide.tsx` |
| #6 | Reset password | ✅ | `(auth)/restablecer.tsx` (requisitos en vivo) |
| #7 | OTP | ✅ | `(auth)/codigo.tsx` (reset · correo · dos pasos) |
| #8 | Google OAuth | ✅ visual | `ui/google-button.tsx` (falta SDK) |
| #9 | Apple OAuth | ✅ visual | `ui/apple-button.tsx` (falta SDK) |
| #10 | Verificación de email | ✅ | `(auth)/verifica.tsx` |
| #11 | Bloqueo de cuenta | ✅ | `(auth)/bloqueada.tsx` + contador en login |
| #12 | Roles/permisos | ✅ | `rol.tsx`, `lib/sesion.ts`, menús por rol |
| #13 | Crear perfil | ✅ | `cuenta/completar.tsx` |
| #14 | Editar perfil | ✅ | `components/perfil/formulario-perfil.tsx` |
| #15 | Perfil Cliente | ✅ | `cliente/perfil.tsx`, `(app)/perfil.tsx` |
| #16 | Perfil Vendedor | ✅ | `dashboard/perfil.tsx` |
| #17 | Perfil Transportista | ✅ | `(app)/perfil.tsx`, `cuenta/empresa.tsx`, `camion/nuevo.tsx` |
| #18 | Perfil Empresa | ✅ | sección "empresa" del formulario |
| #19 | Gestionar documentos | ✅ | `cuenta/documentos.tsx` (imagen o PDF, estados) |
| #20 | Gestionar direcciones | ✅ | `cuenta/direcciones.tsx` + `cuenta/direccion.tsx`; chips en solicitud y en el checkout |
| #21 | Gestionar métodos de pago | ✅ | `movil/medios-pago.tsx` (gestión) |
| #22 | Gestionar preferencias | ✅ | `cuenta/configuracion.tsx` + `lib/preferencias.ts`, también para el proveedor |
| #23 | Eliminar cuenta | ✅ | `cuenta/eliminar.tsx` |

## 3. Lo que falta en frontend (sin contar la API)

Ordenado por lo que más se nota al usar la app:

1. **Favoritos del proveedor** (`dashboard/favoritos.tsx`): marcador "Favorites". El corazón del inicio y del marketplace solo cambia de color; falta un almacén `lib/favoritos.ts` y la lista.
2. **Mis pedidos del proveedor** (`dashboard/mis-pedidos.tsx`): marcador "MyOrders". Debe listar lo que el proveedor compra a otros (reutilizando el historial del cliente).
3. **Detalle de pedido del proveedor con datos reales** (`dashboard/bandeja/pedidos/[id].tsx`): muestra siempre "Lechuga importada" ×3 y "#12345678910" sin importar el pedido abierto; debe leer el pedido (`lib/clientes.ts` / `lib/rutas.ts`) como ya hace el detalle de ruta. `dashboard/rutas/index.tsx` muestra "WAYNE MANOR".
4. **Acciones de pedido sin efecto**: "Aceptar orden" / "Rechaza orden" (rutas), "Agregar Ítems" / "Cancelar orden" (detalle), "Cancelar" (pedido del cliente), aceptar/rechazar de la bandeja. Falta un almacén de estado del pedido para que cambien el chip y desaparezcan de "Nuevos pedidos".
5. **Catálogo de ejemplo repetido**: el marketplace son 16 copias de "Vegetales Variados" con la misma foto; la ficha y el home llevan "Lorem ipsum". Conviene un catálogo variado (nombres, fotos, precios, categorías) para la demo.
6. **Tracking del transporte** (`(app)/tracking.tsx`): solo mapa; falta la misma tarjeta de llegada y transportista que ahora tiene Rutas (reutilizar).
7. **PayPal**: "Ir a plataforma de pago" confirma directo; falta la pantalla intermedia simulada.
8. **Chat** (Chat Service, Período 5): no existe ninguna pantalla; el botón "Mensaje" abre los SMS.
9. **Pruebas de UI**: configurar `jest-expo` + `@testing-library/react-native` y una prueba por issue.

## 4. Lo que falta de API (para el final)

- `src/lib/api.ts`: base URL por `EXPO_PUBLIC_API_URL`, cabecera Bearer, refresh automático (#4), errores tipados; `expo-secure-store` para los tokens.
- Sustituir los almacenes en memoria de `src/lib/*.ts` manteniendo sus interfaces: sesión y perfil, preferencias, direcciones, documentos, pagos, flota, viajes, carrito, pedidos del cliente, mis productos, clientes, proveedores, rutas.
- SDKs de Google y Apple detrás de los botones; subida real de fotos y documentos.
- Estados de carga y error en cada pantalla conectada (ya existen `LoadingScreen` y timers simulados).

## 5. Hecho el 2026-10-30

- Auth: olvidé contraseña, código OTP compartido, restablecer, verificación de correo, intentos y cuenta bloqueada, botón de Apple.
- Cuenta: completar perfil, direcciones, documentos, eliminar cuenta, preferencias persistentes, configuración del proveedor.
- Checkout completo del cliente con carrito y pedidos en memoria; rutas `/checkout/*` redirigen.
- `ItemProducto`: la tarjeta verde única para todas las listas de productos.
- Detalle de ruta completo en teléfono (mapa de vista previa, llegada, transportista con llamar/mensaje, cliente, producto, acciones) y guía interactiva con foco real más el paso del menú.
