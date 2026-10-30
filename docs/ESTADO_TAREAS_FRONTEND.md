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
| Mercado · proveedor (Fase 2, sin issues aún) | ✅ inicio con guía, bandeja, pedidos con estado, detalle con acciones, finanzas (5 vistas), productos, alta, stock, rutas, detalle de ruta, clientes, detalle, otros proveedores, favoritos, perfil, pagos, configuración | ❌ | ❌ |
| Notification / Chat / Payment Service | ✅ notificaciones y alertas, pasarela de tarjeta y PayPal simulado, chat con lista y conversación (todo con datos locales) | ❌ | ❌ |

Cifras: 83 archivos de pantalla en `src/app/`, 0 marcadores, 0 llamadas HTTP, 16 pruebas automatizadas.

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

Todo lo listado aquí el 2026-10-30 por la mañana quedó resuelto el mismo día (ver sección 5), salvo lo que se descartó:

- ~~Favoritos del proveedor~~ ✅ `dashboard/favoritos.tsx` + `cliente/favoritos.tsx` con `lib/favoritos.ts`.
- ~~Mis pedidos del proveedor~~ ❌ descartado: el proveedor no compra; la pantalla se eliminó.
- ~~Detalle de pedido con datos reales~~ ✅ `lib/pedidos-proveedor.ts`; bandeja, detalle y rutas leen el pedido abierto.
- ~~Acciones de pedido sin efecto~~ ✅ aceptar, rechazar, cancelar, marcar entregado, agregar/quitar ítems y cancelar del cliente cambian el estado en todas las pantallas.
- ~~Catálogo repetido y Lorem~~ ✅ 16 productos reales con descripción y unidad; home y ficha con textos reales.
- ~~Tracking solo mapa~~ ✅ tarjetas de llegada y transportista compartidas con Rutas; `/tracking` pasó a ruta suelta.
- ~~PayPal sin pantalla intermedia~~ ✅ `pasarela-paypal.tsx` (acceso, confirmación, procesando).
- ~~Chat~~ ✅ `/chat` y `/chat/[id]` con respuesta simulada, enlazado desde "Mensaje" y el menú.
- ~~Pruebas de UI~~ ✅ 16 pruebas (`npm test`) de almacenes, login, OTP y requisitos de contraseña; corren en CI.

Pendiente menor de frontend: afinar pixel a pixel contra el Figma en dispositivo y sustituir las fotos de producto repetidas cuando se exporten más del Figma.

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
- Pedidos del proveedor con estado real y acciones; favoritos del cliente y del proveedor; catálogo real sin Lorem; tracking con tarjetas compartidas; PayPal simulado; chat; 16 pruebas automatizadas en CI.
- Detalle de ruta completo en teléfono (mapa de vista previa, llegada, transportista con llamar/mensaje, cliente, producto, acciones) y guía interactiva con foco real más el paso del menú.
