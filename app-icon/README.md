# Ecostep 앱 아이콘

Ecostep 앱의 공식 아이콘 소스 파일입니다.

## 📁 파일 구조

```
app-icon/
├── icon-es.svg       # ES 로고 SVG 원본 파일 (1024x1024)
├── preview-es.html   # 브라우저 미리보기 및 PNG 변환 도구
└── README.md         # 이 파일
```

## 🎨 디자인 컨셉

- **배경**: 블랙 (#000000)
- **로고**: E와 S 겹친 텍스트 로고
- **글자 색상**: 화이트 (#ffffff)
- **폰트**: iOS San Francisco (SF Pro Display)
- **폰트 크기**: 1040px
- **폰트 굵기**: 500 (Medium)
- **자간**: -0.02em

## 🚀 사용 방법

### 1. 미리보기

`preview-es.html` 파일을 브라우저에서 열기:

```bash
# 브라우저에서 열기
start preview-es.html
```

### 2. PNG 변환

미리보기 페이지에서 원하는 크기의 "다운로드" 버튼 클릭

### 3. 필요한 크기

#### iOS
- **1024x1024** - App Store 필수 (투명 배경 금지)

#### Android
- **512x512** - Google Play Store 필수
- 192x192 (xxxhdpi)
- 144x144 (xxhdpi)
- 96x96 (xhdpi)
- 72x72 (hdpi)
- 48x48 (mdpi)

## 📝 파일 형식 요구사항

- 형식: PNG
- 비트: 24비트
- 컬러: RGB
- 투명도: iOS는 불투명 배경 필수
- 압축: 무손실

## ⚙️ 프로젝트에 적용

### iOS
```
ios/Ecostep/Images.xcassets/AppIcon.appiconset/
```

### Android
```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png (48x48)
├── mipmap-hdpi/ic_launcher.png (72x72)
├── mipmap-xhdpi/ic_launcher.png (96x96)
├── mipmap-xxhdpi/ic_launcher.png (144x144)
└── mipmap-xxxhdpi/ic_launcher.png (192x192)
```

## 🔧 수정 방법

1. `icon-es.svg` 파일을 벡터 그래픽 편집기로 열기 (VS Code, Adobe Illustrator, Inkscape 등)
2. 원하는 대로 수정
3. 저장 후 `preview-es.html`에서 결과 확인
4. PNG로 변환하여 사용

## 🎯 체크리스트

출시 전 확인사항:
- [ ] 1024x1024 PNG 생성 (iOS)
- [ ] 512x512 PNG 생성 (Android)
- [ ] 다양한 크기 PNG 생성 (Android)
- [ ] 투명 배경 없음 확인
- [ ] 파일 크기 최적화
- [ ] 실제 디바이스에서 테스트
