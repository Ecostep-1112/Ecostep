# Universal Links / App Links 설정 가이드

앱 초대 링크를 클릭하면 자동으로 앱이 열리도록 하는 설정입니다.

## ✅ 이미 완료된 설정

1. **파일 생성**
   - `public/.well-known/apple-app-site-association` (iOS)
   - `public/.well-known/assetlinks.json` (Android)

2. **Capacitor 설정**
   - `capacitor.config.json`에 앱 URL 오픈 설정 추가됨

3. **초대 링크 수정**
   - Community.jsx에서 웹 URL 사용하도록 수정됨

## 🔧 추가로 해야 할 작업

### 1. Android SHA256 Fingerprint 추출

#### Debug 키 (개발용)
```bash
cd android
gradlew signingReport
```

또는 직접 keytool 사용:
```bash
keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**SHA256** 값을 복사하세요 (예: `AA:BB:CC:...`)

#### Release 키 (배포용)
Release keystore가 있다면:
```bash
keytool -list -v -keystore /path/to/your/release.keystore -alias your-alias
```

### 2. assetlinks.json 업데이트

`public/.well-known/assetlinks.json` 파일을 열고:
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.ecostep.app",
      "sha256_cert_fingerprints": [
        "여기에_추출한_SHA256_넣기"
      ]
    }
  }
]
```

**콜론(:)을 제거하지 말고** 그대로 붙여넣으세요!

### 3. iOS Team ID 확인 (iOS 배포시)

Apple Developer 계정의 Team ID를 확인하세요:
1. https://developer.apple.com/account 접속
2. Membership 섹션에서 Team ID 확인 (예: `ABC123XYZ`)

`public/.well-known/apple-app-site-association` 파일 업데이트:
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "ABC123XYZ.com.ecostep.app",
        "paths": ["*"]
      }
    ]
  }
}
```

### 4. 웹 서버에 파일 배포

Railway에 다음 파일들이 배포되어야 합니다:
- `/.well-known/apple-app-site-association` (Content-Type: application/json)
- `/.well-known/assetlinks.json` (Content-Type: application/json)

#### Railway 배포 방법:
1. 빌드 후 `dist` 폴더에 파일이 포함되는지 확인
```bash
npm run build
ls dist/.well-known/
```

2. Railway에 푸시하면 자동 배포됨

#### 확인 방법:
웹 브라우저에서 접속해서 JSON이 보이는지 확인:
- https://ecostep-production.up.railway.app/.well-known/apple-app-site-association
- https://ecostep-production.up.railway.app/.well-known/assetlinks.json

### 5. 앱 재빌드 및 배포

```bash
npm run build
npx cap sync
npx cap open android
npx cap open ios
```

## 🧪 테스트 방법

### Android
1. 앱을 휴대폰에 설치
2. 초대 링크를 카톡으로 전송: `https://ecostep-production.up.railway.app?code=Why_Not`
3. 링크 클릭 → 앱이 자동으로 열리는지 확인

### iOS
1. 앱을 TestFlight 또는 App Store에서 설치
2. 초대 링크를 문자나 카톡으로 전송
3. 링크 클릭 → 앱이 자동으로 열리는지 확인

## ⚠️ 주의사항

1. **반드시 HTTPS 필요**: HTTP는 작동하지 않습니다
2. **도메인 일치**: capacitor.config.json의 hostname과 실제 웹 URL이 정확히 일치해야 합니다
3. **캐싱**: 변경 후 앱을 완전히 삭제하고 재설치해야 할 수 있습니다
4. **iOS는 배포 버전만**: iOS는 TestFlight/App Store에 배포된 앱만 Universal Links가 작동합니다

## 🔍 문제 해결

### Android 링크가 앱으로 안 열릴 때:
```bash
adb shell am start -a android.intent.action.VIEW -d "https://ecostep-production.up.railway.app?code=test"
```

### iOS 링크가 앱으로 안 열릴 때:
1. 설정 > Safari > 고급 > Web Inspector 활성화
2. Mac에서 Safari > 개발 메뉴로 디버깅

## 📝 현재 상태

- ✅ 기본 파일 생성됨 (apple-app-site-association, assetlinks.json)
- ✅ Capacitor 설정 완료 (capacitor.config.json)
- ✅ 초대 링크 코드 수정됨 (Community.jsx)
- ✅ Android Manifest 업데이트 (intent-filter 추가)
- ✅ iOS Info.plist 업데이트 (Associated Domains 추가)
- ✅ Deep Link 처리 로직 추가 (App.jsx)
- ⏳ Android SHA256 추가 필요
- ⏳ iOS Team ID 추가 필요 (배포시)
- ⏳ 웹 서버 배포 필요

## 🚀 빠른 시작

### 1단계: Android SHA256 추출 및 설정

**PowerShell에서 실행:**
```powershell
cd android
.\gradlew.bat signingReport
```

출력에서 "SHA256:" 줄을 찾아서 복사하세요.

### 2단계: assetlinks.json 업데이트

`public/.well-known/assetlinks.json` 파일을 열고 SHA256을 넣으세요:
```json
"sha256_cert_fingerprints": [
  "여기에_복사한_SHA256"
]
```

### 3단계: 빌드 및 배포

```bash
npm run build
git add .
git commit -m "Add deep links support"
git push
```

Railway가 자동으로 배포합니다.

### 4단계: 앱 재빌드

```bash
npx cap sync
npx cap open android
```

Android Studio에서 앱을 빌드하고 설치하세요.

### 5단계: 테스트

1. 앱을 설치하고 로그인
2. 카톡으로 초대 링크 전송: `https://ecostep-production.up.railway.app?code=테스트`
3. 링크 클릭 → 앱이 자동으로 열리는지 확인

## ✅ 배포 확인

웹 브라우저에서 다음 URL에 접속해서 JSON이 보이는지 확인:
- https://ecostep-production.up.railway.app/.well-known/apple-app-site-association
- https://ecostep-production.up.railway.app/.well-known/assetlinks.json
