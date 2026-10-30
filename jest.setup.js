// Mocks comunes de las pruebas: navegación de Expo Router y fuentes.
jest.mock("expo-router", () => {
  const router = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };
  return {
    __esModule: true,
    useRouter: () => router,
    useLocalSearchParams: () => ({}),
    usePathname: () => "/",
    Link: ({ children }) => children,
    Redirect: () => null,
    router,
  };
});
jest.mock("expo-font", () => ({ useFonts: () => [true, null], isLoaded: () => true, loadAsync: jest.fn() }));
