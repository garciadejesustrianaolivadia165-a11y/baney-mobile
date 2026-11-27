#!/usr/bin/env bash
set -euo pipefail
mkdir -p android-diagnostics
adb shell getprop ro.product.cpu.abilist | tee android-diagnostics/abis.txt
APK=$(find apk-input -type f -name '*.apk' | head -1)
test -n "$APK"
sha256sum "$APK" | tee android-diagnostics/apk-sha256.txt
adb install -r "$APK" | tee android-diagnostics/install.txt
adb logcat -c
adb shell am start -W -n do.baney.app/com.baneyrd.app.MainActivity | tee android-diagnostics/launch.txt
sleep 25
adb logcat -d > android-diagnostics/logcat.txt
adb shell dumpsys activity activities > android-diagnostics/activities.txt
adb exec-out screencap -p > android-diagnostics/startup.png
adb shell uiautomator dump /sdcard/baney-ui.xml || true
adb pull /sdcard/baney-ui.xml android-diagnostics/ui.xml || true
adb shell pidof do.baney.app | tee android-diagnostics/pid.txt
test -s android-diagnostics/pid.txt
if grep -E 'FATAL EXCEPTION|Fatal signal|Error al iniciar BANEY' android-diagnostics/logcat.txt; then
  exit 1
fi
# A surviving process is insufficient: require the actual onboarding screen.
grep -q 'Omitir' android-diagnostics/ui.xml
for attempt in 1 2; do
  adb shell am force-stop do.baney.app
  adb shell am start -W -n do.baney.app/com.baneyrd.app.MainActivity
  sleep 15
  adb shell pidof do.baney.app
  adb shell uiautomator dump /sdcard/baney-ui.xml
  adb pull /sdcard/baney-ui.xml "android-diagnostics/relaunch-$attempt.xml"
  grep -q 'Omitir' "android-diagnostics/relaunch-$attempt.xml"
done
# Exercise navigation without submitting credentials or creating production data.
adb shell am start -W -a android.intent.action.VIEW -d 'baney://login' do.baney.app
sleep 10
adb shell uiautomator dump /sdcard/baney-ui.xml
adb pull /sdcard/baney-ui.xml android-diagnostics/login.xml
adb exec-out screencap -p > android-diagnostics/login.png
adb logcat -d > android-diagnostics/logcat.txt
adb shell pidof do.baney.app
grep -q 'Correo' android-diagnostics/login.xml
if grep -q 'Error al iniciar BANEY' android-diagnostics/login.xml; then exit 1; fi
