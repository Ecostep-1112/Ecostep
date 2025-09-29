import jwt from 'jsonwebtoken';
import fs from 'fs';

// Apple Developer 정보를 입력하세요
const teamId = 'T3CJMD5FX4'; // 10자리 Team ID
const serviceId = 'com.ecostep.web'; // Service ID
const keyId = '4275X64M34'; // Key ID
const privateKeyPath = './AuthKey_4275X64M34.p8'; // .p8 파일 경로

// Private Key 읽기
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

// JWT 생성
const claims = {
  iss: teamId,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 86400 * 180, // 6개월 유효
  aud: 'https://appleid.apple.com',
  sub: serviceId
};

const token = jwt.sign(claims, privateKey, {
  algorithm: 'ES256',
  keyid: keyId
});

console.log('\n=== Apple Client Secret (JWT) ===\n');
console.log(token);
console.log('\n=== 이 secret은 6개월간 유효합니다 ===\n');

// 파일로도 저장
fs.writeFileSync('apple-client-secret.txt', token);
console.log('Secret이 apple-client-secret.txt 파일에 저장되었습니다.');