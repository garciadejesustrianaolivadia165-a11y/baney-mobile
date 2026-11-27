const { withAppBuildGradle } = require("expo/config-plugins");

// Generate native signing configuration through CNG; never commit a private key.
module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (mod) => {
    if (mod.modResults.language !== "groovy") throw new Error("Expected Groovy app build.gradle");
    const marker = "// BANEY_RELEASE_SIGNING";
    if (mod.modResults.contents.includes(marker)) return mod;
    mod.modResults.contents += `
${marker}
android.defaultConfig.applicationId = 'do.baney.app'
android.buildTypes.release.proguardFile(file('../../config/android-proguard-rules.pro'))
def baneyKeys = ['ANDROID_KEYSTORE_PATH', 'ANDROID_KEYSTORE_PASSWORD', 'ANDROID_KEY_ALIAS', 'ANDROID_KEY_PASSWORD']
def baneyHasSigning = baneyKeys.every { System.getenv(it) }
if (gradle.startParameter.taskNames.any { it.toLowerCase().contains('release') } && !baneyHasSigning) {
    throw new GradleException('Release requires all Android signing environment variables; debug signing is forbidden')
}
if (baneyHasSigning) {
    android.signingConfigs.create('baneyRelease') {
        storeFile file(System.getenv('ANDROID_KEYSTORE_PATH'))
        storePassword System.getenv('ANDROID_KEYSTORE_PASSWORD')
        keyAlias System.getenv('ANDROID_KEY_ALIAS')
        keyPassword System.getenv('ANDROID_KEY_PASSWORD')
    }
    android.buildTypes.release.signingConfig = android.signingConfigs.baneyRelease
}
`;
    return mod;
  });
};
