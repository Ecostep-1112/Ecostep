// Firebase를 통한 Apple 로그인 (Apple Developer Program 없이 가능)
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, OAuthProvider } from 'firebase/auth';

// Firebase 설정 (Firebase Console에서 가져오기)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Apple 로그인 함수
export const signInWithAppleViaFirebase = async () => {
  try {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // 사용자 정보 반환
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    };
  } catch (error) {
    console.error('Apple 로그인 에러:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Firebase 설정 단계:
// 1. https://console.firebase.google.com 접속
// 2. 프로젝트 생성
// 3. Authentication 활성화
// 4. Sign-in providers에서 Apple 활성화
// 5. Apple Developer Program 없이도 작동 (단, 웹에서만)