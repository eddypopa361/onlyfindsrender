import { useState, useEffect, useRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

/**
 * Componenta pentru încărcarea lazy a secțiunilor
 * Optimizează performanța prin randarea doar când secțiunea devine vizibilă
 */
export default function LazySection({
  children,
  fallback,
  rootMargin = '100px',
  threshold = 0.1,
  className = ''
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.unobserve(element);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold, hasLoaded]);

  const DefaultFallback = () => (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-gray-400 text-sm">Loading section...</p>
      </div>
    </div>
  );

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : (fallback || <DefaultFallback />)}
    </div>
  );
}