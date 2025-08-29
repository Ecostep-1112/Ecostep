import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5176;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5175', 'http://127.0.0.1:5175'],
  credentials: true
}));
app.use(express.json());

// Claude API configuration
const CLAUDE_API_KEY = process.env.VITE_CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

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

    // Check if API key exists
    if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'your-api-key-here' || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
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
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
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
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('Claude API request failed:', response.status, response.statusText);
      return res.json({ response: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    }

    const data = await response.json();
    const botResponse = data.content[0].text;
    
    res.json({ response: botResponse });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.json({ response: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
  }
});

// Environmental tip endpoint
app.post('/api/environmental-tip', async (req, res) => {
  try {
    // Check if API key exists
    if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'your-api-key-here' || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
      console.log('Using mock data - Claude API key not configured');
      return res.json(generateMockTip());
    }

    // Call Claude API
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `환경 보호와 제로웨이스트에 관한 실용적인 팁을 하나 생성해주세요. 
          
          다음 형식으로 JSON 응답을 보내주세요:
          {
            "title": "간단한 제목 (20자 이내)",
            "preview": "짧은 미리보기 텍스트 (40자 이내)",
            "content": "자세한 설명 (200자 이내, 실천 방법 포함)",
            "category": "카테고리 (재활용 팁, 생활 습관, 에너지 절약, 제로웨이스트 중 하나)"
          }
          
          실용적이고 한국에서 실천 가능한 내용으로 작성해주세요.`
        }]
      })
    });

    if (!response.ok) {
      console.error('Claude API request failed:', response.status, response.statusText);
      return res.json(generateMockTip());
    }

    const data = await response.json();
    
    // Extract JSON from Claude's response
    const content = data.content[0].text;
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend should run on http://localhost:5175`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  GET  http://localhost:${PORT}/api/health`);
  console.log(`  POST http://localhost:${PORT}/api/environmental-tip`);
  
  if (!CLAUDE_API_KEY || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
    console.log('\n⚠️  Claude API key not configured - using mock data');
  } else {
    console.log('\n✅ Claude API key configured');
  }
});