import React, { useMemo, useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface VirtualScrollingProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  className?: string;
}

/**
 * Componentă pentru virtual scrolling - optimizează randarea listelor mari
 * Randează doar elementele vizibile pentru performanță maximă
 */
export default function VirtualScrolling({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
  renderItem,
  className = ""
}: VirtualScrollingProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Calculează care elemente trebuie randate
  const visibleRange = useMemo(() => {
    if (!isVisible) return { start: 0, end: 0 };

    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(items.length, start + visibleCount + overscan * 2);

    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length, isVisible]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Înălțimea totală a containerului
  const totalHeight = items.length * itemHeight;

  // Offset pentru poziționarea corectă
  const offsetY = visibleRange.start * itemHeight;

  // Elementele vizibile
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  return (
    <div
      ref={elementRef as any}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) =>
            renderItem(item, visibleRange.start + index)
          )}
        </div>
      </div>
    </div>
  );
}