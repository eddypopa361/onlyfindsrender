import { useState, useEffect, lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load Spline doar când este necesar
const Spline = lazy(() => import('@splinetool/react-spline'));

interface OptimizedSplineProps {
  scene: string;
  className?: string;
  fallback?: React.ReactNode;
  priority?: 'high' | 'low';
}

export default function OptimizedSpline({ 
  scene, 
  className = "", 
  fallback,
  priority = 'low' 
}: OptimizedSplineProps) {
  const [shouldLoad, setShouldLoad] = useState(priority === 'high');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (priority === 'high') return;

    // Încărcăm Spline doar când devine vizibil și cu delay pentru a nu bloca UI-ul
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Delay pentru a nu bloca thread-ul principal
            setTimeout(() => {
              setShouldLoad(true);
            }, 300);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const element = document.getElementById(`spline-${scene.replace(/[^a-zA-Z0-9]/g, '')}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [scene, priority]);

  const SplineLoader = () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <span className="text-sm text-gray-400">Loading 3D scene...</span>
      </div>
    </div>
  );

  const DefaultFallback = () => (
    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-900 to-black">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-primary/60 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-400 text-sm">3D Experience Loading</p>
      </div>
    </div>
  );

  return (
    <div 
      id={`spline-${scene.replace(/[^a-zA-Z0-9]/g, '')}`}
      className={`relative ${className}`}
    >
      {shouldLoad ? (
        <Suspense fallback={<SplineLoader />}>
          <Spline 
            scene={scene}
            style={{ 
              width: '100%', 
              height: '100%',
              // Optimizări pentru performanță
              contain: 'layout style paint',
              contentVisibility: 'auto'
            }}
            onLoad={() => {
              // Optimizare post-încărcare
              if (typeof requestIdleCallback !== 'undefined') {
                requestIdleCallback(() => {
                  console.log('Spline scene loaded');
                });
              }
            }}
          />
        </Suspense>
      ) : (
        fallback || <DefaultFallback />
      )}
    </div>
  );
}