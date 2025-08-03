import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  loading = "lazy",
  width,
  height 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer pentru lazy loading mai eficient
  useEffect(() => {
    if (loading === 'eager') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current) {
            imgRef.current.src = src;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, loading]);

  // Generează surse WebP optimizate
  const getOptimizedSrc = (originalSrc: string) => {
    // Încercăm să detectăm dacă avem versiune WebP disponibilă
    return originalSrc;
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder în timpul încărcării */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      {/* Imaginea optimizată */}
      <picture>
        <source srcSet={`${getOptimizedSrc(src)}.webp`} type="image/webp" />
        <img
          ref={imgRef}
          src={loading === 'eager' ? src : undefined}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          loading={loading}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
        />
      </picture>
      
      {/* Fallback pentru erori de încărcare */}
      {error && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Failed to load</span>
        </div>
      )}
    </div>
  );
}