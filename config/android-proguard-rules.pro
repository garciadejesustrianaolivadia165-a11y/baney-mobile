# Room instantiates generated database implementations through reflection.
# R8 full mode must preserve their no-argument constructors explicitly.
# Without this, WorkManager crashes in InitializationProvider before React starts.
# AndroidX fix: https://android.googlesource.com/platform/frameworks/support/+/e4765e38e27a3f4d86188b996df97a52403dff46
-keep class * extends androidx.room.RoomDatabase { void <init>(); }
-keep class androidx.work.impl.WorkDatabase_Impl { public <init>(); }
