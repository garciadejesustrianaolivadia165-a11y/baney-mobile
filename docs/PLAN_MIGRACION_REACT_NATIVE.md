# Plan de migración BANEY RD: React (web) → React Native

Fuente actual: `garciadejesustrianaolivadia165-a11y/Fronted_CANEY-RD` (React Router v8 SSR, React 19, TS, Tailwind v4, 54 archivos .tsx, ~11.300 líneas).
Repo oficial: `caneyRD/baney-frontend` (hoy solo tiene un README).

## Stack destino (recomendado)

| Web actual | React Native (Expo) |
|---|---|
| React Router v8 (framework, SSR) | Expo SDK 54 + **Expo Router** (rutas por archivos en `app/`) |
| Tailwind CSS v4 (`@theme` en app.css) | **NativeWind v4** + `tailwind.config.js` con la misma paleta |
| Google Fonts por `<link>` | `@expo-google-fonts/poppins` + `@expo-google-fonts/inter` |
| `<img src="/images/...">` | `expo-image` con `require("@/assets/images/...")` |
| SVG dibujados a mano (gráficos) | `react-native-svg` (misma API: circle, polygon, polyline) |
| Carruseles con translateX + setTimeout | `FlatList` horizontal / `react-native-reanimated` |
| `hover:` / `active:` | `Pressable` (estado `pressed`); no hay hover en móvil |
| `Link`, `useNavigate`, `useParams` | `Link`, `useRouter`, `useLocalSearchParams` de expo-router |

Expo compila iOS, Android **y web** desde el mismo código: cumple la regla de "no duplicar web y móvil" del CLAUDE.md.

## Fases

### Fase 0 · Repo nuevo (lo haces tú en github.com, 2 minutos)
1. github.com → "+" → New repository → nombre sugerido `baney-mobile` (o `Baney_RD-ReactNative`), privado, **sin** README ni .gitignore.
2. Pégame la URL en el chat. Yo lo adjunto a la sesión, hago el scaffold y subo todo. No necesitas nada local.

### Fase 1 · Scaffold y base (yo, en esta sesión)
- `create-expo-app` con plantilla TypeScript + Expo Router.
- NativeWind v4 + Tailwind 3.4 (NativeWind aún no soporta Tailwind v4): portar los tokens `@theme` de `app/app.css` a `tailwind.config.js` (`primary`, `secondary`, `secondary2..4`, `success`, `warning`, `error`, `dark`, `neutral`, `caney-dark`, `caney-sky`).
- Fuentes Poppins e Inter con `expo-font`.
- Copiar `public/` → `assets/` (55 PNG, 4 JPG, 3 SVG) y `app/types`, `app/lib` (datos de ejemplo, TS puro, sin cambios).
- Carpeta `docs/` con este plan y un `CLAUDE.md` adaptado a Expo.
- Primer commit + push al repo nuevo. GitHub Actions con `tsc --noEmit` en cada push.

### Fase 2 · Primitivas UI (`components/ui/`)
`Button` (primary/outline/soft con efecto pressed invertido), `Input`, `GoogleButton`, `SubirFoto` (expo-image-picker), `LoadingScreen`, `ProductCard`, `Navbar`→ cabecera nativa, `Footer` (solo web), `SearchBar`, carruseles.

### Fase 3 · Pantallas, en este orden
1. **Prototipo móvil** (`routes/mobile.tsx`, 2.554 líneas, máquina de estados con 12 vistas: carga, onboarding, rol, busca, auth, mapa, solicitud, confirmada, tracking, historial, alertas, dashT). Es la app nativa de la Fase 1 ya diseñada para teléfono: se parte en una pantalla por archivo bajo `app/(mobile)/`. El mapa pasa a `react-native-maps`.
2. **Auth**: `app/(auth)/login.tsx`, `register.tsx`.
3. **Home / Landing**: `app/index.tsx`, `app/landing.tsx`.
4. **Marketplace**: `app/marketplace/index.tsx`, `app/marketplace/producto/[id].tsx`.
5. **Checkout**: carrito, método de pago, agregar tarjeta, confirmación.
6. **Dashboard** (`app/(dashboard)/_layout.tsx` con Drawer = el Sidebar actual): overview, bandeja, finanzas (gráficos en react-native-svg), productos, clientes, rutas, perfil, configuración.

Patrón por archivo: `div`→`View`, texto→`Text` (obligatorio), `img`→`Image`, `button`→`Pressable`, `input`→`TextInput`, `className` se mantiene gracias a NativeWind; quitar `loader`/SSR y meter la carga en `useEffect`.

### Fase 4 · Verificación 100 % online
- **Expo Go** en tu teléfono: desde esta sesión o un Codespace, `npx expo start --tunnel` muestra un QR; lo escaneas y ves la app en vivo.
- **APK/IPA en la nube**: `eas build -p android --profile preview` (EAS Build, gratis con límites) te da un enlace para instalar el APK sin Android Studio.
- **Web**: `npx expo export -p web` publicable en GitHub Pages/Vercel para revisar en navegador.

### Fase 5 · Subir al repo oficial
Cuando el repo nuevo esté estable: `git remote add official https://github.com/caneyRD/<repo>.git && git push official main`. Decidir antes si va a `caneyRD/baney-frontend` (hoy vacío) o a un `caneyRD/baney-mobile` nuevo.

## Riesgos / decisiones
- `hover:scale-105` y sombras CSS no existen igual en nativo: se traducen a `pressed` + `elevation`/`shadow*`.
- SSR desaparece (no aplica en apps); el `typecheck` pasa a ser `tsc --noEmit` + `expo-doctor`.
- Node ≥ 20 basta para Expo; la sesión tiene Node 22.
