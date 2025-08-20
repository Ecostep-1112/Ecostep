import React, { useEffect, useRef, useState } from 'react';

const BubbleSystem = ({ fishPositions = [] }) => {
  const [bubbles, setBubbles] = useState([]);
  const bubbleIdRef = useRef(0);

  useEffect(() => {
    const intervals = [];
    
    // 각 물고기마다 기포 생성 인터벌 설정
    fishPositions.forEach((fish, index) => {
      const interval = setInterval(() => {
        if (bubbles.length < 8) { // 최대 기포 수 제한 (더 적게)
          createBubble(fish, index);
        }
      }, 3000 + Math.random() * 2000); // 3-5초 간격 (더 천천히)
      
      intervals.push(interval);
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [fishPositions]);

  const createBubble = (fishPos, fishIndex) => {
    const newBubble = {
      id: bubbleIdRef.current++,
      x: fishPos.x + (Math.random() - 0.5) * 10,
      y: fishPos.y,
      size: 1.5 + Math.random() * 2,
      duration: 4 + Math.random() * 2, // 4-6초로 더 느리게
      delay: Math.random() * 0.2, // 딜레이 감소
      wobble: Math.random() * 4 - 2 // 흔들림 감소
    };

    setBubbles(prev => [...prev, newBubble]);

    // 애니메이션 완료 후 제거
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
    }, (newBubble.duration + newBubble.delay) * 1000);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-[3]">
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute bubble"
          style={{
            left: `${bubble.x}px`,
            top: `${bubble.y}px`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animation: `bubbleRise ${bubble.duration}s cubic-bezier(0.4, 0.0, 0.6, 1) ${bubble.delay}s forwards`,
            '--wobble': `${bubble.wobble}px`
          }}
        >
          <div 
            className="w-full h-full rounded-full bg-white/30 border border-white/50"
            style={{
              boxShadow: 'inset -1px -1px 2px rgba(255,255,255,0.5)'
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default BubbleSystem;