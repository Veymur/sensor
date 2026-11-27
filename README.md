# Veymur Sensor

Veymur Sensor is an Android app that records heart rate from a Polar Verity Sense
sensor. It saves workouts on your phone and can record a GPS route. Completed
workouts appear in History.

## Download for Android

[Download APK](https://github.com/Veymur/sensor/releases/latest/download/veymur-sensor.apk) ·
[All releases](https://github.com/Veymur/sensor/releases)

The direct download becomes available once a release includes the APK. The app
requires Android 13 or later (arm64-v8a or x86_64) and runs without Metro.

The test build uses a debug signing key. If Android rejects an update because
the signatures differ, export any recordings you want to keep from the installed
version first.

## Record a workout

1. Allow Bluetooth scanning and select your sensor.
2. To record a GPS route, enable route recording and grant location access.
3. Start your workout. You can pause and resume recording at any time.
4. Finish the workout and open History to find the saved recording.

## Development

- [Install dependencies and build the app](apps/sensor/README.md)
- [Native Kotlin prototype](apps/sensor-stage0/README.md)
- [Compatibility](docs/compatibility.md)

To publish a new APK, tag the target commit with a tag such as `sensor-v0.0.1`
and push the tag. GitHub Actions builds and verifies the standalone APK and
attaches `veymur-sensor.apk` to the release.
