import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * Hook pentru detectarea vizibilității elementelor
 * Optimizează performanța prin încărcarea lazy
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0,
    rootMargin = '0px',
    freezeOnceVisible = false,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Dacă a fost deja vizibil și avem freeze activat, nu mai observăm
    if (hasBeenVisible && freezeOnceVisible) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementVisible = entry.isIntersecting;
        setIsVisible(isElementVisible);

        if (isElementVisible && !hasBeenVisible) {
          setHasBeenVisible(true);
        }

        // Dacă freeze e activat și elementul a devenit vizibil, oprim observarea
        if (isElementVisible && freezeOnceVisible) {
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, freezeOnceVisible, hasBeenVisible]);

  return {
    elementRef,
    isVisible,
    hasBeenVisible,
  };
}