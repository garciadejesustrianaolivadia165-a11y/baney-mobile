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
| `{{logo_url}}` | URL pública del logotipo blanco, p. ej. `https://srv2122223.hstgr.cloud/static/baney_white.png` (`assets/images/image_mobile/baney_white.png`) |

Enviar siempre con `text/html` y, como alternativa `text/plain`, el mismo texto sin etiquetas.
Remitente: `BANEY RD <noreply@baneydo.com>`.
