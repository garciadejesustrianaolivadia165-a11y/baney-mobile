// Captura todas las pantallas de la app para docs/screen-flow (requiere `npm run export:web` y playwright).
// Uso: node docs/screen-flow/capturar.js
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const raiz = __dirname + "/../../dist";
const out = __dirname + "/img";
const tipos = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".ttf": "font/ttf", ".json": "application/json" };
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]); if (p === "/") p = "/index.html";
  let f = path.join(raiz, p); if (!fs.existsSync(f) && fs.existsSync(f + ".html")) f += ".html";
  if (fs.existsSync(f) && fs.statSync(f).isDirectory() && fs.existsSync(path.join(f, "index.html"))) f = path.join(f, "index.html");
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { const dir = path.dirname(f); const din = fs.existsSync(dir) ? fs.readdirSync(dir).find((n) => /^\[.*\]\.html$/.test(n)) : null; f = din ? path.join(dir, din) : path.join(raiz, "index.html"); }
  res.writeHead(200, { "content-type": tipos[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
}).listen(4173, async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  // API simulada: la app ya llama a los microservicios reales; aquí se responde con datos vacíos válidos.
  await ctx.route("**/api/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { access_token: "x", refresh_token: "x", token_type: "bearer", expires_in: 3600, id: "u1", email: "demo@baney.do", role: "cliente" } }) }));
  await ctx.route("**/transport-requests/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: "{\"data\":[]}" }));
  await ctx.route("**/trips/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: "{\"data\":[]}" }));
  const pg = await ctx.newPage();
  const w = (ms = 700) => pg.waitForTimeout(ms);
  const shot = (n) => pg.screenshot({ path: `${out}/${n}.png` });
  const ir = async (ruta, ms = 1200) => { await pg.goto("http://localhost:4173" + ruta, { waitUntil: "networkidle" }); await w(ms); };
  const tap = async (t, ms = 800) => { const l = pg.getByText(t, { exact: true }).last(); await l.scrollIntoViewIfNeeded(); await l.click({ timeout: 6000 }); await w(ms); };
  const menu = async () => { await pg.getByLabel("Abrir menú").last().click(); await w(700); };
  const ok = [], mal = [];
  const paso = async (nombre, fn) => { try { await fn(); await shot(nombre); ok.push(nombre); } catch (e) { mal.push(nombre + ": " + e.message.split("\n")[0]); } };

  // A. Acceso
  await paso("a01-splash", async () => { await pg.goto("http://localhost:4173/"); await w(600); });
  await paso("a02-onboarding-1", async () => { await ir("/onboarding"); });
  await paso("a03-onboarding-2", async () => { await tap("Siguiente"); });
  await paso("a04-onboarding-3", async () => { await tap("Siguiente"); });
  await paso("a05-rol", async () => { await ir("/rol"); });
  await paso("a06-busca", async () => { await ir("/busca"); });
  await paso("a07-register", async () => { await ir("/register"); });
  await paso("a08-login", async () => { await ir("/login"); });
  await paso("a09-login-error", async () => { await pg.getByPlaceholder("Ingrese su correo electrónico").last().fill("correo-malo"); await pg.getByPlaceholder("Ingrese su contraseña").last().fill("123"); await tap("Iniciar Sección"); });
  await paso("a10-olvide", async () => { await ir("/olvide"); });
  await paso("a11-codigo", async () => { await ir("/codigo?flujo=reset&correo=demo%40baney.do"); });
  await paso("a12-restablecer", async () => { await ir("/restablecer"); });
  await paso("a13-verifica-correo", async () => { await ir("/verifica?correo=demo%40baney.do"); });
  await paso("a14-bloqueada", async () => { await ir("/bloqueada"); });
  await paso("a15-completar-perfil", async () => { await ir("/cuenta/completar"); });

  // B. Cliente
  await paso("b01-marketplace", async () => { await ir("/cliente"); });
  await paso("b02-menu-cliente", async () => { await menu(); });
  await paso("b03-producto", async () => { await ir("/cliente/producto/3"); });
  await paso("b04-carrito", async () => { await ir("/cliente/carrito?producto=2"); });
  await paso("b05-pago", async () => { await tap("Continuar al pago"); });
  await paso("b06-pago-paypal", async () => { const l = pg.getByRole("img", { name: "PayPal" }).last(); await l.scrollIntoViewIfNeeded(); await l.click(); await w(600); });
  await paso("b07-pasarela-paypal", async () => { await tap("Ir a plataforma de pago"); });
  await paso("b08-tarjeta", async () => { await ir("/cliente/tarjeta"); });
  await paso("b09-confirmacion", async () => { await ir("/cliente/confirmacion?id=00242772362", 1500); });
  await paso("b10-historial", async () => { await ir("/cliente/historial"); });
  await paso("b11-pedido-detalle", async () => { await ir("/cliente/pedido/00242772362"); });
  await paso("b12-favoritos", async () => { await ir("/cliente/favoritos"); });
  await paso("b13-notificaciones", async () => { await ir("/cliente/notificaciones"); });
  await paso("b14-metodos-pago", async () => { await ir("/cliente/pagos"); });
  await paso("b15-configuracion", async () => { await ir("/cliente/configuracion"); });
  await paso("b16-perfil", async () => { await ir("/cliente/perfil"); });

  // C. Transporte (Fase 1)
  await paso("c01-mapa-cliente", async () => { await ir("/mapa", 1800); });
  await paso("c02-solicitud-1", async () => { await ir("/solicitud"); });
  await paso("c03-solicitud-2", async () => { await pg.getByPlaceholder("¿Hacia dónde va la carga?").last().fill("Mercado Nuevo, Santo Domingo"); await w(400); const btn = pg.getByRole("button").filter({ hasText: /Siguiente|Continuar/ }).last(); await btn.scrollIntoViewIfNeeded(); await btn.click(); await w(800); });
  await paso("c04-solicitud-3-pago", async () => { const btn = pg.getByRole("button").filter({ hasText: /Siguiente|Continuar/ }).last(); await btn.scrollIntoViewIfNeeded(); await btn.click(); await w(800); });
  await paso("c05-confirmada", async () => { await ir("/confirmada"); });
  await paso("c06-tracking", async () => { await ir("/tracking", 1800); });
  await paso("c07-historial", async () => { await ir("/historial"); });
  await paso("c08-alertas", async () => { await ir("/alertas"); });
  await paso("c09-perfil-movil", async () => { await ir("/perfil"); });
  await paso("c10-transportista-inicio", async () => { await ir("/transportista"); });
  await paso("c11-transportista-mapa", async () => { await ir("/transportista-mapa", 1800); });
  await paso("c12-flota", async () => { await ir("/flota"); });
  await paso("c13-camion-nuevo", async () => { await ir("/camion/nuevo"); });
  await paso("c14-viaje-detalle", async () => { await ir("/viaje/v1", 1800); });

  // D. Proveedor
  await paso("d01-inicio", async () => { await ir("/dashboard", 1600); });
  await paso("d02-guia", async () => { await tap("Guía interactiva", 1000); });
  await paso("d03-menu-proveedor", async () => { await ir("/dashboard"); await menu(); });
  await paso("d04-bandeja", async () => { await ir("/dashboard/bandeja"); });
  await paso("d05-pedidos", async () => { await ir("/dashboard/bandeja/pedidos"); });
  await paso("d06-pedido-detalle", async () => { await ir("/dashboard/bandeja/pedidos/00242772365", 1600); });
  await paso("d07-finanzas", async () => { await ir("/dashboard/finanzas"); });
  await paso("d08-indicadores", async () => { await ir("/dashboard/finanzas/indicadores"); });
  await paso("d09-finanzas-productos", async () => { await ir("/dashboard/finanzas/productos"); });
  await paso("d10-economicos", async () => { await ir("/dashboard/finanzas/economicos"); });
  await paso("d11-economicos-resumen", async () => { await ir("/dashboard/finanzas/economicos/resumen"); });
  await paso("d12-mis-productos", async () => { await ir("/dashboard/productos"); });
  await paso("d13-producto-nuevo", async () => { await ir("/dashboard/productos/nuevo"); });
  await paso("d14-stock", async () => { await ir("/dashboard/productos/p1/stock"); });
  await paso("d15-clientes", async () => { await ir("/dashboard/clientes"); });
  await paso("d16-cliente-detalle", async () => { await ir("/dashboard/clientes/cesar-valdez"); });
  await paso("d17-rutas", async () => { await ir("/dashboard/rutas", 1600); });
  await paso("d18-ruta-detalle", async () => { await ir("/dashboard/rutas/00242772365", 1800); });
  await paso("d19-favoritos", async () => { await ir("/dashboard/favoritos"); });
  await paso("d20-perfil", async () => { await ir("/dashboard/perfil"); });
  await paso("d21-metodos-pago", async () => { await ir("/dashboard/pagos"); });
  await paso("d22-configuracion", async () => { await ir("/dashboard/configuracion"); });
  await paso("d23-otro-proveedor", async () => { await ir("/dashboard/proveedores/maria-perez"); });

  // E. Cuenta y chat
  await paso("e01-datos-personales", async () => { await ir("/cuenta/datos"); });
  await paso("e02-empresa", async () => { await ir("/cuenta/empresa"); });
  await paso("e03-direcciones", async () => { await ir("/cuenta/direcciones"); });
  await paso("e04-direccion-nueva", async () => { await ir("/cuenta/direccion"); });
  await paso("e05-documentos", async () => { await ir("/cuenta/documentos"); });
  await paso("e06-configuracion-cuenta", async () => { await ir("/cuenta/configuracion"); });
  await paso("e07-eliminar-cuenta", async () => { await ir("/cuenta/eliminar"); });
  await paso("e08-chats", async () => { await ir("/chat"); });
  await paso("e09-chat", async () => { await ir("/chat/c1"); });

  console.log("OK", ok.length); mal.forEach((m) => console.log("FALLO", m));
  await b.close(); srv.close();
});
