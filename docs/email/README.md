# Plantillas de correo (SMTP del servicio de usuarios)

`confirmar-correo.html` es la plantilla de "Confirma tu correo" con la identidad BANEY
(fondo `#2e320e`, verde `#415936`, Poppins). Es HTML de correo clásico: tablas y CSS en
línea, compatible con Gmail, Outlook y Apple Mail.

Variables a sustituir en el backend:

| Variable       | Contenido                                                   |
|----------------|-------------------------------------------------------------|
| `{{nombre}}`   | Nombre del usuario (o "bienvenido/a" si no se conoce)       |
| `{{enlace}}`   | URL de confirmación con el token                            |
| `{{codigo}}`   | Código OTP de 6 dígitos (si el flujo no lo usa, borrar ese bloque) |
| `{{logo_url}}` | URL pública de `docs/email/logo-baney.png` (logotipo original: hoja + BANEY), p. ej. `https://srv2122223.hstgr.cloud/static/logo-baney.png`. Los correos no admiten imágenes incrustadas en base64 en Gmail, así que debe estar alojado. |

Enviar siempre con `text/html` y, como alternativa `text/plain`, el mismo texto sin etiquetas.
Remitente: `BANEY RD <noreply@baneydo.com>`.

Tipografía: la plantilla carga Poppins desde Google Fonts (`<link>` + `@font-face`). Apple Mail,
iOS Mail, Thunderbird y Outlook para Mac la muestran; Gmail y Outlook de Windows no cargan
fuentes externas y usan Segoe UI/Arial como respaldo. Es una limitación de esos clientes, no
de la plantilla. El botón tiene hover (fondo más oscuro, sombra y elevación) en los clientes
que admiten `:hover`.
