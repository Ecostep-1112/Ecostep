import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Anthropic from '@anthropic-ai/sdk';

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

// Claude API configuration
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY || 'dummy-key-for-mock',
});

// Helper function to generate mock tips
const generateMockTip = () => {
  const tips = [
    {
      title: '밀랍 랩 사용하기',
      preview: '일회용 비닐랩 대신 재사용 가능한 밀랍 랩을 사용해보세요',
      content: '밀랍 랩은 천연 밀랍과 면 천으로 만든 친환경 식품 포장재입니다. 비닐랩과 달리 1년 이상 재사용이 가능하며, 사용 후에는 100% 생분해됩니다. 야채, 과일, 남은 음식을 싸거나 그릇을 덮을 때 사용하세요. 손의 온기로 살짝 눌러주면 밀착되어 신선도를 유지할 수 있습니다.',
      category: '제로웨이스트'
    },
    {
      title: '메쉬백으로 장보기',
      preview: '과일과 채소 구매 시 메쉬백을 활용해 비닐봉지를 줄여보세요',
      content: '재사용 가능한 메쉬백은 과일과 채소를 담기에 완벽합니다. 통기성이 좋아 신선도 유지에도 도움이 되고, 가벼워서 휴대하기도 편합니다. 마트에서 제공하는 비닐봉지 대신 메쉬백을 사용하면 연간 수백 개의 비닐 사용을 줄일 수 있습니다. 사용 후에는 세탁기에 넣어 간단히 세척할 수 있어요.',
      category: '생활 습관'
    },
    {
      title: '커피 찌꺼기 활용법',
      preview: '버려지는 커피 찌꺼기를 천연 탈취제로 재활용해보세요',
      content: '커피를 내리고 남은 찌꺼기는 훌륭한 천연 탈취제입니다. 잘 말린 후 망사 주머니에 넣어 신발장, 냉장고, 차량에 두면 냄새를 흡수합니다. 또한 하수구에 뿌리면 기름때 제거에 효과적이고, 화분에 뿌리면 천연 비료가 됩니다. 일주일에 한 번씩 교체하면 효과적으로 사용할 수 있습니다.',
      category: '재활용 팁'
    },
    {
      title: '대기전력 차단하기',
      preview: '멀티탭 스위치로 대기전력을 차단해 전기를 절약하세요',
      content: '가전제품의 대기전력은 전체 전력 사용량의 10%를 차지합니다. 스위치가 있는 멀티탭을 사용하면 사용하지 않는 가전제품의 전원을 쉽게 차단할 수 있습니다. TV, 컴퓨터, 충전기 등을 사용하지 않을 때는 멀티탭 스위치를 꺼두세요. 월 전기료를 5-10% 절감할 수 있습니다.',
      category: '에너지 절약'
    },
    {
      title: '천연 수세미 사용',
      preview: '플라스틱 수세미 대신 천연 수세미를 사용해보세요',
      content: '수세미 열매로 만든 천연 수세미는 플라스틱 수세미와 달리 미세플라스틱을 배출하지 않습니다. 설거지할 때 세제 사용량도 줄일 수 있고, 사용 후에는 퇴비로 만들 수 있어 100% 자연 순환됩니다. 3-4개월마다 교체하면 위생적으로 사용할 수 있으며, 삶아서 소독하면 더 오래 사용할 수 있습니다.',
      category: '제로웨이스트'
    }
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  return {
    id: Date.now(),
    ...randomTip
  };
};

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'EcoStep Backend API Server', 
    status: 'Running',
    endpoints: [
      'GET /api/health - Health check',
      'POST /api/environmental-tip - Get environmental tip'
    ]
  });
});

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
    if (!CLAUDE_API_KEY || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
      console.log('Using mock response - API key not properly configured');
      // Return a helpful mock response
      const mockResponses = [
        '네, 도와드릴게요! 에코스텝은 환경 보호와 재미있는 물고기 키우기를 결합한 앱입니다.',
        '플라스틱 사용을 줄이면 포인트를 받아 새로운 물고기를 구매할 수 있어요!',
        '매일 챌린지를 완료하면 보상을 받을 수 있습니다. 오늘도 환경 보호에 동참해주세요!',
        '친구를 초대하면 추가 포인트를 받을 수 있어요. 함께 환경을 지켜요!',
        '앱 사용 중 문제가 있으시면 구체적으로 알려주세요. 도와드리겠습니다!'
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      return res.json({ response: randomResponse });
    }

    // Call Claude API for chatbot response
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      system: `당신은 에코스텝(EcoStep) 앱의 친절한 고객센터 챗봇입니다. 
      에코스텝은 환경 보호와 물고기 키우기 게임을 결합한 모바일 앱입니다.
      주요 기능:
      - 플라스틱 사용량 추적 및 감소 목표 설정
      - 가상 물고기 키우기 (12종류)
      - 수족관 커스터마이징
      - 일일/주간 챌린지
      - 친구 랭킹 시스템
      - 제로웨이스트 지도
      - 환경 팁 제공
      
      항상 친절하고 도움이 되는 답변을 한국어로 제공하세요.
      이모지를 적절히 사용하여 친근한 분위기를 만드세요.`,
      messages: [
        {
          role: 'user',
          content: `다음 질문에 대한 답변을 간결하게, 정중한 말투로, 필요없는 정보와 이모티콘 없이 답해줘. ${message}`
        }
      ]
    });

    const botResponse = response.content[0].text;
    
    res.json({ response: botResponse });
    
  } catch (error) {
    console.error('Chatbot error:', error.message);
    
    // 크레딧 부족 에러 처리
    if (error.status === 400 && error.message.includes('credit balance')) {
      console.log('API credit balance is low - using mock response');
      const mockResponses = [
        '안녕하세요! 에코스텝은 환경 보호와 재미있는 물고기 키우기를 결합한 앱입니다. 플라스틱 사용을 줄이면서 가상 물고기를 키울 수 있어요! 🐠',
        '에코스텝은 일상에서 플라스틱 사용을 추적하고 줄이도록 도와드립니다. 목표를 달성하면 포인트를 받아 새로운 물고기와 장식품을 구매할 수 있어요!',
        '매일 챌린지에 참여하고, 친구들과 랭킹을 경쟁하며 환경 보호에 동참해보세요! 함께 지구를 지켜요! 🌍',
        '물고기를 키우면서 환경 보호도 실천할 수 있는 에코스텝! 오늘부터 시작해보세요! 💚'
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      return res.json({ response: randomResponse });
    }
    
    res.json({ response: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
  }
});

// Environmental tip endpoint
app.post('/api/environmental-tip', async (req, res) => {
  try {
    const { category } = req.body;

    // Check if API key exists
    if (!CLAUDE_API_KEY || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
      console.log('Using mock data - Claude API key not configured');
      return res.json(generateMockTip());
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
      return res.json(generateMockTip());
    }

    res.json({
      id: Date.now(),
      ...tipData
    });

  } catch (error) {
    console.error('Error generating environmental tip:', error);
    res.json(generateMockTip());
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
    if (!CLAUDE_API_KEY || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
      console.log('Using fallback validation - Claude API key not configured');
      // Fallback validation logic
      const plasticKeywords = ['플라스틱', '비닐', '일회용', '컵', '빨대', '봉지', '포장'];
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
      const plasticKeywords = ['플라스틱', '비닐', '일회용', '컵', '빨대', '봉지', '포장'];
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
    if (!CLAUDE_API_KEY || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
      console.log('Using fallback classification - Claude API key not configured');

      // Simple keyword-based fallback classification
      const lowerName = itemName.toLowerCase();
      let category = null;
      let isPlastic = false;

      const plasticKeywords = [
        '플라스틱', '비닐', '페트', 'pet', '일회용', '용기', '컵', '빨대',
        '봉지', '봉투', '포장', '배달', '텀블러', '에코백', '장바구니',
        '병', '보틀', '랩', '지퍼백', '스티로폼', '테이크아웃', '물티슈'
      ];

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
    if (!CLAUDE_API_KEY || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
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

  console.log(`\n🚀 Backend server running on ${baseUrl}`);
  console.log(`📱 Port: ${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  ${baseUrl}/`);
  console.log(`  GET  ${baseUrl}/api/health`);
  console.log(`  POST ${baseUrl}/api/chatbot`);
  console.log(`  POST ${baseUrl}/api/environmental-tip`);
  console.log(`  POST ${baseUrl}/api/validate-plastic-challenge`);
  console.log(`  POST ${baseUrl}/api/classify-plastic-item`);
  console.log(`  POST ${baseUrl}/api/validate-plastic-item`);

  if (!CLAUDE_API_KEY || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
    console.log('\n⚠️  Claude API key not configured - using mock data');
  } else {
    console.log('\n✅ Claude API key configured');
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