# CLAUDE.md

Guía para Claude Code en este repositorio.

## Proyecto

BANEY_RD (marca "BANEY"; el diseño Figma usa el nombre antiguo "CANEY" — en el código y la UI siempre se escribe BANEY) — **app móvil** del marketplace agropecuario y de logística de República Dominicana. Es la migración a React Native del frontend web `garciadejesustrianaolivadia165-a11y/Fronted_CANEY-RD` (React Router v8 + Tailwind v4), que sigue siendo la referencia funcional y visual junto con el Figma: https://www.figma.com/design/WPvFMZrfTAAe81yXKnWdLu/UI-UX-CANEY-RD

Stack: **Expo SDK 58**, React Native 0.88, React 19, TypeScript, **Expo Router** (rutas por archivo en `src/app/`), **NativeWind v4** (Tailwind 3.4, `className` en componentes nativos), `expo-image`, `react-native-svg`, `react-native-reanimated`. Un solo código para Android, iOS y web. Toda la UI y sus textos van en español con tildes correctas; el código mezcla inglés en rutas/archivos y español en variables locales.

Lee `AGENTS.md` (generado por Expo): las APIs de Expo cambian cada SDK, consulta siempre https://docs.expo.dev/versions/v58.0.0/ antes de usar una.

## Comandos

```bash
npm start              # dev server; npm run tunnel desde entornos en la nube
npm run typecheck      # tsc --noEmit (verificación principal)
npm run doctor         # expo-doctor
npm run export:web     # build web: comprueba que Metro + NativeWind compilan todo
npx expo-cli lint      # opcional
```

Las rutas tipadas (`experiments.typedRoutes`) se generan al arrancar `expo start`/`expo export`; si `typecheck` falla por `.expo/types`, ejecutar primero `npm run export:web`. CI (`.github/workflows/ci.yml`) corre export, typecheck y doctor en cada push.

## Estado de la migración

**Migración completa de todas las vistas de la web** (ver `docs/PLAN_MIGRACION_REACT_NATIVE.md`): prototipo móvil (Fase 3a), auth web (3b), home/landing y componentes públicos (3c), marketplace y ficha de producto (3d), checkout (3e: igual que en la web, son marcadores) y el dashboard completo del proveedor (3f: overview con guía, bandeja, pedidos, detalle, finanzas con sus 5 vistas y gráficos, productos y stock, rutas y detalle, perfil; favoritos/mis-pedidos/configuración/clientes son marcadores como en la web). Pendiente: conectar la API real y afinar detalles pixel a pixel contra el Figma en dispositivo.

## Equivalencias web → nativo

| Web (Fronted_CANEY-RD) | Aquí |
|---|---|
| `<div>` | `View` |
| `<p>`, `<span>`, `<h1>`… | `Text` (todo texto va dentro de `Text`, siempre con `font-sans` o `font-inter`) |
| `<img src="/images/x.png">` | `<Image source={imagen("/images/x.png")}>` de `expo-image` |
| `<button>`, `hover:`/`active:` | `Presionable` (`ui/presionable`); estado `pressed` (no existe hover). **NativeWind descarta `style={({pressed}) => …}` en un `Pressable` con `className`**: usar siempre `Presionable` con `estilo={(pressed) => …}` |
| `<input>` | `TextInput` (`ui/input`) |
| `Link to`, `useNavigate`, `useParams` | `Link href`, `useRouter`, `useLocalSearchParams` de `expo-router` |
| `app/routes.ts` + `routes/*.tsx` | archivos en `src/app/` (`_layout.tsx` = layout de React Router) |
| `loader`/SSR | no existe: cargar en `useEffect` o hooks de `src/lib` |
| SVG inline (gráficos) | `react-native-svg` (`Svg`, `Circle`, `Polygon`, `Polyline`, `LinearGradient`) |
| `shadow-[...]` CSS | `shadow-*` de NativeWind (iOS) + `elevation` (Android) |
| `fixed inset-0` | `absolute inset-0` |
| `~/components/...` | `@/components/...` |

Mapa de rutas: `/` → `src/app/index.tsx` (splash); prototipo móvil: `/onboarding`, `/rol`, `/busca`, `/auth`, `/solicitud`, `/confirmada`, `/flota` como pantallas sueltas y, bajo `src/app/(app)/` (Tabs con la barra `NavInferior`, ítems según el rol de `lib/sesion.ts`): `/mapa`, `/historial`, `/alertas`, `/perfil`, `/tracking`, `/transportista`, `/transportista-mapa`; además, fuera de las Tabs: `/cuenta/datos`, `/cuenta/pagos`, `/cuenta/empresa` (empresa o, para el transportista, su flota y licencia) y `/cuenta/configuracion` (opciones del perfil), `/camion/nuevo` (alta de vehículo, guarda en `lib/flota.ts`) y `/viaje/[id]` (detalle de la solicitud de un cliente cercano, datos en `lib/viajes.ts`). Los datos editables del perfil viven en `lib/sesion.ts` (`perfil`, `actualizarPerfil`) y los métodos de pago en `lib/pagos.ts`. **Reutilizar, no duplicar**: Datos personales y Mi Empresa usan `components/perfil/formulario-perfil.tsx` (el mismo formulario "Mi Perfil" del dashboard del proveedor, con `secciones`), y Métodos de pago usa `movil/medios-pago.tsx`, la misma pasarela del paso 3 de `/solicitud` (`modo="pago"` para pagar, `modo="gestion"` para administrar). Web: `/home` (home con sesión), `/landing`, `(auth)/login` y `(auth)/register`, `/marketplace` y `/marketplace/producto/[id]`, `/checkout/*`, y `src/app/dashboard/` con `_layout.tsx` (cabecera + `Sidebar` como cajón por debajo de 1024 px, `ProfilePanel` a partir de 1280 px, `Stack` interno) y las mismas rutas que `app/routes.ts` (`bandeja/pedidos/[id]`, `finanzas/economicos/resumen`, `productos/[id]/stock`, `rutas/[pedidoId]`…). Cada pantalla del dashboard envuelve su contenido en `components/dashboard/pagina.tsx` (`Pagina` = scroll; `TituloSeccion` = título + enlace azul). El `SearchHeader` de la web es cosa de escritorio: en móvil solo sale en pantallas con listados (`<Pagina buscador>`: bandeja, pedidos, productos, rutas, clientes, indicadores de producto) y en anchos ≥ 900 px siempre.

Gráficos del dashboard: `components/dashboard/graficos.tsx` (`Tarjeta`, `TarjetaTotal`, `Dona`, `Barras`, `BarrasAgrupadas`, `Lineas`, `Area`, `Medidor`, `AnilloProgreso`, `Tabs`, `BotonPeriodo`…); el hover de la web se sustituye por tocar la barra/punto, que muestra el valor en una burbuja. Las tablas van en `tabla-pedidos.tsx` con scroll horizontal (min 560 px, como la web). `ui/subir-foto.tsx` usa expo-image-picker y devuelve una URI que `imagen()` acepta junto a las rutas de `assets/`.

Programación: `movil/programar.tsx` (`ProgramarCard`) se despliega bajo "Programar" en `/solicitud` y bajo "Más tarde" en `/flota` (día, hora y margen). El historial del transporte abre el mismo `/viaje/[id]` (datos en `VIAJES_HISTORIAL`). El banner de bienvenida del proveedor es `#556B2F`. En Mis productos, el formulario de alta oculta filtros y listado, y la foto se sube desde el recuadro "+" de la galería (`GaleriaFotos onSubir`).

Los mapas de cliente y transportista usan `movil/panel-desplegable.tsx`: el mapa ocupa todo el fondo y el panel blanco se arrastra por el asa (PanResponder + Animated) para ocultarlo o desplegarlo. **NativeWind tampoco procesa `className` en `Animated.View`**: ese componente va con estilos inline.

Lecciones del prototipo: medir tamaños con `onLayout` (`useWindowDimensions` llega vacío en el export web estático); las sombras CSS arbitrarias van como `style` desde `SOMBRA` en `lib/estilos.ts`; los colores "sueltos" del Figma de la Fase 1 están en `C` del mismo archivo; el mapa es `components/mapa.tsx` (react-native-maps, incluido en Expo Go) con `mapa.web.tsx` (iframe de Google Maps); los íconos de trazo de la web se dibujan con `ui/icono.tsx` (`ICONOS` reúne los `d` compartidos); los textos usan `ui/texto.tsx`, que aplica Inter salvo que la clase lleve `font-sans`.

## Arquitectura

### Las tres zonas del producto

El proyecto se divide en tres zonas; antes de crear una vista hay que saber a cuál pertenece:

1. **Pre-login (público)** — lo que ve quien entra sin cuenta: `/landing`, `/login`, `/register`, `/marketplace` (catálogo de compra) y la ficha de producto. Usan `Navbar` + `Footer`.
2. **Post-login proveedor** — todo `/dashboard/*`, bajo `dashboard/layout.tsx`. Es lo único construido hasta ahora. `/dashboard/productos` ("Mis productos") es el módulo del **proveedor**: publica, filtra y administra su propio catálogo (nombre, descripción, categoría, unidad de medida, precio, existencia, estado). No confundir con `/marketplace`, que es la vista de **compra**.
3. **Post-login cliente** — `src/app/cliente/`: reutiliza el mismo armazón que el proveedor (`components/dashboard/cascaron.tsx` con `rol="cliente"`, `Sidebar` con sus ítems: Marketplace como inicio, Historial, Notificaciones, Métodos de pago, Configuración, y "TUS TOP 3 PROVEEDORES" con "Pedir de nuevo" en lugar de "OTROS PROVEEDORES"); cabecera con campanita (`/cliente/notificaciones`) y foto (`/cliente/perfil`). Sin el buscador ni la cabecera pública de la web. Las rutas `/marketplace*` redirigen a `/cliente*`. Sus pedidos de productos viven en `lib/pedidos-cliente.ts` (`/cliente/historial` → `/cliente/pedido/[id]`). El proveedor **no** ve el Marketplace en su menú.

**Regla de no duplicación**: no se crea un componente para web y otro equivalente para móvil. Los módulos post-login son responsive y se acceden desde el teléfono con el mismo código: por debajo de `lg` el `Sidebar` se abre como cajón (props `abierto` / `onCerrar`) desde el botón de menú que dibuja `dashboard/layout.tsx`. La ruta `/mobile` es la **excepción deliberada**: es el prototipo de la app móvil nativa de la Fase 1 (con su módulo de transporte), no una copia responsive del dashboard.

**Regla de no duplicación**: un solo componente por concepto; las diferencias de tamaño se resuelven con layout responsive (`useWindowDimensions`, clases `md:`/`lg:` de NativeWind), no con copias.

Los estados de una misma vista (cargando, error, tab activa, método de pago elegido) se manejan con estado dentro del componente, NO como rutas separadas.

### Convenciones de UI

- **Botones**: todos comparten el efecto definido en `components/ui/button.tsx` — en móvil no hay hover: el estado `pressed` del `Pressable` aplica los **colores invertidos** (fondo transparente + borde, nunca fondo blanco). Los botones escritos a mano fuera de ese componente deben replicar el mismo efecto.
- **Cards del dashboard**: patrón `sombraCard` (`rounded-[2rem] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)] hover:-translate-y-1`). El fondo de página es blanco; lo que separa los elementos son las sombras, no bordes ni grises.
- **Tipografía**: `font-sans` (Poppins) en el sitio público, `font-inter` (Inter) en el dashboard. Ambas se cargan con `expo-font` en `src/lib/fuentes.ts` (`@expo-google-fonts/*`), registradas como una familia con varias caras para que `font-semibold`/`italic` elijan el archivo correcto.
- **Gráficos**: se dibujan a mano con `react-native-svg`, sin librería de charts — dona con `stroke-dasharray` sobre `<circle strokeLinecap="round">`, áreas con `<polygon>` + `<linearGradient>`, líneas con `<polyline>`. Cada gráfico lleva hover y su propio `FiltroPeriodo`.
- **Carruseles**: `FlatList`/`ScrollView` horizontal con `pagingEnabled`; para el infinito, clones al final y `scrollToOffset` sin animación al llegar al clon.

### Datos y tipos

- `src/types/` — interfaces compartidas (ej. `Product` en `types/product.ts`, consumida por `ProductCard`)
- Aún no hay backend: las vistas usan datos de ejemplo locales y timers para simular carga. Al conectar la API, reemplazar esos datos manteniendo las interfaces.
- **Simulación determinista**: los gráficos deben reaccionar a los filtros y fechas. El patrón usado es derivar los valores de una semilla (la fecha/periodo seleccionado) con algo como `Math.sin(seed * 3.7 + i * 1.93) * 0.5`, de modo que cambiar el filtro cambie visiblemente todas las cifras pero el resultado sea estable entre renders.
- `src/lib/` y `src/hooks/` están reservadas para helpers/API y custom hooks.

### Estilos y paleta

La paleta oficial está en `tailwind.config.js` (copiados de los tokens `@theme` de `app/app.css` del repo web): `primary` (verde), `secondary` (beige), `secondary2` (marrón), `secondary3` (naranja), `secondary4` (verde lima), `success`, `warning`, `error`, `dark`, cada una en escala 50–900, más `caney-dark` (#2e320e, fondo del splash) y `caney-sky` (#63b3ff, panel azul del login). Usar siempre estos tokens (`bg-primary-600`, `text-secondary2-300`…), nunca hex sueltos en los componentes salvo los grises de marca citados arriba.

Ojo: en el frame "Colores" del Figma varias etiquetas hex están mal; los valores marcados "confirmado en Figma" en `app.css` provienen de las variables reales del archivo. Ante dudas de color, leer variables del nodo Figma, no las etiquetas.


### Assets

Las imágenes se referencian por su ruta web de siempre a través del registro generado `src/lib/imagenes.ts`: `IMAGENES["/images/..."]` o `imagen(ruta)` (Metro exige `require()` estáticos; el tipo es `number`). Tras añadir archivos a `assets/`, ejecutar `node scripts/generar-imagenes.js`. El alias `@` importa desde `src/`. `Logotipo_BANEY.png` es la hoja del logo rasterizada desde el SVG (react-native-svg no carga archivos .svg sin transformer).

- `assets/logos/` — `Logotipo_BANEY_SVG.svg` (hoja, sin fondo), `Logo_Horizontal_baney_png.png` (sidebar), `Baney_logo_png.png`, `BANEY_TITULO.png`
- `assets/images/` — fotos y recursos del login: `Fondo_login.jpg`, `Image_login.png`, `granjero.png`, `BlobsVector_01_login.png` (mancha crema) y `BlobsVector_02_login.png` (mancha marrón), más los íconos PNG del sidebar (`home.png`, `direct-inbox.png`, `folder-open.png`, `task-square.png`, `people.png`)
- `assets/images/image_home/`, `image_inicio/`, `image_mobile/` (incluye `baney_white.png`, el logotipo blanco del splash, y las fotos del onboarding), `image_rutas/`
- `assets/icons/` — `btn_pedido.png`, `icon_01/02/03.png`

Advertencia: algunos PNG exportados traen franjas transparentes (p. ej. `Image_login.png` tiene ~9.4% transparente abajo); si una imagen "no cuadra" con su contenedor, medir el alpha por filas antes de ajustar el layout.

## Notas de entorno

- Node ≥ 20 (la sesión en la nube usa 22). Instalar paquetes **siempre** con `npx expo install <paquete>` para que la versión sea compatible con el SDK.
- Expo Go solo trae sus módulos nativos (`react-native-maps` sí está incluido); si se añade otra librería con código nativo, hace falta un development build con EAS (`npx eas-cli@latest build --profile development`).
- No existen carpetas `ios/`/`android/`: la configuración nativa va en `app.json` y config plugins.
