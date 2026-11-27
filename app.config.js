// Configuración dinámica de Expo: parte de app.json y añade lo que depende del entorno.
// GOOGLE_MAPS_KEY_APP se define en GitHub Actions o en .env local;
// nunca se escribe en app.json ni se sube al repo.
module.exports = ({ config }) => {
  const mapsKey = process.env.GOOGLE_MAPS_KEY_APP;
  const versionCode = Number(process.env.ANDROID_VERSION_CODE ?? config.android?.versionCode ?? 1);
  if (!Number.isSafeInteger(versionCode) || versionCode < 1 || versionCode > 2100000000) throw new Error("ANDROID_VERSION_CODE inválido");
  return {
    ...config,
    plugins: [...(config.plugins ?? []), "./plugins/withReleaseSigning"],
    extra: {
      ...config.extra,
      androidApplicationId: "do.baney.app",
      androidUpdateUrl: "https://srv2122223.hstgr.cloud/downloads/android/latest.json",
    },
    android: {
      ...config.android,
      // Java namespace must not contain the keyword `do`. The config plugin
      // sets the independent, installed applicationId to do.baney.app.
      package: "com.baneyrd.app",
      versionCode,
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
