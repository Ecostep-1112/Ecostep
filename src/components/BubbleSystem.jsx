import React, { useEffect, useRef, useState, memo } from 'react';

const BubbleSystem = memo(({ fishPositions = [] }) => {
  const [bubbles, setBubbles] = useState([]);
  const bubbleIdRef = useRef(0);

  // fishPositions를 ref로 저장하여 최신 위치 참조
  const fishPositionsRef = useRef(fishPositions);

  useEffect(() => {
    fishPositionsRef.current = fishPositions;
  }, [fishPositions]);

  useEffect(() => {
    if (fishPositions.length === 0) {
      return;
    }

    const intervals = [];

    // 각 물고기마다 기포 생성 인터벌 설정
    fishPositions.forEach((fish, index) => {
      const interval = setInterval(() => {
        // ref에서 최신 물고기 위치 가져오기
        const currentFish = fishPositionsRef.current[index];
        if (!currentFish) return;

        // 함수형 업데이트로 최신 bubbles 참조
        setBubbles(prev => {
          if (prev.length < 15) { // 최대 기포 수
            const newBubble = {
              id: bubbleIdRef.current++,
              x: currentFish.x + (Math.random() - 0.5) * 3,
              y: currentFish.y + 2,
              size: 1.5 + Math.random() * 2, // 1.5~3.5px
              duration: 4 + Math.random() * 2,
              delay: Math.random() * 0.2,
              wobble: Math.random() * 4 - 2
            };

            // 애니메이션 완료 후 제거
            setTimeout(() => {
              setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
            }, (newBubble.duration + newBubble.delay) * 1000);

            return [...prev, newBubble];
          }
          return prev;
        });
      }, 2500 + Math.random() * 1500); // 2.5-4초 간격

      intervals.push(interval);
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [fishPositions.length]); // 길이만 의존

  return (
    <div className="absolute inset-0 pointer-events-none z-[3]">
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute bubble"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animation: `bubbleRise ${bubble.duration}s linear ${bubble.delay}s forwards`,
            '--wobble': `${bubble.wobble}px`,
            willChange: 'transform, opacity'
          }}
        >
          <div
            className="w-full h-full rounded-full bg-white/50 border border-white/70"
            style={{
              boxShadow: 'inset -1px -1px 3px rgba(255,255,255,0.8), 0 0 4px rgba(255,255,255,0.3)'
            }}
          />
        </div>
      ))}
    </div>
  );
});

BubbleSystem.displayName = 'BubbleSystem';

export default BubbleSystem;