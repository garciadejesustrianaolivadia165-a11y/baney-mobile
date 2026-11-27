export type AndroidRelease = { packageName: string; versionCode: number; versionName: string; apkUrl: string; sha256: string };

/** Public metadata only; never attach session tokens to the download endpoint. */
export function newerAndroidRelease(value: unknown, packageName: string, versionCode: number, manifestUrl: string): AndroidRelease | null {
  if (!value || typeof value !== "object") return null;
  const r = value as AndroidRelease;
  if (r.packageName !== packageName || !Number.isSafeInteger(r.versionCode) || r.versionCode <= versionCode ||
      typeof r.versionName !== "string" || !r.versionName.trim() || typeof r.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(r.sha256)) return null;
  try {
    const base = new URL(manifestUrl), apk = new URL(r.apkUrl);
    if (base.protocol !== "https:" || apk.protocol !== "https:" || apk.origin !== base.origin ||
        apk.username || apk.password || !apk.pathname.startsWith("/downloads/android/") || !apk.pathname.endsWith(".apk")) return null;
  } catch { return null; }
  return r;
}
