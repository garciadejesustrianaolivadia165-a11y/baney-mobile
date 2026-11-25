// Configuración dinámica de Expo: parte de app.json y añade lo que depende del entorno.
// GOOGLE_MAPS_KEY_APP se define como variable de EAS (eas env:create) y en .env local;
// nunca se escribe en app.json ni se sube al repo.
module.exports = ({ config }) => {
  const mapsKey = process.env.GOOGLE_MAPS_KEY_APP;
  return {
    ...config,
    android: {
      ...config.android,
      config: {
        ...(config.android?.config ?? {}),
        googleMaps: { apiKey: mapsKey ?? config.android?.config?.googleMaps?.apiKey ?? "" },
      },
    },
    ios: {
      ...config.ios,
      config: { ...(config.ios?.config ?? {}), googleMapsApiKey: mapsKey ?? config.ios?.config?.googleMapsApiKey ?? "" },
    },
  };
};
