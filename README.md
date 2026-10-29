# BANEY RD · app móvil (React Native + Expo)

Migración del frontend web de BANEY (`Fronted_CANEY-RD`, React Router + Tailwind) a
React Native con **Expo SDK 58**, **Expo Router** y **NativeWind v4**. Un solo código
para Android, iOS y web.

## Comandos

```bash
npm install
npm start            # dev server (Expo Go: escanea el QR)
npm run tunnel       # igual, con túnel (necesario desde Codespaces / sesiones en la nube)
npm run web          # abre la versión web
npm run typecheck    # tsc --noEmit
npm run doctor       # expo-doctor
npm run export:web   # build estático web (dist/)
```

Compilar APK/IPA en la nube, sin Android Studio ni Xcode:

```bash
npx eas-cli@latest build -p android --profile preview
```

## Ver la app en el teléfono (sin instalar nada en tu PC)

1. Instala **Expo Go** en el teléfono (Play Store / App Store).
2. En GitHub abre este repo → botón **Code** → pestaña **Codespaces** → **Create codespace on main**. Espera a que termine `npm install` (1-2 min).
3. En la terminal del Codespace ejecuta `npm run tunnel`.
4. Cuando aparezca el QR, en Expo Go toca **Scan QR** (o copia la URL `exp://...` de la terminal y usa **Enter URL**).
5. Cada cambio guardado en el Codespace se recarga solo en el teléfono.

El script usa `--tunnel ngrok` porque el túnel firmado por defecto del SDK 58 exige iniciar sesión en Expo. El túnel hace falta porque el teléfono y el Codespace no están en la misma red. El paquete `@expo/ngrok` ya está en las devDependencies para que no pida instalarlo.

## Estructura

- `src/app/` — pantallas (Expo Router, rutas por archivo; `_layout.tsx` define navegadores): splash y prototipo móvil en la raíz y `(app)/`, auth en `(auth)/`, `home`, `landing`, `marketplace/`, `checkout/` y `dashboard/`
- `src/components/` — componentes reutilizables: `ui/` primitivas, `movil/` prototipo, `dashboard/` (sidebar, gráficos, tablas, formularios), navbar, footer, carruseles, mapa
- `src/lib/` — datos de ejemplo, fuentes y registro de imágenes (`imagenes.ts`, generado)
- `src/types/` — interfaces compartidas con la web (`Product`)
- `assets/` — mismos archivos que `public/` en la web (`images/`, `icons/`, `logos/`)
- `docs/PLAN_MIGRACION_REACT_NATIVE.md` — plan y estado de la migración

Ver `CLAUDE.md` para las convenciones de diseño y la equivalencia web → nativo.
