import React, { memo } from 'react';
import FishIcons from './FishIcons';

const FishItem = memo(({ fish, index }) => {
  const FishIcon = FishIcons[fish.name];
  const isMoving = fish.speed > 0;

  // 물고기가 어항 경계를 벗어나지 않도록 추가 제한
  const clampedX = Math.max(4, Math.min(96, fish.x));
  const clampedY = Math.max(5, Math.min(95, fish.y));

  if (!FishIcon) return null;

  return (
    <div
      className="absolute"
      style={{
        left: `${clampedX}%`,
        top: `${clampedY}%`,
        transform: `translate3d(-50%, -50%, 0) scaleX(${-fish.direction})`,
        willChange: 'transform',
      }}
    >
      <FishIcon size={35} isMoving={isMoving} />
    </div>
  );
});

FishItem.displayName = 'FishItem';

const FishRenderer = memo(({ fishPositions = [] }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden">
      {fishPositions.map((fish, i) => (
        <FishItem key={i} fish={fish} index={i} />
      ))}
    </div>
  );
});

FishRenderer.displayName = 'FishRenderer';

export default FishRenderer;
