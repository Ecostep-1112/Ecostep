import React, { memo } from 'react';
import DecorationIcons from './DecorationIcons';

const DecorationItem = memo(({
  decoName,
  index,
  position,
  settings,
  isDragging,
  isSelected,
  onTouchStart,
  onTouchEnd,
  onMouseDown,
  onMouseUp,
  onDoubleClick
}) => {
  const DecoIcon = DecorationIcons[decoName];
  const isCurrentlyDragging = isDragging === decoName;

  // 크기 계산 (50% ~ 150%)
  const scaledSize = Math.round(25 * (settings.size / 100));
  // 회전 값
  const rotationValue = settings.rotation || 0;

  if (!DecoIcon) return null;

  return (
    <div
      className={`absolute z-[2] ${isCurrentlyDragging ? 'cursor-move' : 'cursor-pointer'}`}
      style={{
        ...position,
        transform: `translateX(-50%)`,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none', // iOS 롱프레스 메뉴 방지
        touchAction: 'none', // iOS 줌/스크롤 방지
        pointerEvents: isDragging && isDragging !== decoName ? 'none' : 'auto'
      }}
      onTouchStart={(e) => onTouchStart(e, decoName)}
      onTouchEnd={(e) => onTouchEnd(e, decoName)}
      onMouseDown={(e) => onMouseDown(e, decoName)}
      onMouseUp={(e) => onMouseUp(e, decoName)}
      onDoubleClick={(e) => onDoubleClick(e, decoName)}
    >
      <div
        className={`transition-all duration-200 relative`}
        style={{
          transform: `rotate(${rotationValue}deg) ${isCurrentlyDragging ? 'scale(1.1)' : 'scale(1)'}`,
          opacity: isCurrentlyDragging ? 0.8 : 1,
          transformOrigin: 'center bottom'
        }}
      >
        {React.createElement(DecoIcon, { size: scaledSize })}
        {/* 드래그 모드일 때 시각적 피드백 */}
        {isCurrentlyDragging && (
          <div className="absolute -inset-2 border-2 border-white/50 border-dashed rounded-full animate-pulse"></div>
        )}
      </div>
    </div>
  );
});

DecorationItem.displayName = 'DecorationItem';

export default DecorationItem;
