# APK Android independiente

La compilación usa GitHub Actions, Expo Prebuild (generación local del proyecto
nativo) y Gradle. No usa Expo Go, EAS Build ni EAS Update. Mantiene los módulos
Expo que utiliza la aplicación. Identificador oficial: `do.baney.app`.
El namespace Java/Kotlin generado es `com.baneyrd.app`, porque `do` es una
palabra reservada de Java. El config plugin establece el applicationId instalado
en `do.baney.app`; el workflow verifica ese valor en la APK final. El aviso de
actualización usa `extra.androidApplicationId`, no el namespace interno.

## Firma y configuración

Guardar en GitHub Actions secrets, nunca en el repositorio:

- `ANDROID_KEYSTORE_BASE64`: keystore permanente codificado en base64.
- `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
- `GOOGLE_MAPS_KEY_APP`: clave Android, restringida a `do.baney.app` y al SHA-1
  del certificado nuevo. La huella usada por una APK anterior no se conserva.

Variable `ANDROID_SIGNER_SHA256`: huella SHA-256 del certificado esperado.
Mantener copia privada del keystore y contraseñas. Perderlos impide actualizar
las instalaciones existentes con la misma identidad.

El workflow usa las APIs HTTPS de Usuarios y Transporte en Hostinger. Ninguna
contraseña de BD, secreto JWT, SMTP ni secreto OAuth debe incluirse en la APK.
Esto no convierte los módulos locales/simulados en integraciones reales.

## Compilar

`Build signed Android APK (no EAS)` corre al hacer push a main o manualmente.
Ejecuta pruebas y genera el proyecto Android; Gradle compila y firma. Se verifica
la firma, paquete y versionCode antes de entregar un artifact de GitHub.
El artifact contiene APK con nombre versionado, `latest.json` y `SHA256SUMS`.
La APK incluye ARM64 y ARM de 32 bits para teléfonos, y x86_64 para probar el
mismo archivo en emuladores sin depender de la traducción de bibliotecas ARM.
Los artifacts marcados `unverified-apk-do-not-publish` son solo de diagnóstico y
no deben distribuirse: no superaron todas las verificaciones de publicación.
No publica en Hostinger ni reinicia servicios. Los artifacts caducan a los 30 días.

Después de compilar, el workflow instala la APK en emuladores Google APIs
Android 15 y 16 con x86_64, recoge logcat, captura y jerarquía de UI,
y comprueba que el proceso siga activo. Revisar también las capturas: un proceso
activo no demuestra por sí solo que se haya mostrado una pantalla funcional.

La APK 100501 reproducía un cierre antes de React en WorkManager: Room 2.5.0
no preservaba explícitamente los constructores usados por reflexión con R8.
`config/android-proguard-rules.pro` conserva esos constructores y el plugin los
incorpora al proyecto generado. No desactivar la optimización ni eliminar
WorkManager para ocultar este fallo. La APK 100501 no debe publicarse.

La versión interna es `100000 + run_number * 100 + run_attempt`. No renombrar ni
recrear el workflow reseteando su secuencia sin revisar la versión ya publicada.
Mantener menos de 100 intentos por ejecución; incrementar `expo.version` para
cambios de versión visibles. Una nueva APK requiere instalación confirmada por
Android. Un backend compatible se actualiza sin reinstalar la APK.

## Publicación en Hostinger (con autorización para cada versión)

Primera versión publicada: **1.0.0 / 100901**. Pasó arranque, dos reaperturas y
navegación al formulario de acceso en emuladores Android 15 y 16.

- Enlace estable: https://srv2122223.hstgr.cloud/downloads/android/baney.apk
- Archivo versionado: https://srv2122223.hstgr.cloud/downloads/android/baney-100901.apk
- Manifiesto: https://srv2122223.hstgr.cloud/downloads/android/latest.json
- Configuración del servicio: `/opt/baney/production/android-downloads/compose.json`.
- Archivos públicos: `/opt/baney/downloads/android/`.

El servicio de descargas está separado de las APIs. Reemplazar una APK aprobada
y su manifiesto no requiere reiniciar las APIs ni la base de datos. Cada nueva
publicación necesita autorización explícita; un push solo compila y prueba.

Preparar un directorio persistente de descargas, servido por HTTPS bajo
`/downloads/android/`. Debe tener prioridad sobre el frontend SPA, no listar
directorios y servir APK como `application/vnd.android.package-archive`.
`latest.json` debe responder con `Cache-Control: no-store`; no puede devolver
index.html del frontend. La ruta ya está activa. No se publica automáticamente
al compilar.

Después de obtener autorización para la publicación concreta:

1. Descargar el artifact de la ejecución aprobada y verificar SHA256SUMS y firma.
2. Copiar primero la APK versionada al directorio persistente. No borrar versiones
   anteriores durante la publicación.
3. Comprobar HTTPS y el hash del archivo descargado desde fuera del VPS.
4. Reemplazar `latest.json` atómicamente, solo si el versionCode es superior al
   publicado y el paquete/firma son correctos. No anunciar un archivo incompleto.
5. Probar desde un teléfono e instalar sobre una versión anterior conservando sesión.

El aviso móvil consulta ese JSON al abrir y al volver al primer plano (máximo cada
6 horas por proceso), sin enviar tokens. Solo acepta APK HTTPS del mismo dominio,
del directorio de descargas, para el mismo paquete y con una versión superior.
El botón abre la descarga en el navegador: no instala silenciosamente. Android
comprueba la firma al instalar. Un error de red o una ruta aún no publicada no
bloquea el uso de la aplicación.

## Validación pendiente en teléfono

Login real, persistencia/renovación de sesión, mapa y ubicación, creación de
solicitud y confirmación del viaje. La rama contiene flujos locales y conexiones
parciales: compilar satisfactoriamente no demuestra que esas funciones estén listas.
No presentar esta APK como integración completa hasta completar esas pruebas.
