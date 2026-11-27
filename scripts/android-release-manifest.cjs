const fs = require('node:fs');
const crypto = require('node:crypto');
const { expo } = require('../app.json');
const versionCode = Number(process.env.ANDROID_VERSION_CODE);
if (!Number.isSafeInteger(versionCode) || versionCode < 1) throw Error('Invalid version code');
const filename = `baney-${versionCode}.apk`;
const apk = fs.readFileSync(`release/${filename}`);
const manifest = {
  packageName: 'do.baney.app', versionCode, versionName: expo.version,
  apkUrl: `https://srv2122223.hstgr.cloud/downloads/android/${filename}`,
  sha256: crypto.createHash('sha256').update(apk).digest('hex'),
  commit: process.env.GITHUB_SHA, builtAt: new Date().toISOString(),
};
fs.writeFileSync('release/latest.json', JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync('release/SHA256SUMS', `${manifest.sha256}  ${filename}\n`);
console.log(`Prepared APK ${versionCode}; publication requires separate authorization.`);
