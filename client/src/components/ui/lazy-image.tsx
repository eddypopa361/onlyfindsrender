import { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function LazyImage({ src, alt, className = "", fallbackClassName = "" }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={containerRef} className={`relative lazy-loading gpu-accelerated ${className}`}>
      {!isInView && (
        <div className={`absolute inset-0 bg-gray-900/50 animate-pulse ${fallbackClassName}`} />
      )}
      
      {isInView && !hasError && (
        <picture>
          <source srcSet={`${src}.webp`} type="image/webp" />
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            loading="lazy"
            className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
      )}
      
      {isInView && hasError && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-900/50 ${fallbackClassName}`}>
          <HelpCircle className="w-12 h-12 text-primary" />
        </div>
      )}
    </div>
  );
}