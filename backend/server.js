import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const app = express();
const PORT = process.env.PORT || 5176;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5175',
    'http://127.0.0.1:5175',
    'https://ecostep-production.up.railway.app',
    /\.railway\.app$/  // Railway 도메인 허용
  ],
  credentials: true
}));
app.use(express.json());

// Serve static files from the frontend build (dist folder)
// dotfiles: 'allow' enables serving .well-known folder for deep links
app.use(express.static(join(__dirname, '../dist'), { dotfiles: 'allow' }));

// Serve .well-known files for deep links (Android App Links & iOS Universal Links)
app.get('/.well-known/assetlinks.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json([
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.ecostep.app',
        sha256_cert_fingerprints: [
          'A9:3A:F9:86:FF:49:A7:F3:5A:38:5E:37:85:D7:69:C2:5F:37:5C:5C:2D:40:CB:CB:47:35:B3:F2:8E:AF:3D:78'
        ]
      }
    }
  ]);
});

app.get('/.well-known/apple-app-site-association', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    applinks: {
      apps: [],
      details: [
        {
          appID: 'T3CJMD5FX4.com.ecostep.app',
          paths: ['*']
        }
      ]
    }
  });
});

// Serve privacy policy
app.get('/privacy', (req, res) => {
  res.sendFile(join(__dirname, '../docs/privacy-policy.html'));
});

// Invite page - Smart App Banner style redirect
// 앱이 설치되어 있으면 딥링크로 열고, 없으면 스토어로 이동
app.get('/invite', (req, res) => {
  const { code } = req.query;
  const userAgent = req.headers['user-agent'] || '';
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);

  // 스토어 URL
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.ecostep.app';
  const appStoreUrl = 'https://apps.apple.com/app/ecostep/id6746597882';

  // 딥링크 스킴
  const deepLink = `ecostep://invite?code=${code || ''}`;

  // Intent URL (Android용 - 앱 없으면 Play Store로 자동 이동)
  const intentUrl = `intent://invite?code=${code || ''}#Intent;scheme=ecostep;package=com.ecostep.app;S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`;

  // 플랫폼별 스토어 URL 선택
  const storeUrl = isIOS ? appStoreUrl : playStoreUrl;

  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EcoStep 친구 초대</title>
  <meta property="og:title" content="EcoStep 친구 초대" />
  <meta property="og:description" content="Small Steps, Big Change. Why Not? 친구가 EcoStep에서 함께하고 싶어해요!" />
  <meta property="og:image" content="https://ecostep-production.up.railway.app/og-image.png" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: white;
    }
    .container {
      text-align: center;
      max-width: 320px;
    }
    .logo {
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 20px;
      margin: 0 auto 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 8px;
    }
    .subtitle {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 24px;
    }
    .invite-box {
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .invite-text {
      font-size: 14px;
      margin-bottom: 12px;
    }
    .invite-code {
      font-size: 18px;
      font-weight: bold;
      background: rgba(255,255,255,0.2);
      padding: 8px 16px;
      border-radius: 8px;
      display: inline-block;
    }
    .button {
      display: block;
      width: 100%;
      padding: 16px;
      background: white;
      color: #2563eb;
      font-size: 16px;
      font-weight: 600;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      text-decoration: none;
      margin-bottom: 12px;
    }
    .button:active {
      transform: scale(0.98);
    }
    .button.secondary {
      background: rgba(255,255,255,0.2);
      color: white;
    }
    .loading {
      font-size: 14px;
      opacity: 0.8;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">🌍</div>
    <h1>EcoStep</h1>
    <p class="subtitle">Small Steps, Big Change. Why Not?</p>

    <div class="invite-box">
      <p class="invite-text">친구가 EcoStep에서 함께하고 싶어해요!</p>
      ${code ? `<div class="invite-code">친구 아이디: ${code}</div>` : ''}
    </div>

    <a href="${storeUrl}" class="button" id="openBtn">앱에서 열기</a>
    <a href="${storeUrl}" class="button secondary">앱 다운로드</a>

    <p class="loading" id="loadingText">앱을 여는 중...</p>
  </div>

  <script>
    (function() {
      var isAndroid = ${isAndroid};
      var isIOS = ${isIOS};
      var deepLink = '${deepLink}';
      var intentUrl = '${intentUrl}';
      var storeUrl = '${storeUrl}';
      var loadingText = document.getElementById('loadingText');
      var openBtn = document.getElementById('openBtn');

      // 앱 열기 시도
      function tryOpenApp() {
        var startTime = Date.now();

        if (isAndroid) {
          // Android: Intent URL 사용 (앱 없으면 자동으로 Play Store 이동)
          window.location.href = intentUrl;
        } else if (isIOS) {
          // iOS: 딥링크 시도 후 타이머로 스토어 이동
          window.location.href = deepLink;

          setTimeout(function() {
            // 2초 후에도 페이지가 보이면 앱이 없는 것
            if (Date.now() - startTime < 2500) {
              loadingText.textContent = '앱이 설치되어 있지 않습니다. 스토어로 이동합니다...';
              setTimeout(function() {
                window.location.href = storeUrl;
              }, 500);
            }
          }, 2000);
        } else {
          // 데스크톱: 스토어 페이지로 안내
          loadingText.textContent = '모바일에서 접속해주세요.';
        }
      }

      // 버튼 클릭 이벤트
      openBtn.addEventListener('click', function(e) {
        e.preventDefault();
        tryOpenApp();
      });

      // 페이지 로드 시 자동으로 앱 열기 시도
      setTimeout(tryOpenApp, 500);
    })();
  </script>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Claude API configuration
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

// Naver API configuration
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY || 'dummy-key-for-mock',
});

// Load chatbot guidelines and documentation
let chatbotKnowledgeBase = '';

async function loadChatbotGuidelines() {
  try {
    // 필수 가이드라인만 로드 (성능 최적화)
    const essentialFiles = [
      'chatbot-guidelines.md'  // 핵심 가이드라인만 포함
    ];

    const guidelines = [];

    for (const filename of essentialFiles) {
      const filePath = join(__dirname, 'chatbot_md', filename);
      try {
        const content = await readFile(filePath, 'utf-8');
        guidelines.push(`\n\n=== ${filename} ===\n${content}`);
      } catch (err) {
        console.warn(`Warning: Could not load ${filename}:`, err.message);
      }
    }

    // 앱 기능 요약 (간략화된 정보)
    const appSummary = `

=== 앱 기능 요약 ===
에코스텝(EcoStep)은 환경 보호와 물고기 키우기를 결합한 모바일 앱입니다.

주요 기능:
1. 홈 화면: 아쿠아리움에서 물고기를 키우고, 환경 팁 카드를 확인
2. 커뮤니티: 친구 추가, 랭킹 확인, 초대 코드 공유
3. 챌린지:
   - 제로챌린지: 주간 플라스틱 목표 설정 및 달성
   - 일일챌린지: 매일 환경 챌린지 완료
4. 보상: 포인트로 물고기, 배경, 장식품 구매
5. 더보기: 고객센터, 앱 정보, 지도 검색

포인트 획득:
- 제로챌린지 완료: 10-100P (달성률에 따라)
- 일일챌린지 완료: 10P
- 친구 초대: 500P

랭킹 시스템:
- 브론즈(500P) → 실버(1,500P) → 골드(3,000P) → 플래티넘(5,000P)

문의 관련:
- 앱 내 고객센터에서 이메일로 연락 가능
`;

    chatbotKnowledgeBase = guidelines.join('\n') + appSummary;
    console.log(`✅ Loaded ${essentialFiles.length} essential chatbot guideline files`);
    console.log(`📚 Total knowledge base size: ${Math.round(chatbotKnowledgeBase.length / 1024)}KB`);
  } catch (error) {
    console.error('Error loading chatbot guidelines:', error);
    chatbotKnowledgeBase = ''; // Fallback to empty knowledge base
  }
}

// Load guidelines on startup
loadChatbotGuidelines();

// ================================
// 플라스틱 관련 키워드 (중앙 관리)
// ================================
const plasticKeywords = [
  '플라스틱', '비닐', '페트', 'pet', '일회용', '용기', '컵', '빨대',
  '봉지', '봉투', '포장', '배달', '텀블러', '에코백', '장바구니',
  '병', '보틀', '랩', '지퍼백', '스티로폼', '테이크아웃', '물티슈',
  '용품', '그릇', '수저', '포크', '젓가락', '나이프', '숟가락',
  '접시', '트레이', '캡', '뚜껑', '스트로우', '커피',
  '음료', '카페', '마트', '쇼핑', '포장지', '비닐랩', '샴푸',
  '세제', '리필', '패키지', '포장재', '택배', '박스',
  '버블랩', '에어캡', '완충재', '아이스팩', '보냉', '도시락'
];

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Chatbot endpoint
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if API key exists and is valid
    if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'your_claude_api_key_here' || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
      console.error('Claude API key not properly configured');
      return res.status(503).json({
        error: 'API_KEY_NOT_CONFIGURED',
        message: '챗봇 서비스가 일시적으로 사용 불가능합니다. 잠시 후 다시 시도해주세요.',
        retryable: true
      });
    }

    // Call Claude API for chatbot response
    const systemPrompt = chatbotKnowledgeBase
      ? `당신은 에코스텝(EcoStep) 앱의 고객센터 챗봇입니다.

아래는 당신이 반드시 따라야 할 가이드라인과 앱 사용 정보입니다.
답변하기 전에 먼저 chatbot-guidelines.md의 내용을 확인하고, 그에 기반하여 답변하세요.

특히 중요한 규칙:
1. **절대 사용 금지**: 개인정보, 기술 구현 세부사항(DB, API, 테이블명, 필드명 등) 언급 금지
2. **이모지 사용 금지**: 모든 답변에서 이모지를 절대 사용하지 마세요
3. **톤 앤 매너**: 간결하고 명확하게, 정중하고 친절하게, 긍정적으로
4. **답변 원칙**: 사용자 중심, 간결함, 정중함, 정확성

${chatbotKnowledgeBase}

위 가이드라인과 문서를 기반으로 사용자의 질문에 답변하세요.`
      : `당신은 에코스텝(EcoStep) 앱의 친절한 고객센터 챗봇입니다.
      에코스텝은 환경 보호와 물고기 키우기 게임을 결합한 모바일 앱입니다.

      항상 친절하고 도움이 되는 답변을 한국어로 제공하세요.
      이모지는 사용하지 마세요.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' }
        }
      ],
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    const botResponse = response.content[0].text;
    
    res.json({ response: botResponse });
    
  } catch (error) {
    console.error('Chatbot error:', error.message);
    
    // 크레딧 부족 에러 처리
    if (error.status === 400 && error.message.includes('credit balance')) {
      console.error('API credit balance is low');
      return res.status(503).json({
        error: 'API_CREDIT_LOW',
        message: '챗봇 서비스가 일시적으로 사용 불가능합니다. 잠시 후 다시 시도해주세요.',
        retryable: true
      });
    }

    // 일반 에러 처리
    res.status(500).json({
      error: 'CHATBOT_ERROR',
      message: '챗봇 응답 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      retryable: true
    });
  }
});

// Environmental tip endpoint
app.post('/api/environmental-tip', async (req, res) => {
  try {
    const { category } = req.body;

    // Check if API key exists
    if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'your-api-key-here' || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
      console.error('Claude API key not configured');
      return res.status(503).json({
        error: 'API_KEY_NOT_CONFIGURED',
        message: '환경 팁 서비스가 일시적으로 사용 불가능합니다. 잠시 후 다시 시도해주세요.',
        retryable: true
      });
    }

    // 카테고리별 프롬프트 생성
    let categoryPrompt = '';
    let categoryName = category || '랜덤';

    switch(categoryName) {
      case '재활용 팁':
        categoryPrompt = `재활용 팁 카테고리에서 실용적인 팁을 하나 생성해주세요.
        주제: 플라스틱, 종이, 유리, 금속 등의 올바른 분리배출 방법, 재활용품 활용법, 업사이클링 아이디어 등
        예시: 페트병 분리배출 방법, 우유팩 재활용, 커피 찌꺼기 활용법 등`;
        break;
      case '생활 습관':
        categoryPrompt = `생활 습관 카테고리에서 실용적인 팁을 하나 생성해주세요.
        주제: 일상생활에서 쉽게 실천할 수 있는 친환경 습관, 일회용품 줄이기, 친환경 소비 등
        예시: 텀블러 사용하기, 장바구니 휴대하기, 손수건 사용하기, 메쉬백으로 장보기 등`;
        break;
      case '에너지 절약':
        categoryPrompt = `에너지 절약 카테고리에서 실용적인 팁을 하나 생성해주세요.
        주제: 전기, 가스, 물 등의 에너지 절약 방법, 효율적인 에너지 사용법 등
        예시: 대기전력 차단하기, LED 전구 사용, 에어컨 적정 온도 유지, 찬물 세탁 등`;
        break;
      case '제로웨이스트':
        categoryPrompt = `제로웨이스트 카테고리에서 실용적인 팁을 하나 생성해주세요.
        주제: 쓰레기 제로를 목표로 하는 실천법, 친환경 대체품 사용, 무포장 제품 구매 등
        예시: 밀랍 랩 사용하기, 천연 수세미 사용, 고체 샴푸바, 스테인리스 빨대 등`;
        break;
      default:
        categoryPrompt = `환경 보호와 제로웨이스트에 관한 실용적인 팁을 하나 생성해주세요.
        카테고리는 재활용 팁, 생활 습관, 에너지 절약, 제로웨이스트 중 하나를 선택해주세요.`;
    }

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `${categoryPrompt}

        다음 형식으로 JSON 응답을 보내주세요:
        {
          "title": "간단한 제목 (20자 이내)",
          "preview": "짧은 미리보기 텍스트 (40자 이내)",
          "content": "자세한 설명 (200자 이내, 실천 방법 포함)",
          "category": "${categoryName === '랜덤' ? '카테고리 (재활용 팁, 생활 습관, 에너지 절약, 제로웨이스트 중 하나)' : categoryName}"
        }

        실용적이고 한국에서 실천 가능한 내용으로 작성해주세요.
        매번 다른 팁을 생성해주세요.`
      }]
    });

    // Extract JSON from Claude's response
    const content = response.content[0].text;
    let tipData;

    try {
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        tipData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      return res.status(500).json({
        error: 'PARSE_ERROR',
        message: 'AI 응답 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        retryable: true
      });
    }

    res.json({
      id: Date.now(),
      ...tipData
    });

  } catch (error) {
    console.error('Error generating environmental tip:', error);
    res.status(500).json({
      error: 'TIP_GENERATION_ERROR',
      message: '환경 팁 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      retryable: true
    });
  }
});

// Plastic weight calculation endpoint
app.post('/api/validate-plastic-challenge', async (req, res) => {
  try {
    const { challenge } = req.body;

    if (!challenge) {
      return res.status(400).json({ error: 'Challenge text is required' });
    }

    // Check if API key exists
    if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'your-api-key-here' || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
      console.log('Using fallback validation - Claude API key not configured');
      // Fallback validation logic
      const isRelated = plasticKeywords.some(keyword => challenge.toLowerCase().includes(keyword));
      const estimatedSavings = isRelated ? Math.floor(Math.random() * 20) + 5 : 0;

      return res.json({
        isValid: isRelated,
        savings: estimatedSavings,
        reason: isRelated ? '플라스틱 관련 챌린지로 인정됩니다.' : '플라스틱과 관련이 없는 챌린지입니다.'
      });
    }

    // Call Claude API for plastic challenge validation
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `다음 챌린지가 플라스틱 사용량 줄이기와 관련이 있는지 분석하고, 일일 플라스틱 절약량을 g 단위로 추정해주세요.

챌린지: "${challenge}"

다음 형식으로 JSON 응답을 보내주세요:
{
  "isValid": true/false,
  "savings": 숫자 (g 단위),
  "reason": "설명"
}

플라스틱 관련 키워드: 플라스틱, 비닐, 일회용, 컵, 빨대, 봉지, 포장, 용기, 병 등
일반적인 절약량 기준:
- 텀블러 사용: 15g
- 빨대 안쓰기: 2g
- 에코백 사용: 20g
- 배달음식 줄이기: 50g`
      }]
    });

    const content = response.content[0].text;
    let validationData;

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        validationData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      // Fallback
      const isRelated = plasticKeywords.some(keyword => challenge.toLowerCase().includes(keyword));
      validationData = {
        isValid: isRelated,
        savings: isRelated ? Math.floor(Math.random() * 20) + 5 : 0,
        reason: isRelated ? '플라스틱 관련 챌린지로 인정됩니다.' : '플라스틱과 관련이 없는 챌린지입니다.'
      };
    }

    res.json(validationData);
  } catch (error) {
    console.error('Plastic challenge validation error:', error);
    res.status(500).json({ error: 'Failed to validate plastic challenge' });
  }
});

// Plastic item category classification endpoint
app.post('/api/classify-plastic-item', async (req, res) => {
  try {
    const { itemName } = req.body;

    if (!itemName) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    // Check if API key exists
    if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'your-api-key-here' || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
      console.log('Using fallback classification - Claude API key not configured');

      // Simple keyword-based fallback classification
      const lowerName = itemName.toLowerCase();
      let category = null;
      let isPlastic = false;

      isPlastic = plasticKeywords.some(keyword => lowerName.includes(keyword));

      if (isPlastic) {
        if (lowerName.includes('병') || lowerName.includes('보틀')) category = 'bottle';
        else if (lowerName.includes('컵')) category = 'cup';
        else if (lowerName.includes('봉지') || lowerName.includes('봉투')) category = 'bag';
        else if (lowerName.includes('용기') || lowerName.includes('도시락')) category = 'container';
        else if (lowerName.includes('빨대')) category = 'straw';
        else if (lowerName.includes('수저') || lowerName.includes('포크')) category = 'utensil';
        else category = 'other';
      }

      return res.json({
        isPlastic,
        category,
        confidence: isPlastic ? 'medium' : 'high'
      });
    }

    // Call Claude API for plastic classification
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `다음 아이템이 플라스틱 제품인지 판단하고, 플라스틱이라면 적절한 카테고리로 분류해주세요.

아이템: "${itemName}"

다음 형식으로 JSON 응답을 보내주세요:
{
  "isPlastic": true/false,
  "category": "bottle/cup/bag/container/straw/utensil/packaging/other" 또는 null (비플라스틱인 경우),
  "confidence": "high/medium/low"
}

카테고리 설명:
- bottle: 물병, 음료수병 등
- cup: 일회용 컵, 커피컵 등
- bag: 비닐봉지, 쇼핑백 등
- container: 도시락, 포장용기 등
- straw: 빨대
- utensil: 포크, 숟가락, 젓가락 등
- packaging: 포장재, 랩 등
- other: 기타 플라스틱 제품

만약 플라스틱이 아닌 제품이라면 isPlastic: false, category: null로 응답해주세요.`
      }]
    });

    const content = response.content[0].text;
    let classificationData;

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        classificationData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      // Fallback
      classificationData = {
        isPlastic: false,
        category: null,
        confidence: 'low'
      };
    }

    res.json(classificationData);
  } catch (error) {
    console.error('Plastic item classification error:', error);
    res.status(500).json({ error: 'Failed to classify plastic item' });
  }
});

// Plastic item weight calculation endpoint
app.post('/api/validate-plastic-item', async (req, res) => {
  try {
    const { itemName } = req.body;

    if (!itemName) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    // Check if API key exists
    if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'your-api-key-here' || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
      console.log('Using fallback estimation - Claude API key not configured');
      // Fallback estimation logic
      const defaultWeights = {
        '플라스틱병': 20, '음료수병': 20, '물병': 20,
        '컵': 15, '일회용컵': 15, '커피컵': 15,
        '봉지': 5, '비닐봉지': 5, '쇼핑백': 10,
        '용기': 30, '포장용기': 30, '도시락': 35,
        '빨대': 1, '포크': 3, '수저': 4
      };

      const estimatedWeight = defaultWeights[itemName] || 10;
      return res.json({
        weight: estimatedWeight,
        confidence: 'medium',
        description: `${itemName}의 예상 무게는 ${estimatedWeight}g입니다.`
      });
    }

    // Call Claude API for plastic item weight estimation
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `다음 플라스틱 아이템의 개당 무게를 g 단위로 추정해주세요.

아이템: "${itemName}"

다음 형식으로 JSON 응답을 보내주세요:
{
  "weight": 숫자 (g 단위),
  "confidence": "high/medium/low",
  "description": "설명"
}

일반적인 플라스틱 아이템 무게 참고:
- 페트병 (500ml): 20g
- 일회용 컵: 15g
- 비닐봉지: 5g
- 플라스틱 용기: 25-40g
- 빨대: 1-2g
- 포크/스푼: 3-5g`
      }]
    });

    const content = response.content[0].text;
    let weightData;

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        weightData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      // Fallback
      weightData = {
        weight: 10,
        confidence: 'low',
        description: `${itemName}의 예상 무게는 약 10g입니다. (추정값)`
      };
    }

    res.json(weightData);
  } catch (error) {
    console.error('Plastic item validation error:', error);
    res.status(500).json({ error: 'Failed to validate plastic item' });
  }
});

// Naver Local Search API endpoint
app.post('/api/naver-local-search', async (req, res) => {
  try {
    const { query, display = 100 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Check if Naver API keys are configured
    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
      console.error('Naver API keys not configured');
      return res.status(503).json({
        error: 'NAVER_API_NOT_CONFIGURED',
        message: '장소 검색 서비스가 일시적으로 사용 불가능합니다.',
        retryable: false
      });
    }

    console.log(`🔍 네이버 Local Search: "${query}" (최대 ${display}개)`);

    // Call Naver Local Search API
    const response = await fetch(
      `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=${display}`,
      {
        headers: {
          'X-Naver-Client-Id': NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Naver API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'NAVER_API_ERROR',
        message: '장소 검색 중 오류가 발생했습니다.',
        details: errorText
      });
    }

    const data = await response.json();

    // Transform Naver API response to our format
    const places = data.items?.map(item => ({
      name: item.title.replace(/<[^>]*>/g, ''), // Remove HTML tags
      address: item.address,
      roadAddress: item.roadAddress,
      lat: parseFloat(item.mapy) / 10000000, // Naver uses coordinates multiplied by 10^7
      lng: parseFloat(item.mapx) / 10000000,
      category: item.category,
      description: item.description?.replace(/<[^>]*>/g, '') || ''
    })) || [];

    console.log(`✅ 검색 완료: ${places.length}개 장소 발견`);
    res.json({ places });
  } catch (error) {
    console.error('❌ 네이버 Local Search API 에러:', error.message);
    res.status(500).json({
      error: 'SEARCH_ERROR',
      message: '장소 검색 중 오류가 발생했습니다.',
      retryable: true
    });
  }
});

// Catch-all route: serve index.html for any non-API requests (SPA routing support)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : `http://localhost:${PORT}`;

  console.log(`\n🚀 EcoStep Server running on ${baseUrl}`);
  console.log(`📱 Port: ${PORT}`);
  console.log(`\n✅ Serving frontend app from /dist`);
  console.log(`\nAvailable API endpoints:`);
  console.log(`  GET  ${baseUrl}/api/health`);
  console.log(`  POST ${baseUrl}/api/chatbot`);
  console.log(`  POST ${baseUrl}/api/environmental-tip`);
  console.log(`  POST ${baseUrl}/api/validate-plastic-challenge`);
  console.log(`  POST ${baseUrl}/api/classify-plastic-item`);
  console.log(`  POST ${baseUrl}/api/validate-plastic-item`);
  console.log(`  POST ${baseUrl}/api/naver-local-search`);

  if (!CLAUDE_API_KEY || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
    console.log('\n⚠️  Claude API key not configured - using mock data');
  } else {
    console.log('\n✅ Claude API key configured');
  }

  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    console.log('⚠️  Naver API keys not configured - place search unavailable');
  } else {
    console.log('✅ Naver API keys configured');
  }
});

// Keep the process alive
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});