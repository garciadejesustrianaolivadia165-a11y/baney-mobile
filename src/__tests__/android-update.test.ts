import { newerAndroidRelease } from "../lib/android-update";
const url = "https://srv2122223.hstgr.cloud/downloads/android/latest.json";
const release = { packageName: "do.baney.app", versionCode: 12, versionName: "1.0.0", apkUrl: "https://srv2122223.hstgr.cloud/downloads/android/baney-12.apk", sha256: "a".repeat(64) };
it("offers only newer releases for this package", () => {
  expect(newerAndroidRelease(release, "do.baney.app", 11, url)).toEqual(release);
  expect(newerAndroidRelease(release, "do.baney.app", 12, url)).toBeNull();
  expect(newerAndroidRelease(release, "another.app", 11, url)).toBeNull();
});
it.each(["http://srv2122223.hstgr.cloud/downloads/android/a.apk", "https://evil.test/downloads/android/a.apk", "javascript:alert(1)", "https://srv2122223.hstgr.cloud/other.apk"])("rejects unsafe download %s", apkUrl => {
  expect(newerAndroidRelease({ ...release, apkUrl }, "do.baney.app", 11, url)).toBeNull();
});
it("rejects malformed metadata", () => {
  for (const value of [null, {}, { ...release, versionCode: 12.5 }, { ...release, sha256: "bad" }]) expect(newerAndroidRelease(value, "do.baney.app", 1, url)).toBeNull();
});
