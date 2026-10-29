// Regenera src/lib/imagenes.ts a partir de los archivos de assets/.
// Uso: node scripts/generar-imagenes.js
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const out = [
  "// GENERADO: registro de assets. Mapea las rutas web (\"/images/...\") que usan",
  "// los datos de app/lib a require() estáticos, que es lo que exige Metro.",
  "// Regenerar con: node scripts/generar-imagenes.js",
  'import type { ImageSourcePropType } from "react-native";',
  "",
  "export const IMAGENES = {",
];

function recorrer(dir) {
  for (const f of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) recorrer(p);
    else if (/\.(png|jpe?g)$/i.test(f)) {
      const rel = path.relative(path.join(raiz, "assets"), p).split(path.sep).join("/");
      out.push(`  ${JSON.stringify("/" + rel)}: require(${JSON.stringify("../../assets/" + rel)}),`);
    }
  }
}
for (const d of ["images", "icons", "logos"]) recorrer(path.join(raiz, "assets", d));

out.push(
  "} as const satisfies Record<string, ImageSourcePropType>;",
  "",
  "export type RutaImagen = keyof typeof IMAGENES;",
  "",
  '/** Devuelve el source nativo de una ruta web del design system (p. ej. "/logos/Baney_logo_png.png"). */',
  "export function imagen(ruta: string): ImageSourcePropType {",
  "  const src = (IMAGENES as Record<string, ImageSourcePropType>)[ruta];",
  "  if (!src && __DEV__) console.warn(`[imagenes] ruta no registrada: ${ruta}`);",
  '  return src ?? IMAGENES["/logos/Baney_logo_png.png"];',
  "}",
  ""
);
fs.writeFileSync(path.join(raiz, "src/lib/imagenes.ts"), out.join("\n"));
console.log(`imagenes.ts regenerado (${out.filter((l) => l.startsWith('  "')).length} archivos)`);
