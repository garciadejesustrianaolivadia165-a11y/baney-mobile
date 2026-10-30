import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import EntradaCodigo from "@/components/auth/entrada-codigo";
import Login from "@/app/(auth)/login";
import { contrasenaValida } from "@/app/(auth)/restablecer";
import { desbloquear, MAX_INTENTOS } from "@/lib/sesion";

describe("contraseña: requisitos", () => {
  it("exige 8 caracteres, una mayúscula y un número", async () => {
    expect(contrasenaValida("baney2026")).toBe(false);
    expect(contrasenaValida("Baney")).toBe(false);
    expect(contrasenaValida("Baney2026")).toBe(true);
  });
});

describe("EntradaCodigo", () => {
  it("solo acepta dígitos y como máximo seis", async () => {
    const onCambio = jest.fn();
    await render(<EntradaCodigo valor="" onCambio={onCambio} />);
    await fireEvent.changeText(screen.getByLabelText("Escribe el código de 6 dígitos"), "12a3-456789");
    expect(onCambio).toHaveBeenCalledWith("123456");
  });

  it("muestra el error debajo de las casillas", async () => {
    await render(<EntradaCodigo valor="12" onCambio={() => {}} error="Código incorrecto" />);
    expect(screen.getByText("Código incorrecto")).toBeTruthy();
  });
});

describe("Login (UC-AUTH-02 / UC-AUTH-11)", () => {
  beforeEach(() => {
    desbloquear();
    (router.replace as jest.Mock).mockClear();
    (router.push as jest.Mock).mockClear();
  });

  it("muestra los errores de cada campo cuando el formulario está vacío", async () => {
    await render(<Login />);
    await fireEvent.press(screen.getByText("Iniciar Sección"));
    expect(screen.getByText("Nombre incorrecto")).toBeTruthy();
    expect(screen.getByText("Correo electrónico incorrecto")).toBeTruthy();
    expect(screen.getByText("Contraseña incorrecta")).toBeTruthy();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("entra con datos válidos", async () => {
    await render(<Login />);
    await fireEvent.changeText(screen.getByPlaceholderText("Ingrese su nombre completo"), "Triana García");
    await fireEvent.changeText(screen.getByPlaceholderText("Ingrese su correo electrónico"), "triana@baney.do");
    await fireEvent.changeText(screen.getByPlaceholderText("Ingrese su contraseña"), "Baney2026");
    await fireEvent.press(screen.getByText("Iniciar Sección"));
    expect(router.replace).toHaveBeenCalled();
  });

  it("bloquea la cuenta tras agotar los intentos", async () => {
    await render(<Login />);
    for (let i = 0; i < MAX_INTENTOS; i++) await fireEvent.press(screen.getByText("Iniciar Sección"));
    expect(router.replace).toHaveBeenCalledWith("/bloqueada");
  });

  it("lleva a recuperar la contraseña", async () => {
    await render(<Login />);
    await fireEvent.press(screen.getByText("¿Olvidaste tu contraseña?"));
    expect(router.push).toHaveBeenCalledWith("/olvide");
  });
});
