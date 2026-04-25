# 서울정형외과

서울정형외과 공식 웹사이트 정적 랜딩 페이지입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 확인할 수 있습니다.

## 검증

```bash
npm run lint
npm run build
```

## Android 앱

웹사이트는 Capacitor 기반 Android 앱으로도 패키징할 수 있습니다.

```bash
npm install
npm run android:sync
cd android
./gradlew assembleDebug
```

Debug APK는 `android/app/build/outputs/apk/debug/app-debug.apk`에 생성됩니다.

Android SDK가 별도 위치에 있다면 빌드 전에 `ANDROID_HOME` 또는 `ANDROID_SDK_ROOT`를 설정해 주세요.

Android Studio에서 열려면:

```bash
npm run android:open
```

iOS 앱은 같은 Capacitor 설정을 사용할 수 있지만, iOS 프로젝트 생성과 빌드는 macOS/Xcode 환경에서 진행해야 합니다.

## 배포 URL

https://seoul-orthopedic.vercel.app/
