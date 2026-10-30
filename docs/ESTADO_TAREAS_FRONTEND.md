# Estado de las tareas de frontend (tablero caneyRD · Proyecto 1)

Fecha del análisis: 2026-10-30 · Commit analizado: `a3f58d8` de `caneyRD/baney-frontend-mobile`.

Fuente: los 23 issues con etiqueta `frontend` del repo `caneyRD/baney-frontend-mobile` (son los ítems de frontend del tablero https://github.com/orgs/caneyRD/projects/1). Todos pertenecen al hito **Período 1 · Semanas 1–4** (Sprints S01 y S02, 2026-09-21 → 2026-10-18), módulos **Auth Service** y **User Service**, y cada uno tiene las mismas tres subtareas:

1. Pantallas, estados y validaciones
2. Integración con las APIs del backend
3. Pruebas de UI / flujo

Leyenda: ✅ hecho · 🟡 parcial · ❌ no empezado.

## Resumen

| | Pantallas | Integración API | Pruebas |
|---|---|---|---|
| Auth Service (12 issues) | 4 ✅ · 3 🟡 · 5 ❌ | 0 / 12 | 0 / 12 |
| User Service (11 issues) | 7 ✅ · 2 🟡 · 2 ❌ | 0 / 11 | 0 / 11 |

- **Lo subido cubre la capa visual de 11 de los 23 casos de uso completos y otros 5 a medias.** Todo funciona con datos locales (`src/lib/*.ts`); no hay ningún `fetch`, cliente HTTP, token ni almacenamiento seguro todavía.
- **La integración con APIs está en 0 en los 23 issues**, incluidos los dos cerrados (#1 Registro y #2 Login), que siguen con sus tres casillas sin marcar.
- **No hay pruebas automatizadas** (ni Jest ni Detox). La verificación se hace con export web + capturas de Playwright, que no cuentan como "Pruebas de UI / flujo".
- En el tablero no existen todavía issues de frontend para los módulos de los Períodos 2–9 (Transporte, Payment, Chat, Notification, Admin…) ni de la Fase 2 (Mercado, Home/Cuenta), **aunque gran parte de esas pantallas ya está subida** (ver "Trabajo adelantado").

## Auth Service (Sprint S01)

| Issue | Caso de uso | Pantallas | Dónde está | Qué falta |
|---|---|---|---|---|
| #1 (cerrado) | Registro | ✅ | `src/app/(auth)/register.tsx` ("Crea tu cuenta": nombre, apellido, correo, cédula, teléfono, contraseña, botón Google) | Llamar al endpoint de registro, manejar errores del servidor, guardar token. Marcar las casillas del issue. |
| #2 (cerrado) | Login | ✅ | `src/app/(auth)/login.tsx` ("Inicio de Sección" con validación y mensaje "Error de Acceso") | Endpoint de login, guardar token/refresh en `expo-secure-store`, redirigir según rol real. |
| #3 | Logout | ✅ | "Cerrar Sección" en `components/dashboard/sidebar.tsx` y `cuenta/configuracion.tsx` → `cerrarSesion()` → splash verde → login | Invalidar el token en el backend y borrar el almacenamiento seguro. |
| #4 | Refresh token | ❌ | No existe cliente HTTP (`src/lib/api.ts`), ni interceptores, ni `expo-secure-store` | Crear el cliente HTTP con renovación automática del access token y cierre de sesión si el refresh caduca. No tiene pantalla propia. |
| #5 | Forgot password | ❌ | No hay enlace "¿Olvidaste tu contraseña?" en el login ni pantalla de solicitud | Pantalla `(auth)/olvide.tsx` (correo → envío de código/enlace) + endpoint. |
| #6 | Reset password | 🟡 | `cuenta/configuracion.tsx` permite cambiar contraseña (actual → nueva) con sesión iniciada | Pantalla de restablecer desde enlace/código sin sesión (`(auth)/restablecer.tsx`) + endpoint; conectar el cambio actual. |
| #7 | OTP | 🟡 | Solo el interruptor "Verificación en dos pasos" en `cuenta/configuracion.tsx` | Pantalla de ingreso del código de 6 dígitos (reutilizable para login, registro y reset), reenvío con temporizador + endpoints. |
| #8 | Google OAuth | 🟡 | `components/ui/google-button.tsx` en login y registro, solo visual | `expo-auth-session` / `@react-native-google-signin`, intercambio del id_token con el backend. |
| #9 | Apple OAuth | ❌ | Nada | Botón "Continuar con Apple" (`expo-apple-authentication`, solo iOS) + endpoint. |
| #10 | Verificación de email | ❌ | Nada | Pantalla "Revisa tu correo" tras el registro, estado "no verificado", reenviar correo, deep link `baney://verificar`. |
| #11 | Bloqueo de cuenta | ❌ | El login solo muestra un error genérico | Estado y pantalla "Cuenta bloqueada" (intentos agotados / bloqueo administrativo) con instrucciones de desbloqueo. |
| #12 | Roles/permisos | ✅ | `rol.tsx`, `busca.tsx`, `lib/sesion.ts` (`rol`, `destinoPorRol()`), menús por rol en `Sidebar` y Tabs de `(app)/_layout.tsx` | Leer el rol desde el token/perfil real y proteger rutas (redirigir si el rol no tiene acceso). |

## User Service (Sprint S02)

| Issue | Caso de uso | Pantallas | Dónde está | Qué falta |
|---|---|---|---|---|
| #13 | Crear perfil | 🟡 | El registro captura los datos básicos; el perfil arranca desde `PERFIL_INICIAL` en `lib/sesion.ts` | Paso "Completa tu perfil" tras registrarse (foto, provincia, país, datos por rol) + endpoint de creación. |
| #14 | Editar perfil | ✅ | `components/perfil/formulario-perfil.tsx` (un solo formulario reutilizado por `cuenta/datos.tsx`, `dashboard/perfil.tsx`, `cliente/perfil.tsx`), `actualizarPerfil()`, subida de foto con `ui/subir-foto.tsx` | Endpoint PUT de perfil y subida real de la foto. |
| #15 | Perfil Cliente | ✅ | `cliente/perfil.tsx` (cliente de mercado) y `(app)/perfil.tsx` (cliente de transporte) | Endpoint. |
| #16 | Perfil Vendedor | ✅ | `dashboard/perfil.tsx` con secciones usuario, empresa y pagos | Endpoint. |
| #17 | Perfil Transportista | ✅ | `(app)/perfil.tsx`, `cuenta/empresa.tsx` (flota + licencia), `camion/nuevo.tsx` (alta de vehículo, `lib/flota.ts`) | Endpoints de perfil, vehículos y licencia. |
| #18 | Perfil Empresa | ✅ | Sección "empresa" del formulario (nombre, correo corporativo, teléfono, dirección, RNC, dueño) en `cuenta/empresa.tsx` y `dashboard/perfil.tsx`; interruptor "¿Perteneces a una empresa?" | Endpoint y validación de RNC. |
| #19 | Gestionar documentos | 🟡 | Licencia (número, categoría, vencimiento) y seguro/mantenimiento del camión como campos de texto | Subida de archivos (cédula, licencia, seguro, RNC) con `expo-document-picker`, lista de documentos con estado (pendiente / aprobado / rechazado) + endpoints. |
| #20 | Gestionar direcciones | ❌ | Solo "Provincia" y "Dirección del negocio" como campos sueltos | Pantalla "Mis direcciones" (lista, agregar/editar/eliminar, predeterminada, selección en mapa) y su uso en checkout y solicitud de transporte. |
| #21 | Gestionar métodos de pago | ✅ | `components/movil/medios-pago.tsx` modo `gestion` en `/cuenta/pagos`, `/cliente/pagos` y `/dashboard/pagos`; alta de tarjeta y PayPal; `lib/pagos.ts`; botón "Agregar nuevo método de pago" | Endpoint (tokenización con el Payment Service, Período 5). |
| #22 | Gestionar preferencias | ✅ | `cuenta/configuracion.tsx` (`ConfiguracionContenido`: push, correo, ofertas, ubicación, dos pasos, cambio de contraseña) reutilizado en `cliente/configuracion.tsx` | `dashboard/configuracion.tsx` del proveedor sigue siendo el marcador "Settings": debe usar `ConfiguracionContenido`. Endpoint de preferencias. |
| #23 | Eliminar cuenta | ❌ | Nada | Opción "Eliminar mi cuenta" en Configuración con confirmación (contraseña u OTP), pantalla de despedida y endpoint. |

## Pendiente transversal (afecta a los 23 issues)

1. **Capa de API**: `src/lib/api.ts` (base URL por `EXPO_PUBLIC_API_URL`, cabecera Bearer, refresh automático, errores tipados) y `expo-secure-store` para los tokens. Sustituir los almacenes de `src/lib/*.ts` manteniendo sus interfaces (`Perfil`, `Product`, `MetodoPago`, `Camion`…).
2. **Estados de carga y error** en cada pantalla conectada (ya existen patrones: `LoadingScreen`, timers de carga simulada).
3. **Pruebas**: configurar `jest-expo` + `@testing-library/react-native` y escribir una prueba de flujo por issue (login válido/inválido, registro, logout, edición de perfil, alta de método de pago…).
4. **Casillas de los issues**: ninguna está marcada; hay que ir cerrando subtareas conforme se integre cada caso.

## Orden sugerido para lo que falta

1. `src/lib/api.ts` + secure store + refresh token (#4): desbloquea la integración de todo lo demás.
2. Integrar Login, Registro, Logout y roles (#1, #2, #3, #12) contra el Auth Service.
3. Pantallas de recuperación: Forgot/Reset password, OTP, verificación de email, cuenta bloqueada (#5, #6, #7, #10, #11), que comparten la pantalla de código.
4. OAuth Google y Apple (#8, #9).
5. Integrar perfil y empresa (#13–#18) y métodos de pago (#21), preferencias (#22) contra el User Service.
6. Pantallas nuevas de User Service: documentos (#19), direcciones (#20), eliminar cuenta (#23).
7. Pruebas de UI por issue.

## Trabajo adelantado sin issue en el tablero

Estas pantallas ya están subidas aunque sus módulos empiezan en períodos posteriores; conviene crear sus issues de frontend para que el tablero refleje el avance:

- **Transporte (Períodos 2–4, 7–8)**: onboarding, solicitud de transporte en 3 pasos con programación, confirmación, flota y alta de camión, mapa de cliente y de transportista con panel desplegable, solicitudes cercanas, detalle de viaje (`/viaje/[id]`), historial, alertas, tracking.
- **Notification Service (Período 5)**: `cliente/notificaciones.tsx`, `(app)/alertas.tsx`.
- **Payment Service (Período 5)**: pasarela `medios-pago.tsx`, checkout (carrito, método de pago, agregar tarjeta, confirmación: marcadores como en la web).
- **Home / Cuenta y Mercado (Fase 2, Períodos 10–12)**: home con sesión, marketplace y ficha de producto como área del cliente, dashboard completo del proveedor (bandeja, pedidos, finanzas con gráficos, productos y stock, rutas, clientes, proveedores).
