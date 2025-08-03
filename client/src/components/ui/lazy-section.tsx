import { useState, useRef, useEffect, ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  fallback?: ReactNode;
}

export function LazySection({ 
  children, 
  className = "", 
  threshold = 0.1, 
  rootMargin = "100px",
  fallback 
}: LazySectionProps) {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={sectionRef} className={`lazy-loading gpu-accelerated ${className}`}>
      {isInView ? children : (fallback || <div className="h-64 bg-gray-900/20 animate-pulse rounded-lg" />)}
    </div>
  );
}