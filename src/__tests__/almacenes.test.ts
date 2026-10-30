import { act, renderHook } from "@testing-library/react-native";

import { agregarAlCarrito, cambiarCantidad, quitarDelCarrito, useCarrito, vaciarCarrito } from "@/lib/carrito";
import { abrirChatCon, enviarMensaje, marcarLeida, useConversaciones } from "@/lib/chat";
import { eliminarDireccion, guardarDireccion, hacerPredeterminada, useDirecciones } from "@/lib/direcciones";
import { alternarDestacado, alternarFavorito, useFavoritos } from "@/lib/favoritos";
import { cancelarPedidoCliente, crearPedidoCliente, usePedidosCliente } from "@/lib/pedidos-cliente";
import { aceptarPedido, agregarItemPedido, cancelarPedido, completarPedido, filaPedido, quitarItemPedido, rechazarPedido, subtotalPedido, totalPedido, usePedidosProveedor } from "@/lib/pedidos-proveedor";
import { CATALOGO } from "@/lib/productos";
import { actualizarSesion, cerrarSesion, desbloquear, destinoPorRol, intentoFallido, MAX_INTENTOS, useSesion } from "@/lib/sesion";

describe("carrito (almacén reactivo)", () => {
  beforeEach(() => vaciarCarrito());

  it("acumula el mismo producto y quita al llegar a cero", async () => {
    const { result } = await renderHook(() => useCarrito());
    await act(() => {
      agregarAlCarrito(CATALOGO[0], 1, { unidad: CATALOGO[0].unidad });
      agregarAlCarrito(CATALOGO[0], 2);
      agregarAlCarrito(CATALOGO[1], 1);
    });
    expect(result.current).toHaveLength(2);
    expect(result.current[0].cantidad).toBe(3);
    await act(() => cambiarCantidad(CATALOGO[0].id, 0));
    expect(result.current).toHaveLength(1);
    await act(() => quitarDelCarrito(CATALOGO[1].id));
    expect(result.current).toHaveLength(0);
  });
});

describe("pedidos del proveedor", () => {
  it("aceptar, completar, rechazar y cancelar cambian el estado", async () => {
    const { result } = await renderHook(() => usePedidosProveedor());
    const nuevo = result.current.find((p) => p.estado === "NUEVO")!;
    await act(() => aceptarPedido(nuevo.id));
    expect(result.current.find((p) => p.id === nuevo.id)?.estado).toBe("EN PROCESO");
    await act(() => completarPedido(nuevo.id));
    expect(result.current.find((p) => p.id === nuevo.id)?.estado).toBe("COMPLETADO");
    const otro = result.current.find((p) => p.estado === "NUEVO")!;
    await act(() => rechazarPedido(otro.id));
    expect(result.current.find((p) => p.id === otro.id)?.estado).toBe("RECHAZADO");
    const enProceso = result.current.find((p) => p.estado === "EN PROCESO")!;
    await act(() => cancelarPedido(enProceso.id));
    expect(result.current.find((p) => p.id === enProceso.id)?.estado).toBe("CANCELADO");
  });

  it("agregar y quitar ítems recalcula el ITBIS y el total", async () => {
    const { result } = await renderHook(() => usePedidosProveedor());
    const pedido = result.current[0];
    const antes = pedido.items.length;
    await act(() => agregarItemPedido(pedido.id, { nombre: "Miel", categoria: "Artesanales", cantidad: "1 frasco", precio: 1000, img: "" }));
    const con = result.current.find((p) => p.id === pedido.id)!;
    expect(con.items).toHaveLength(antes + 1);
    expect(con.itbis).toBe(Math.round(subtotalPedido(con) * 0.18));
    expect(totalPedido(con)).toBe(subtotalPedido(con) + con.itbis + con.envio);
    await act(() => quitarItemPedido(pedido.id, con.items.length - 1));
    expect(result.current.find((p) => p.id === pedido.id)?.items).toHaveLength(antes);
    const fila = filaPedido(con);
    expect(fila.status).toBe(con.estado);
    expect(fila.precio).toMatch(/^RD\$ /);
  });
});

describe("direcciones", () => {
  it("solo una predeterminada y reasigna al eliminar", async () => {
    const { result } = await renderHook(() => useDirecciones());
    const inicial = result.current.length;
    await act(() => {
      guardarDireccion({ etiqueta: "Almacén", direccion: "Zona Franca", provincia: "SD", referencia: "", contacto: "Triana", telefono: "", predeterminada: true });
    });
    expect(result.current).toHaveLength(inicial + 1);
    expect(result.current.filter((d) => d.predeterminada)).toHaveLength(1);
    const nueva = result.current.find((d) => d.direccion === "Zona Franca")!;
    expect(nueva.predeterminada).toBe(true);
    await act(() => eliminarDireccion(nueva.id));
    expect(result.current).toHaveLength(inicial);
    expect(result.current.filter((d) => d.predeterminada)).toHaveLength(1);
    await act(() => hacerPredeterminada(result.current[1].id));
    expect(result.current[1].predeterminada).toBe(true);
    expect(result.current[0].predeterminada).toBe(false);
  });
});

describe("favoritos", () => {
  it("alterna productos del marketplace y destacados del proveedor", async () => {
    const { result } = await renderHook(() => useFavoritos());
    let marcado = false;
    await act(() => {
      marcado = alternarFavorito(CATALOGO[3]);
    });
    expect(marcado).toBe(true);
    expect(result.current.productos.map((p) => p.id)).toContain(CATALOGO[3].id);
    await act(() => {
      alternarFavorito(CATALOGO[3]);
    });
    expect(result.current.productos).toHaveLength(0);
    await act(() => alternarDestacado("p1"));
    expect(result.current.destacados).toEqual(["p1"]);
    await act(() => alternarDestacado("p1"));
    expect(result.current.destacados).toEqual([]);
  });
});

describe("sesión", () => {
  it("bloquea la cuenta al agotar los intentos y desbloquea", async () => {
    const { result } = await renderHook(() => useSesion());
    let bloqueada = false;
    await act(() => {
      for (let i = 0; i < MAX_INTENTOS - 1; i++) bloqueada = intentoFallido();
    });
    expect(bloqueada).toBe(false);
    expect(result.current.intentos).toBe(MAX_INTENTOS - 1);
    await act(() => {
      bloqueada = intentoFallido();
    });
    expect(bloqueada).toBe(true);
    expect(result.current.bloqueada).toBe(true);
    await act(() => desbloquear());
    expect(result.current.intentos).toBe(0);
    expect(result.current.bloqueada).toBe(false);
  });

  it("decide el destino por rol y conserva el rol al cerrar sesión", async () => {
    await act(() => actualizarSesion({ rol: "proveedor" }));
    expect(destinoPorRol()).toBe("/dashboard");
    await act(() => actualizarSesion({ rol: "transportista" }));
    expect(destinoPorRol()).toBe("/transportista");
    await act(() => actualizarSesion({ rol: "cliente", busca: "productor" }));
    expect(destinoPorRol()).toBe("/cliente");
    await act(() => actualizarSesion({ busca: "transportista" }));
    expect(destinoPorRol()).toBe("/mapa");
    await act(() => cerrarSesion());
    const { result } = await renderHook(() => useSesion());
    expect(result.current.rol).toBe("cliente");
    expect(result.current.intentos).toBe(0);
  });
});

describe("pedidos del cliente", () => {
  it("crea el pedido desde el carrito con ITBIS y se puede cancelar", async () => {
    const { result } = await renderHook(() => usePedidosCliente());
    const antes = result.current.length;
    let id = "";
    await act(() => {
      id = crearPedidoCliente([{ producto: CATALOGO[0], cantidad: 2, unidad: "racimo" }], { direccion: "Casa", envio: 650, metodoPago: "PayPal", entrega: "Transporte BANEY" }).id;
    });
    expect(result.current).toHaveLength(antes + 1);
    const pedido = result.current[0];
    expect(pedido.id).toBe(id);
    expect(pedido.estado).toBe("En camino");
    expect(pedido.itbis).toBe(Math.round(CATALOGO[0].price * 2 * 0.18));
    expect(pedido.items[0].cantidad).toBe("2 racimos");
    await act(() => cancelarPedidoCliente(id));
    expect(result.current[0].estado).toBe("Cancelado");
  });
});

describe("chat", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("abre una conversación por contacto sin duplicar y responde a los mensajes", async () => {
    const { result } = await renderHook(() => useConversaciones());
    const antes = result.current.length;
    let id = "";
    await act(() => {
      id = abrirChatCon({ nombre: "Nuevo Contacto", avatar: "", rol: "Cliente" });
      abrirChatCon({ nombre: "Nuevo Contacto", avatar: "", rol: "Cliente" });
    });
    expect(result.current).toHaveLength(antes + 1);
    await act(() => enviarMensaje(id, "  Hola  "));
    let conv = result.current.find((c) => c.id === id)!;
    expect(conv.mensajes).toHaveLength(1);
    expect(conv.mensajes[0]).toMatchObject({ de: "yo", texto: "Hola" });
    await act(() => {
      jest.advanceTimersByTime(1600);
    });
    conv = result.current.find((c) => c.id === id)!;
    expect(conv.mensajes).toHaveLength(2);
    expect(conv.mensajes[1].de).toBe("otro");
    await act(() => enviarMensaje(id, "   "));
    expect(result.current.find((c) => c.id === id)!.mensajes).toHaveLength(2);
    const conNoLeidos = result.current.find((c) => c.noLeidos > 0)!;
    await act(() => marcarLeida(conNoLeidos.id));
    expect(result.current.find((c) => c.id === conNoLeidos.id)!.noLeidos).toBe(0);
  });
});
