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

## Estructura

- `src/app/` — pantallas (Expo Router, rutas por archivo; `_layout.tsx` define navegadores)
- `src/components/` — componentes reutilizables; `ui/` primitivas (button, input, google-button)
- `src/lib/` — datos de ejemplo, fuentes y registro de imágenes (`imagenes.ts`, generado)
- `src/types/` — interfaces compartidas con la web (`Product`)
- `assets/` — mismos archivos que `public/` en la web (`images/`, `icons/`, `logos/`)
- `docs/PLAN_MIGRACION_REACT_NATIVE.md` — plan y estado de la migración

Ver `CLAUDE.md` para las convenciones de diseño y la equivalencia web → nativo.
