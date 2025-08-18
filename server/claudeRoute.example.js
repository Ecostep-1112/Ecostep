// 백엔드 서버 예시 코드 (Express.js)
// 실제 구현 시 참고용
// Claude API 키는 환경 변수로 관리해야 합니다

const express = require('express');
const router = express.Router();

// Claude API 설정
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY; // 환경 변수에서 API 키 가져오기
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

router.post('/api/claude', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: prompt
        }],
        system: '당신은 환경 보호 전문가입니다. 실용적이고 쉽게 실천할 수 있는 환경 보호 팁을 제공해주세요. 응답은 반드시 JSON 형식으로 해주세요.'
      })
    });

    const data = await response.json();
    
    // Claude 응답 파싱
    const tipContent = JSON.parse(data.content[0].text);
    
    res.json({
      id: Date.now(),
      ...tipContent
    });
  } catch (error) {
    console.error('Claude API 오류:', error);
    
    // 오류 시 기본 팁 반환
    const defaultTips = [
      {
        id: Date.now(),
        title: '텀블러 사용하기',
        preview: '일회용 컵 대신 텀블러를 사용해 환경을 보호해요',
        content: '텀블러 하나로 연간 약 300개의 일회용 컵을 절약할 수 있습니다. 많은 카페에서 텀블러 할인도 제공하니 경제적이기도 해요. 보온보냉 기능이 있는 텀블러를 선택하면 음료를 더 오래 즐길 수 있습니다.',
        category: '생활 습관'
      }
    ];
    
    res.json(defaultTips[0]);
  }
});

module.exports = router;

// .env 파일 예시
// CLAUDE_API_KEY=sk-ant-api03-xxxxxxxxxxxxx