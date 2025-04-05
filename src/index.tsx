import React, { JSX, useEffect, useRef, useState } from 'react';

interface ContentRollerProps {
  messages: JSX.Element[];
  containerHeight?: number;
  stayDuration?: number;
}

const ContentRoller: React.FC<ContentRollerProps> = ({
  messages,
  containerHeight = 16,
  stayDuration = 3000,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  // 使用 ref 缓存当前活动的动画
  const horizontalAnimationRef = useRef<Animation>(null);
  const verticalAnimationRef = useRef<Animation>(null);

  // 清理旧动画
  const cleanupAnimations = () => {
    horizontalAnimationRef.current?.cancel();
    verticalAnimationRef.current?.cancel();
  };

  const needScrollToLeft = (index: number) => {
    const currentDom = wrapperRef.current?.querySelector(`#original-${index}`);
    if (!currentDom) return;
    const rect = currentDom.getBoundingClientRect();
    const containerWidth = wrapperRef.current?.clientWidth || 0;
    return rect.width > containerWidth;
  };

  const scrollToLeft = (index?: number) => {
    if (!wrapperRef.current) return;
    if (messages.length === 0) return;
    const nextIndex = index ?? currentIndex;
    if (!needScrollToLeft(nextIndex)) {
      setTimeout(() => {
        if (currentIndex === messages.length - 1) {
          return setCurrentIndex(currentIndex + 1);
        }
        setCurrentIndex(prev => (prev + 1) % messages.length);
      }, stayDuration);
      return;
    }

    const currentDom = wrapperRef.current?.querySelector(
      `#original-${nextIndex}`
    );
    if (!currentDom) return;

    const rect = currentDom.getBoundingClientRect();
    const containerWidth = wrapperRef.current?.clientWidth || 0;
    const scrollDistance = rect.width - containerWidth;
    horizontalAnimationRef.current?.cancel();
    horizontalAnimationRef.current = currentDom.animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(-${scrollDistance}px)` },
      ],
      {
        duration: 2000,
        easing: 'linear',
        fill: 'forwards',
      }
    );

    horizontalAnimationRef.current.onfinish = () => {
      setTimeout(() => {
        if (currentIndex === messages.length - 1) {
          return setCurrentIndex(currentIndex + 1);
        }
        setCurrentIndex(prev => (prev + 1) % messages.length);
      }, stayDuration);
    };
  };

  const scrollTopStep = () => {
    if (!wrapperRef.current) return;
    if (messages.length === 0) return;
    verticalAnimationRef.current = wrapperRef.current.animate(
      [
        { transform: `translateY(-${(currentIndex - 1) * containerHeight}px)` },
        { transform: `translateY(-${currentIndex * containerHeight}px)` },
      ],
      {
        duration: 500,
        easing: 'linear',
        fill: 'forwards',
        composite: 'replace' as const,
      }
    );

    // 使用 onfinish 替代 animationend 事件
    verticalAnimationRef.current.onfinish = () => {
      if (currentIndex >= messages.length) {
        verticalAnimationRef.current?.cancel();
        return setCurrentIndex(0);
      }
      setTimeout(() => {
        return scrollToLeft();
      }, 300);
    };
  };

  useEffect(() => {
    if (messages.length === 0) return;
    if (wrapperRef.current) {
      if (currentIndex === 0) {
        return scrollToLeft();
      }
      scrollTopStep();
    }
  }, [currentIndex]);

  useEffect(() => {
    return () => cleanupAnimations();
  }, [cleanupAnimations]);

  if (!messages?.length) return null;

  return (
    <div
      style={{
        flex: 1,
        height: containerHeight,
        overflow: 'hidden',
        position: 'relative',
        willChange: 'transform', // 提示浏览器优化
        transform: 'translateZ(0)', // 强制硬件加速
        backfaceVisibility: 'hidden' as const,
        fontSize: '12px',
      }}
    >
      <div
        style={{
          willChange: 'transform',
          position: 'absolute',
          width: '100%',
        }}
      >
        <div ref={wrapperRef}>
          {messages.map((msg, i) => (
            <div
              key={`original-${i}`}
              id={`original-${i}`}
              style={{
                width: 'fit-content',
                whiteSpace: 'nowrap',
                minWidth: '100%', // 至少和容器一样宽
                height: containerHeight,
                lineHeight: `${containerHeight}px`,
                fontSize: '12px',
              }}
            >
              {msg}
            </div>
          ))}
          <div
            key={`original-clone`}
            id={`original-clone`}
            style={{
              width: 'fit-content',
              whiteSpace: 'nowrap',
              minWidth: '100%', // 至少和容器一样宽
              height: containerHeight,
              lineHeight: `${containerHeight}px`,
              fontSize: '12px',
            }}
          >
            {messages[0]}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ContentRoller };
